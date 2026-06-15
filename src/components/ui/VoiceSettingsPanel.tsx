import React, { useState, useEffect } from "react";
import { Sliders, Play, RefreshCw, Volume2 } from "lucide-react";
import { AvatarService } from "../../services/avatarService";

interface VoiceSettings {
  voiceURI: string;
  pitch: number;
  rate: number;
}

interface VoiceSettingsPanelProps {
  onClose?: () => void;
}

const PRESETS = {
  DEFAULT: { name: "SYS_DEFAULT", pitch: 1.0, rate: 1.0 },
  CYBER_CYBORG: { name: "CYBER_CYBORG", pitch: 0.5, rate: 0.85 },
  RAPID_AGENT: { name: "RAPID_AGENT", pitch: 1.1, rate: 1.4 },
  DEEP_CORE: { name: "DEEP_CORE", pitch: 0.65, rate: 0.95 },
  HELIUM_CHIPS: { name: "MICRO_CHIP", pitch: 1.6, rate: 1.15 },
};

const maleNamesList = ["david", "mark", "guy", "ryan", "andrew", "brian", "stefan", "james", "joey", "matthew", "justin", "george", "ravi", "alex", "daniel", "fred", "arthur", "aaron", "gordon", "rishi", "richard", "peter", "sam"];

export function isVoiceMale(name: string): boolean {
  const lower = name.toLowerCase();
  if (lower.includes("male")) return true;
  return maleNamesList.some(n => lower.includes(n));
}

export function VoiceSettingsPanel({ onClose }: VoiceSettingsPanelProps) {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedURI, setSelectedURI] = useState<string>("");
  const [pitch, setPitch] = useState<number>(1.0);
  const [rate, setRate] = useState<number>(1.0);
  const [activePreset, setActivePreset] = useState<string>("DEFAULT");
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  // Load available English voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter for English male voices
      const enMaleVoices = allVoices.filter(
        (v) => (v.lang.startsWith("en") || v.lang.includes("-en")) && isVoiceMale(v.name)
      );
      setAvailableVoices(enMaleVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Load current settings from localStorage
  useEffect(() => {
    const settingsStr = localStorage.getItem("sandeep-ai-voice-settings");
    if (settingsStr) {
      try {
        const parsed = JSON.parse(settingsStr) as VoiceSettings;
        if (parsed.voiceURI) {
          // Allow premium cloud voices or matched male system voices
          if (
            parsed.voiceURI.includes("Studio") ||
            parsed.voiceURI.includes("Orus") ||
            parsed.voiceURI.includes("Chirp") ||
            isVoiceMale(parsed.voiceURI)
          ) {
            setSelectedURI(parsed.voiceURI);
          } else {
            // Saved voice is not male, clear it so we default back to male
            localStorage.removeItem("sandeep-ai-voice-settings");
          }
        }
        if (typeof parsed.pitch === "number") setPitch(parsed.pitch);
        if (typeof parsed.rate === "number") setRate(parsed.rate);
      } catch (e) {
        console.error("Failed to load voice settings from localStorage", e);
      }
    }
  }, []);

  // Synchronize default voice if nothing is saved in localStorage
  useEffect(() => {
    if (availableVoices.length === 0 || selectedURI) return;

    const settingsStr = localStorage.getItem("sandeep-ai-voice-settings");
    if (!settingsStr) {
      if (googleApiKey) {
        setSelectedURI("en-US-Chirp3-HD-Orus");
        return;
      }

      // Prioritize Edge Online Natural Male
      let defaultVoice = availableVoices.find(v =>
        v.name.toLowerCase().includes("online") &&
        v.name.toLowerCase().includes("natural") && (
          v.name.toLowerCase().includes("guy") ||
          v.name.toLowerCase().includes("ryan") ||
          v.name.toLowerCase().includes("andrew") ||
          v.name.toLowerCase().includes("brian")
        )
      );

      // Prioritize local offline OS male voices
      if (!defaultVoice) {
        defaultVoice = availableVoices.find(v =>
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
        );
      }

      // Fall back to Google UK English Male
      if (!defaultVoice) {
        defaultVoice = availableVoices.find(v =>
          v.name.toLowerCase().includes("google") &&
          v.name.toLowerCase().includes("male")
        );
      }

      if (!defaultVoice) {
        defaultVoice = availableVoices[0];
      }

      if (defaultVoice) {
        setSelectedURI(defaultVoice.voiceURI);
      }
    }
  }, [availableVoices, selectedURI]);

  // Check if current manual sliders match any preset
  useEffect(() => {
    let matchedPreset = "CUSTOM";
    for (const [key, val] of Object.entries(PRESETS)) {
      if (val.pitch === pitch && val.rate === rate) {
        matchedPreset = key;
        break;
      }
    }
    setActivePreset(matchedPreset);
  }, [pitch, rate]);

  // Save settings helper
  const saveSettings = (newURI: string, newPitch: number, newRate: number) => {
    const settings: VoiceSettings = {
      voiceURI: newURI,
      pitch: newPitch,
      rate: newRate,
    };
    localStorage.setItem("sandeep-ai-voice-settings", JSON.stringify(settings));
    // Dispatch custom event to notify all components to sync
    window.dispatchEvent(new Event("voice-settings-updated"));
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    setSelectedURI(uri);
    saveSettings(uri, pitch, rate);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setPitch(val);
    saveSettings(selectedURI, val, rate);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setRate(val);
    saveSettings(selectedURI, pitch, val);
  };

  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    setPitch(preset.pitch);
    setRate(preset.rate);
    saveSettings(selectedURI, preset.pitch, preset.rate);
  };

  const playPreview = () => {
    if (isPreviewing) {
      AvatarService.cancel();
      setIsPreviewing(false);
      return;
    }

    AvatarService.speak(
      "Uplink voice check. Vocal simulator online and fully calibrated.",
      false,
      () => setIsPreviewing(true),
      () => setIsPreviewing(false)
    );
  };

  // Reset to default
  const resetToDefault = () => {
    setPitch(1.0);
    setRate(1.0);

    // Prioritize Google voice (male), Edge/Online Natural male, then system male
    let defaultVoice = availableVoices.find(v =>
      v.lang.startsWith("en") &&
      v.name.toLowerCase().includes("google") &&
      v.name.toLowerCase().includes("male")
    );
    if (!defaultVoice) {
      defaultVoice = availableVoices.find(v =>
        v.lang.startsWith("en") &&
        v.name.toLowerCase().includes("online") &&
        v.name.toLowerCase().includes("natural") && (
          v.name.toLowerCase().includes("guy") ||
          v.name.toLowerCase().includes("ryan") ||
          v.name.toLowerCase().includes("andrew") ||
          v.name.toLowerCase().includes("brian")
        )
      );
    }
    if (!defaultVoice) {
      defaultVoice = availableVoices.find(v =>
        v.lang.startsWith("en") && (
          v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("james")
        )
      );
    }
    if (!defaultVoice) {
      defaultVoice = availableVoices.find(v =>
        v.lang.startsWith("en") &&
        v.name.toLowerCase().includes("google")
      );
    }
    if (!defaultVoice) {
      defaultVoice = availableVoices.find(v => v.lang.startsWith("en")) || availableVoices[0];
    }

    const uri = defaultVoice ? defaultVoice.voiceURI : "";
    setSelectedURI(uri);
    saveSettings(uri, 1.0, 1.0);
  };

  return (
    <div className="flex flex-col gap-4 bg-space-black/95 border border-cyber-purple/35 rounded-xl p-4.5 shadow-[0_0_25px_rgba(139,92,246,0.25)] relative overflow-hidden backdrop-blur-xl">
      {/* Visual cyber lines */}
      <div className="absolute top-0 left-0 w-3 h-[2px] bg-cyber-cyan" />
      <div className="absolute top-0 left-0 w-[2px] h-3 bg-cyber-cyan" />
      <div className="absolute bottom-0 right-0 w-3 h-[2px] bg-cyber-purple" />
      <div className="absolute bottom-0 right-0 w-[2px] h-3 bg-cyber-purple" />

      {/* Title */}
      <div className="flex items-center justify-between border-b border-space-border/20 pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <span className="font-orbitron text-[10px] font-black text-white tracking-wider uppercase">
            VOICE_FREQ_MODULATION
          </span>
        </div>
        <button
          onClick={resetToDefault}
          className="text-[9px] font-space text-gray-500 hover:text-cyber-cyan flex items-center gap-1 uppercase transition-colors"
          title="Reset telemetry variables"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          RESET_VARS
        </button>
      </div>

      {/* Voice Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-space text-gray-400 font-bold uppercase tracking-wider">
          Uplink Voice Persona
        </label>
        <select
          value={selectedURI}
          onChange={handleVoiceChange}
          className="w-full bg-[#08080f] border border-space-border/30 rounded px-2 py-1.5 font-space text-xs text-white focus:outline-none focus:border-cyber-purple cursor-pointer"
        >
          {googleApiKey ? (
            <>
              <option value="en-US-Chirp3-HD-Orus">Google Studio Male (Orus) [Cloud]</option>
              <option value="en-US-Studio-O">Google Studio Male (Studio-O) [Cloud]</option>
            </>
          ) : (
            <>
              <option value="en-US-Chirp3-HD-Orus" disabled>Google Studio Male (Orus) [Requires Key]</option>
              <option value="en-US-Studio-O" disabled>Google Studio Male (Studio-O) [Requires Key]</option>
            </>
          )}

          {availableVoices.length === 0 ? (
            <option value="">Searching system voice indexes...</option>
          ) : (
            availableVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Presets Grid */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-space text-gray-400 font-bold uppercase tracking-wider">
          Aesthetic Modulation Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`px-1.5 py-1 rounded text-[9px] font-space font-semibold uppercase tracking-wider text-center border cursor-pointer transition-all duration-150 ${activePreset === key
                  ? "bg-cyber-purple/15 border-cyber-purple text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  : "bg-space-black/60 border-space-border/20 text-gray-400 hover:border-cyber-cyan hover:text-white"
                }`}
            >
              {PRESETS[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Sliders */}
      <div className="flex flex-col gap-3 border-t border-space-border/10 pt-3">
        {/* Pitch Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[9px] font-space font-bold uppercase tracking-wider text-gray-400">
            <span>Voice Pitch</span>
            <span className="text-cyber-cyan font-mono">{pitch.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={pitch}
            onChange={handlePitchChange}
            className="w-full h-1 bg-[#08080f] rounded-lg appearance-none cursor-pointer accent-cyber-cyan border border-space-border/25"
          />
        </div>

        {/* Speed (Rate) Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[9px] font-space font-bold uppercase tracking-wider text-gray-400">
            <span>Transmission Speed</span>
            <span className="text-cyber-purple font-mono">{rate.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={rate}
            onChange={handleRateChange}
            className="w-full h-1 bg-[#08080f] rounded-lg appearance-none cursor-pointer accent-cyber-purple border border-space-border/25"
          />
        </div>
      </div>

      {/* Signal Preview Trigger & Close button */}
      <div className="flex gap-2.5 border-t border-space-border/10 pt-3.5 mt-0.5 shrink-0">
        <button
          type="button"
          onClick={playPreview}
          className={`flex-grow py-2 rounded-lg border flex items-center justify-center gap-1.5 font-space text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-all duration-200 ${isPreviewing
              ? "bg-red-500/20 border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.35)]"
              : "bg-cyber-cyan/15 hover:bg-cyber-cyan/35 border-cyber-cyan/50 hover:border-cyber-cyan text-white shadow-[0_0_10px_rgba(6,182,212,0.25)]"
            }`}
        >
          {isPreviewing ? (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span>STOP_UPLINK</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>TEST_TRANSMISSION</span>
            </>
          )}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-space-black border border-space-border/30 hover:border-white rounded-lg font-space text-[10px] font-bold text-gray-400 hover:text-white uppercase transition-colors duration-150 cursor-pointer"
          >
            CLOSE
          </button>
        )}
      </div>
    </div>
  );
}
