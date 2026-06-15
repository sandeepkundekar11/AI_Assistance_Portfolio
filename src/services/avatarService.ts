let activeAudio: HTMLAudioElement | null = null;

function isMaleVoice(name: string): boolean {
  const lower = name.toLowerCase();
  if (lower.includes("male")) return true;
  const maleNames = ["david", "mark", "guy", "ryan", "andrew", "brian", "stefan", "james", "joey", "matthew", "justin", "george", "ravi", "alex", "daniel", "fred", "arthur", "aaron", "gordon", "rishi", "richard", "peter", "sam"];
  return maleNames.some(name => lower.includes(name));
}

async function speakWithGoogleCloudTTS(
  text: string,
  apiKey: string,
  voiceName: string,
  pitch: number,
  rate: number,
  onStart: () => void,
  onEnd: () => void
) {
  try {
    // Clean text
    const cleanText = text
      .replace(/•/g, "")
      .replace(/\*/g, "")
      .replace(/>/g, "")
      .replace(/\n+/g, " ")
      .replace(/\d\./g, "")
      .trim();

    // Map pitch parameter [0.5, 2.0] to semitones [-20.0, 20.0]
    const semitones = (pitch - 1.0) * 8.0;

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: { text: cleanText },
        voice: {
          languageCode: "en-US",
          name: voiceName
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: rate,
          pitch: semitones
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Google Cloud TTS API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.audioContent) {
      throw new Error("No audio content returned from Google Cloud TTS.");
    }

    // Play synthesized base64 MP3
    const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.onplay = () => {
      onStart();
    };

    audio.onended = () => {
      activeAudio = null;
      onEnd();
    };

    audio.onerror = (e) => {
      console.error("Audio playback error in Google Cloud TTS", e);
      activeAudio = null;
      onEnd();
    };

    await audio.play();

  } catch (err) {
    console.error("Google Cloud TTS failed, falling back to Web Speech", err);
    speakWithWebSpeech(text, false, onStart, onEnd);
  }
}

function speakWithWebSpeech(
  text: string,
  isMuted: boolean,
  onStart: () => void,
  onEnd: () => void,
  preferredURI: string = "",
  pitch: number = 1.0,
  rate: number = 1.0
) {
  if (isMuted || !("speechSynthesis" in window)) {
    onEnd();
    return;
  }

  // If voices are not loaded yet, wait for them
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    const handleVoicesChanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      speakWithWebSpeech(text, isMuted, onStart, onEnd, preferredURI, pitch, rate);
    };
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    setTimeout(() => {
      if (window.speechSynthesis.onvoiceschanged === handleVoicesChanged) {
        window.speechSynthesis.onvoiceschanged = null;
        speakWithWebSpeech(text, isMuted, onStart, onEnd, preferredURI, pitch, rate);
      }
    }, 250);
    return;
  }

  const cleanText = text
    .replace(/•/g, "")
    .replace(/\*/g, "")
    .replace(/>/g, "")
    .replace(/\n+/g, " ")
    .replace(/\d\./g, "")
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Attempt to match the preferred voice by URI or Name
  let selectedVoice = preferredURI ? voices.find(v => v.voiceURI === preferredURI) : null;
  if (!selectedVoice && preferredURI) {
    selectedVoice = voices.find(v => v.name === preferredURI);
  }

  // Ensure matched voice is male
  if (selectedVoice && !isMaleVoice(selectedVoice.name)) {
    selectedVoice = null;
  }

  if (!selectedVoice) {
    // 1. Prioritize Microsoft Edge Online Natural Male voices
    selectedVoice = voices.find(v =>
      v.lang.startsWith("en") &&
      v.name.toLowerCase().includes("online") &&
      v.name.toLowerCase().includes("natural") && (
        v.name.toLowerCase().includes("guy") ||
        v.name.toLowerCase().includes("ryan") ||
        v.name.toLowerCase().includes("andrew") ||
        v.name.toLowerCase().includes("brian")
      )
    );

    // 2. Prioritize local offline OS male voices
    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.lang.startsWith("en") && (
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("alex") ||
          v.name.toLowerCase().includes("daniel") ||
          v.name.toLowerCase().includes("james") ||
          v.name.toLowerCase().includes("stefan") ||
          v.name.toLowerCase().includes("fred") ||
          v.name.toLowerCase().includes("arthur") ||
          v.name.toLowerCase().includes("aaron") ||
          v.name.toLowerCase().includes("gordon")
        )
      );
    }

    // 3. Fall back to Google English Male voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.lang.startsWith("en") &&
        v.name.toLowerCase().includes("google") &&
        v.name.toLowerCase().includes("male")
      );
    }

    // 4. Fall back to any English voice that matches our isMaleVoice check
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith("en") && isMaleVoice(v.name));
    }

    // 5. Fall back to any Google English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.lang.startsWith("en") &&
        v.name.toLowerCase().includes("google")
      );
    }

    // 6. Final fallback
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.pitch = pitch;
  utterance.rate = rate;

  utterance.onstart = () => {
    onStart();
  };
  utterance.onend = () => {
    onEnd();
  };
  utterance.onerror = () => {
    onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export const AvatarService = {
  /**
   * Speaks the provided text aloud and hooks callbacks to control speaking/typing mouth chattering.
   */
  speak(
    text: string,
    isMuted: boolean,
    onStart: () => void,
    onEnd: () => void
  ) {
    if (isMuted) {
      onEnd();
      return;
    }

    // Cancel any active speech synthesis or audio playback
    AvatarService.cancel();

    // Read custom voice settings from localStorage
    const settingsStr = localStorage.getItem("sandeep-ai-voice-settings");
    let pitch = 1.0;
    let rate = 1.0;
    let preferredURI = "";

    if (settingsStr) {
      try {
        const parsed = JSON.parse(settingsStr);
        if (typeof parsed.pitch === "number") pitch = parsed.pitch;
        if (typeof parsed.rate === "number") rate = parsed.rate;
        if (typeof parsed.voiceURI === "string") preferredURI = parsed.voiceURI;
      } catch (e) {
        console.error("Failed to parse voice settings", e);
      }
    }

    const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

    // Default to premium Orus voice if API Key is configured but no preference exists
    if (!preferredURI && googleApiKey) {
      preferredURI = "en-US-Chirp3-HD-Orus";
    }

    // If premium Cloud voice is selected and API Key is present, run Google Cloud TTS
    if (googleApiKey && (preferredURI.includes("Studio") || preferredURI.includes("Orus") || preferredURI.includes("Chirp"))) {
      const voiceName = preferredURI.includes("Orus") ? "en-US-Chirp3-HD-Orus" : preferredURI;
      speakWithGoogleCloudTTS(text, googleApiKey, voiceName, pitch, rate, onStart, onEnd);
      return;
    }

    // Otherwise, speak with browser-native Web Speech API
    speakWithWebSpeech(text, isMuted, onStart, onEnd, preferredURI, pitch, rate);
  },

  /**
   * Cancels any ongoing audio speech synthesis immediately.
   */
  cancel() {
    if (activeAudio) {
      try {
        activeAudio.pause();
      } catch (e) { }
      activeAudio = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
};
