import { useState, useRef, useEffect, useCallback } from "react";

export function useSpeechToText(
  onTranscript: (text: string) => void,
  onSilenceTimeout?: (finalText: string) => void,
  onStartSpeech?: () => void
) {
  const [isListening, setIsListening] = useState(false);
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
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
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
          }
        }

        if (newTranscript.trim()) {
          const currentAccumulated = accumulatedTextRef.current
            ? `${accumulatedTextRef.current} ${newTranscript.trim()}`
            : newTranscript.trim();
          
          accumulatedTextRef.current = currentAccumulated;
          onTranscriptRef.current(currentAccumulated);

          // Clear any existing silence timer
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }

          // Start a new 3-second timer
          silenceTimeoutRef.current = setTimeout(() => {
            setIsListening(false);
            // Stop listening before sending so it doesn't listen to the speaker
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
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
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
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      stopSpeechRecognition();
    } else {
      try {
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
    isSupported: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
  };
}
