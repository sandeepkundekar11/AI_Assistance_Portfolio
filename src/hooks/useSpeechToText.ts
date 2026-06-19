import { useState, useRef, useEffect, useCallback } from "react";

export function useSpeechToText(
  onTranscript: (text: string) => void,
  onSilenceTimeout?: (finalText: string) => void,
  onStartSpeech?: () => void
) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<any>(null);
  const accumulatedTextRef = useRef<string>("");

  // Keep references to the latest callbacks to avoid recreating the recognition instance on every render
  const onTranscriptRef = useRef(onTranscript);
  const onSilenceTimeoutRef = useRef(onSilenceTimeout);
  const onStartSpeechRef = useRef(onStartSpeech);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onSilenceTimeoutRef.current = onSilenceTimeout;
    onStartSpeechRef.current = onStartSpeech;
  }, [onTranscript, onSilenceTimeout, onStartSpeech]);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Mobile Safari and Android Chrome handle continuous mode poorly,
      // so we use single-phrase recognition + interim results for mobile devices
      rec.continuous = !isMobile;
      rec.interimResults = isMobile;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
        accumulatedTextRef.current = "";
        if (onStartSpeechRef.current) {
          onStartSpeechRef.current();
        }
      };

      rec.onresult = (event: any) => {
        let newTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newTranscript += event.results[i][0].transcript;
          } else if (isMobile) {
            // For mobile interim results, capture active speech
            newTranscript += event.results[i][0].transcript;
          }
        }

        if (newTranscript.trim()) {
          if (isMobile) {
            accumulatedTextRef.current = newTranscript.trim();
            onTranscriptRef.current(newTranscript.trim());
          } else {
            const currentAccumulated = accumulatedTextRef.current
              ? `${accumulatedTextRef.current} ${newTranscript.trim()}`
              : newTranscript.trim();
            
            accumulatedTextRef.current = currentAccumulated;
            onTranscriptRef.current(currentAccumulated);

            // Clear any existing silence timer
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
            }

            // Start a new 3-second timer for desktop
            silenceTimeoutRef.current = setTimeout(() => {
              setIsListening(false);
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (e) {}
              }
              if (onSilenceTimeoutRef.current) {
                onSilenceTimeoutRef.current(accumulatedTextRef.current);
              }
              accumulatedTextRef.current = "";
            }, 3000);
          }
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        
        let errorMsg = `Speech recognition error: ${event.error}`;
        if (event.error === 'not-allowed') {
          errorMsg = "Microphone access denied. Please verify your browser and site microphone permissions.";
        } else if (event.error === 'service-not-allowed') {
          errorMsg = "Speech recognition service blocked by browser or system policies.";
        }
        
        setError(errorMsg);
        alert(errorMsg);

        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        // If mobile finished speaking (continuous=false triggers automatic end)
        if (isMobile && accumulatedTextRef.current.trim()) {
          if (onSilenceTimeoutRef.current) {
            onSilenceTimeoutRef.current(accumulatedTextRef.current);
          }
          accumulatedTextRef.current = "";
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser/device. Please try Google Chrome, Microsoft Edge, or Safari.");
      return;
    }

    // Microphone access requires a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      alert(
        "Microphone access blocked: Speech recognition requires a secure connection (HTTPS).\n\n" +
        "If you are testing on a mobile device over your local network IP (e.g. http://192.168.x.x:5173), " +
        "browsers block microphone access by default. Please configure HTTPS for your dev server or test via localhost."
      );
      return;
    }

    if (isListening) {
      stopSpeechRecognition();
    } else {
      try {
        setError(null);
        accumulatedTextRef.current = "";
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  }, [isListening, stopSpeechRecognition]);

  return {
    isListening,
    toggleListening,
    stopSpeechRecognition,
    error,
    isSupported: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
  };
}
