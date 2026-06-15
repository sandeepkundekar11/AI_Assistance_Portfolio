import React, { Suspense, useState, useEffect } from "react";
import { Send, Bot, Terminal, Shield, RefreshCw, Volume2, VolumeX, Sliders } from "lucide-react";
import { useChatService } from "../../services/chatService";
import { VoiceSettingsPanel } from "../ui/VoiceSettingsPanel";

const AiAvatar = React.lazy(() =>
  import("../three/AiAvatar").then((module) => ({ default: module.AiAvatar }))
);

function AvatarFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 font-space text-[9px] uppercase tracking-widest gap-2">
      <div className="w-6 h-6 rounded-full border border-cyber-cyan border-t-transparent animate-spin" />
      <span>Booting AI Avatar Matrix...</span>
    </div>
  );
}

export function AiSandeep() {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    setIsWaving(true);
    const waveTimer = setTimeout(() => {
      setIsWaving(false);
    }, 2600);
    return () => clearTimeout(waveTimer);
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
    handleSend,
    chatEndRef,
  } = useChatService(
    "Establishing secure uplink via OpenAI gpt-oss-120b...",
    "Hey there! I'm AI Sandeep, a neural replica of Sandeep Kundekar. I'm connected to my career database, project source blueprints, and skill records. Ask me anything, and I'll talk about my work!"
  );

  const quickPrompts = [
    "Core competencies",
    "Timeline details",
    "Lighthouse stats",
    "Project specs",
  ];

  return (
    <section id="ai-sandeep" className="py-24 relative overflow-hidden px-6 bg-space-black border-t border-space-border/15">
      {/* Background visual details */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-cyber-purple/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-orbitron font-bold text-cyber-purple text-glow-purple tracking-widest uppercase mb-3">
            08 // NEURAL UPLINK
          </h2>
          <h3 className="text-3xl md:text-5xl font-orbitron font-extrabold text-white tracking-tight">
            AI SANDEEP SYNERGY
          </h3>
          <div className="w-12 h-[2px] bg-cyber-purple mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* 3D AI Hologram (Left) */}
          <div className="lg:col-span-5 h-[380px] lg:h-auto min-h-[300px] glow-card rounded-2xl border border-space-border/25 bg-space-card/30 relative overflow-hidden flex flex-col justify-between p-4">
            {/* Hologram header */}
            <div className="flex justify-between items-center text-[9px] font-space text-gray-500 tracking-wider">
              <span>HOLOGRAPHIC_INTERFACE // V_0.4</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse" />
                <span>SYNC: OK</span>
              </div>
            </div>

            {/* 3D Scene */}
            <div className="w-full flex-grow flex items-center justify-center relative">
              <Suspense fallback={<AvatarFallback />}>
                <AiAvatar isThinking={isThinking} isTyping={isTyping || isSpeaking} isWaving={isWaving} />
              </Suspense>
              
              {/* Matrix scanlines overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyber-purple/2 to-transparent bg-[length:100%_4px] opacity-20" />
            </div>

            {/* Interface footer status */}
            <div className="flex justify-between items-center text-[9px] font-space text-gray-500 border-t border-space-border/10 pt-3">
              <span>DRAG TO ROTATE FACE</span>
              <span className={isThinking ? "text-cyber-emerald font-bold animate-pulse" : (isTyping || isSpeaking) ? "text-cyber-cyan font-bold animate-bounce" : "text-cyber-purple"}>
                {isThinking ? "DECRYPTING..." : (isTyping || isSpeaking) ? "SPEAKING..." : "IDLE // LISTENING"}
              </span>
            </div>
          </div>

          {/* AI Terminal Chat UI (Right) */}
          <div className="lg:col-span-7 flex flex-col glow-card rounded-2xl border border-space-border/25 bg-space-card/40 overflow-hidden">
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-space-black/80 border-b border-space-border/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-purple" />
                <span className="font-space text-xs font-bold text-white tracking-widest uppercase">
                  GPT-OSS-120B UPLINK
                </span>
              </div>
              <div className="flex items-center gap-3.5 text-[9px] font-space text-gray-400 font-semibold uppercase">
                {/* Voice mute control */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded hover:bg-space-card/80 border border-space-border/30 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
                  title={isMuted ? "Unmute Voice Output" : "Mute Voice Output"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyber-purple" />}
                </button>
                {/* Voice tuning control */}
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={`p-1.5 rounded border transition-all duration-200 cursor-pointer ${
                    showVoiceSettings
                      ? "bg-cyber-purple/20 border-cyber-purple text-white shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                      : "hover:bg-space-card/80 border-space-border/30 text-gray-400 hover:text-white"
                  }`}
                  title="Voice Modulation Settings"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyber-purple" /> LEVEL_2_SECURE</span>
                <span className="hidden sm:inline">PING: 42ms</span>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-grow p-6 overflow-y-auto max-h-[350px] min-h-[260px] flex flex-col gap-4 font-space text-xs leading-relaxed bg-space-black/30 relative">
              {showVoiceSettings && (
                <div className="absolute inset-0 z-20 bg-[#070712]/98 p-4 rounded-xl overflow-y-auto">
                  <VoiceSettingsPanel onClose={() => setShowVoiceSettings(false)} />
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : msg.sender === "system"
                      ? "justify-center"
                      : "justify-start"
                  }`}
                >
                  {msg.sender === "system" ? (
                    <div className="px-3 py-1 bg-cyber-purple/5 border border-cyber-purple/20 text-cyber-purple/80 text-[10px] tracking-wider rounded-md uppercase font-semibold flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 flex gap-3 items-start border ${
                        msg.sender === "user"
                          ? "bg-cyber-purple/10 border-cyber-purple/45 text-white"
                          : "bg-space-card border-space-border/40 text-gray-300"
                      }`}
                    >
                      {msg.sender === "ai" && (
                        <div className="p-1 bg-space-black border border-space-border/30 rounded-md shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-cyber-purple" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        {/* Message body text */}
                        <p className="whitespace-pre-line text-justify leading-relaxed">{msg.text}</p>
                        <span className="text-[8px] text-gray-500 font-mono self-end mt-1 font-bold">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loader indicator */}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl px-4 py-3 bg-space-card border border-space-border/40 text-gray-400 flex items-center gap-3">
                    <div className="p-1 bg-space-black border border-space-border/30 rounded-md shrink-0">
                      <Bot className="w-3.5 h-3.5 text-cyber-purple animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions Suggestions */}
            <div className="px-5 py-2.5 bg-space-black/40 border-t border-space-border/15 flex flex-wrap gap-2 items-center">
              <span className="text-[9px] font-space text-gray-500 font-bold uppercase tracking-wider mr-1">Suggested:</span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  disabled={isThinking || isTyping}
                  className="px-2.5 py-1 rounded-md border border-space-border/25 hover:border-cyber-purple bg-space-black/35 hover:bg-cyber-purple/5 text-gray-400 hover:text-white font-space text-[10px] font-semibold transition-all duration-200 uppercase cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Chat Input Console Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-4 bg-space-black/80 border-t border-space-border/20 flex gap-3 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isThinking || isTyping ? "Uplink is busy decoding..." : "Query AI Sandeep via gpt-oss-120b..."}
                disabled={isThinking || isTyping}
                className="flex-grow px-4 py-3 bg-space-black/90 rounded-lg border border-space-border/25 focus:border-cyber-purple focus:outline-none font-space text-xs text-white placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={isThinking || isTyping || !inputValue.trim()}
                className="p-3 rounded-lg bg-cyber-purple/20 hover:bg-cyber-purple/45 border border-cyber-purple/40 hover:border-cyber-purple text-white transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
