import React, { useState, useEffect, useRef, Suspense } from "react";
import { useThrottledMouseCoords } from "../../hooks/useMousePosition";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Bot, Terminal, RefreshCw, Volume2, VolumeX, X, Sliders } from "lucide-react";
import { useChatService } from "../../services/chatService";
import { VoiceSettingsPanel } from "../ui/VoiceSettingsPanel";

const AiAvatar = React.lazy(() =>
  import("../three/AiAvatar").then((module) => ({ default: module.AiAvatar }))
);

function AvatarFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 font-space text-[10px] uppercase tracking-widest gap-2">
      <div className="w-8 h-8 rounded-full border border-cyber-cyan border-t-transparent animate-spin" />
      <span>Decrypting visual buffers...</span>
    </div>
  );
}

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceLabel, setVoiceLabel] = useState("SYS_DEFAULT");
  const [isWaving, setIsWaving] = useState(false);

  // Keep HUD voice label synchronized with settings
  useEffect(() => {
    const updateVoiceLabel = () => {
      const settingsStr = localStorage.getItem("sandeep-ai-voice-settings");
      if (settingsStr) {
        try {
          const parsed = JSON.parse(settingsStr);
          if (parsed.voiceURI) {
            const name = parsed.voiceURI.split(" - ")[0].replace("Microsoft ", "").replace("Google ", "");
            setVoiceLabel(name.toUpperCase());
            return;
          }
        } catch (e) {}
      }
      setVoiceLabel("SYS_DEFAULT");
    };

    updateVoiceLabel();
    window.addEventListener("voice-settings-updated", updateVoiceLabel);
    return () => window.removeEventListener("voice-settings-updated", updateVoiceLabel);
  }, []);

  // Listen to external trigger events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-ai-chat", handleOpen);
    return () => window.removeEventListener("open-ai-chat", handleOpen);
  }, []);

  const {
    messages,
    inputValue,
    setInputValue,
    isThinking,
    isTyping,
    isSpeaking,
    isMuted,
    toggleMute,
    cancelSpeech,
    speakDirectly,
    handleSend,
    chatEndRef,
  } = useChatService(
    "Establishing full-screen synergy uplink via OpenAI gpt-oss-120b...",
    "Neural uplink complete. I have taken full screen control. I am AI Sandeep, Sandeep's direct digital clone. How can I assist you with my skill matrix, career history, or projects today?"
  );

  // Lock scroll when full screen is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("lenis-stopped");
      if (lenis && typeof lenis.stop === "function") lenis.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      if (lenis && typeof lenis.start === "function") lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      if (lenis && typeof lenis.start === "function") lenis.start();
    };
  }, [isOpen]);

  // Trigger waving animation and voice intro when opened
  useEffect(() => {
    if (isOpen) {
      setIsWaving(true);
      const waveTimer = setTimeout(() => {
        setIsWaving(false);
      }, 2600);

      // Intro voice speech greeting
      const introText = "Neural uplink complete. I have taken full screen control. I am AI Sandeep, Sandeep's direct digital clone. How can I assist you with my skill matrix, career history, or projects today?";
      const speechTimer = setTimeout(() => {
        speakDirectly(introText);
      }, 600);

      return () => {
        clearTimeout(waveTimer);
        clearTimeout(speechTimer);
      };
    } else {
      setIsWaving(false);
    }
  }, [isOpen]);

  // Track mouse coords only while panel is open, throttled via rAF
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  useThrottledMouseCoords((x, y) => {
    if (isOpenRef.current) setMouseCoords({ x, y });
  });

  const quickPrompts = ["Skills", "Experience", "Projects", "Contact"];

  return (
    <>
      {/* 1. FIXED FLOATING BUTTON TRIGGER (Bottom-Left) */}
      <button
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (isOpen) {
            cancelSpeech();
          }
        }}
        className="fixed bottom-6 left-6 z-[100] w-14 h-14 rounded-full bg-space-card border-2 border-cyber-purple/80 hover:border-cyber-cyan flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.35)] hover:shadow-[0_0_20px_rgba(6,182,212,0.55)] transition-all duration-300 backdrop-blur-md group focus:outline-none"
        title="AI Sandeep Synergy Portal"
      >
        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-cyber-emerald border border-space-black animate-ping" />
        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-cyber-emerald border border-space-black" />

        {isOpen ? (
          <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
        ) : (
          <Bot className="w-6 h-6 text-cyber-purple group-hover:text-cyber-cyan group-hover:scale-110 transition-all duration-200" />
        )}
      </button>

      {/* 2. FULL SCREEN TAKEOVER PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[120] bg-[#030308]/98 backdrop-blur-lg flex flex-col lg:flex-row items-stretch select-none overflow-hidden"
          >
            {/* Top-Right Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                cancelSpeech();
              }}
              className="absolute top-6 right-6 z-[130] w-11 h-11 rounded-full border border-space-border/30 hover:border-red-500 bg-space-black/80 flex items-center justify-center cursor-pointer text-gray-500 hover:text-white transition-all duration-200 shadow-[0_0_10px_rgba(0,0,0,0.5)] focus:outline-none"
              title="Close System Control"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT SIDE: Immersive Fullscreen 3D Scene + Sci-Fi HUD overlays */}
            <div className="flex-grow h-[45vh] lg:h-full relative flex flex-col justify-between p-6 sm:p-8 select-none">

              {/* Sci-Fi HUD Header overlays */}
              <div className="flex justify-between items-start pointer-events-none z-10">
                <div className="flex flex-col gap-1 border-l-2 border-cyber-cyan pl-3 py-0.5">
                  <span className="text-[10px] font-orbitron font-extrabold tracking-widest text-white">
                    UPLINK_TERMINAL // STABLE
                  </span>
                  <span className="text-[8px] font-space text-cyber-cyan tracking-wider font-semibold">
                    MODEL: OpenAI gpt-oss-120b
                  </span>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 font-space text-[8px] text-gray-500 font-bold tracking-widest uppercase">
                  <span>SECURITY: LEVEL_2_ADMIN</span>
                  <span>ENVELOPE_SECURE</span>
                </div>
              </div>

              {/* Centered Hologram Wireframe circles crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-0 w-full max-w-[400px] aspect-square">
                <div className="absolute w-[280px] h-[280px] border border-cyber-purple/10 rounded-full animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-[360px] h-[360px] border border-dashed border-cyber-cyan/5 rounded-full animate-[spin_45s_linear_infinite]" />
                <div className="absolute w-6 h-6 border border-cyber-cyan/15 rounded-full" />
              </div>

              {/* R3F 3D Humanoid Canvas */}
              <div className="absolute inset-0 z-0">
                <Suspense fallback={<AvatarFallback />}>
                  <AiAvatar isThinking={isThinking} isTyping={isTyping || isSpeaking} isWaving={isWaving} />
                </Suspense>
              </div>

              {/* Sci-Fi HUD Footer overlays */}
              <div className="flex justify-between items-end pointer-events-none z-10 text-[9px] font-space text-gray-500 tracking-wider">
                <div className="flex flex-col gap-0.5">
                  <span>CURSOR_TELEMETRY:</span>
                  <span className="font-mono text-cyber-purple">X: {mouseCoords.x}px // Y: {mouseCoords.y}px</span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span>VOICE_OUT:</span>
                    <span className={isMuted ? "text-red-500 font-bold" : "text-cyber-cyan font-bold"}>
                      {isMuted ? "MUTED" : voiceLabel}
                    </span>
                    {!isMuted && (
                      <div className="flex gap-[2px] items-end h-2.5 w-5 ml-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="w-[2px] bg-cyber-cyan rounded-t transition-all duration-300"
                            style={{
                              height: (isTyping || isSpeaking) ? "100%" : "20%",
                              animation: (isTyping || isSpeaking) ? `pulse-bar 0.5s ease-in-out infinite alternate` : "none",
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <span>STATUS: <span className="text-cyber-emerald font-bold animate-pulse">ONLINE</span></span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Terminal Chat Panel HUD style */}
            <div className="lg:w-[460px] bg-[#070712]/95 border-t lg:border-t-0 lg:border-l border-cyber-purple/20 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 relative h-[55vh] lg:h-full overflow-hidden shrink-0 z-10">

              {/* Internal scanner scanline lines overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyber-purple/1 to-transparent bg-[length:100%_4px] opacity-15" />

              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-space-border/20 pb-4 shrink-0">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4.5 h-4.5 text-cyber-purple" />
                  <span className="font-space text-xs font-bold text-white tracking-widest uppercase">
                    SYS_COMMAND_SHELL
                  </span>
                </div>
                {/* Controls */}
                <div className="flex items-center gap-2">
                  {/* Audio voice toggle control */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 rounded hover:bg-space-black/80 border border-space-border/30 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
                    title={isMuted ? "Unmute Voice" : "Mute Voice"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyber-purple" />}
                  </button>
                  {/* Voice Tuning control */}
                  <button
                    type="button"
                    onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                    className={`p-1.5 rounded border transition-all duration-200 cursor-pointer ${
                      showVoiceSettings
                        ? "bg-cyber-purple/20 border-cyber-purple text-white shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                        : "hover:bg-space-black/80 border-space-border/30 text-gray-400 hover:text-white"
                    }`}
                    title="Voice Modulation Settings"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>



              {/* Messages Terminal box */}
              <div className="flex-grow my-6 overflow-y-auto pr-1 flex flex-col gap-4 font-space text-xs sm:text-sm leading-relaxed bg-black/40 rounded-xl p-4 border border-space-border/10 max-h-[calc(100%-140px)] relative">
                {showVoiceSettings && (
                  <div className="absolute inset-0 z-20 bg-[#070712]/98 p-4 rounded-xl overflow-y-auto">
                    <VoiceSettingsPanel onClose={() => setShowVoiceSettings(false)} />
                  </div>
                )}
                
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user"
                        ? "justify-end"
                        : msg.sender === "system"
                          ? "justify-center"
                          : "justify-start"
                      }`}
                  >
                    {msg.sender === "system" ? (
                      <div className="px-3 py-1 bg-cyber-purple/5 border border-cyber-purple/20 text-cyber-purple/80 text-[10px] tracking-wider rounded-md uppercase font-semibold flex items-center gap-1.5">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        <span>{msg.text}</span>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[90%] rounded-xl px-3.5 py-3 flex gap-2.5 items-start border ${msg.sender === "user"
                            ? "bg-cyber-purple/15 border-cyber-purple/45 text-white"
                            : "bg-[#0b0b14]/90 border-space-border/30 text-gray-100"
                          }`}
                      >
                        {msg.sender === "ai" && (
                          <div className="p-0.5 bg-space-black border border-space-border/25 rounded shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5 text-cyber-purple" />
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <p className="whitespace-pre-line text-justify leading-relaxed">{msg.text}</p>
                          <span className="text-[7.5px] text-gray-600 font-mono self-end mt-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Processing load node */}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-xl px-3.5 py-3 bg-space-black/45 border border-space-border/25 text-gray-400 flex items-center gap-2">
                      <Bot className="w-3.5 h-3.5 text-cyber-purple animate-pulse" />
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>              {/* Quick actions Suggestions */}
              <div className="flex flex-col gap-3 shrink-0">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-space text-gray-500 font-bold uppercase tracking-wider mr-1">Suggested:</span>
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p)}
                      disabled={isThinking || isTyping}
                      className="px-3 py-1.5 rounded border border-space-border/30 hover:border-cyber-purple bg-space-black/60 hover:bg-cyber-purple/10 text-gray-300 hover:text-white font-space text-xs font-semibold transition-all duration-200 uppercase cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Keyboard input console */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(inputValue);
                  }}
                  className="bg-space-black rounded-lg border border-space-border/35 flex gap-2 p-2 items-center"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isThinking || isTyping ? "Synthesizing answer..." : "Input query telemetry..."}
                    disabled={isThinking || isTyping}
                    className="flex-grow px-3 py-2 bg-transparent focus:outline-none font-space text-sm text-white placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={isThinking || isTyping || !inputValue.trim()}
                    className="p-2.5 rounded-md bg-cyber-purple/20 hover:bg-cyber-purple/40 border border-cyber-purple/35 hover:border-cyber-purple text-white transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

