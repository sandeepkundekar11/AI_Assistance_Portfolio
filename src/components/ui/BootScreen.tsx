import { useState, useEffect } from "react";
import { Terminal, Cpu, ShieldAlert, Wifi } from "lucide-react";

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  const bootSequence = [
    "UPLINK_TERMINAL // INITIALIZING BOOT ROUTINE...",
    "CONNECTING TO COGNITIVE CORE... SUCCESS",
    "ALLOCATING SECURE PROTOCOL CHANNELS... [AES-256]",
    "MOUNTING COMPONENT CONTROLLERS & DATA STACK...",
    "FETCHING PROFILE TELEMETRY...",
    "  > Caching Name: Sandeep N Kundekar",
    "  > Decrypting Title: Senior Frontend Engineer / React Specialist",
    "  > Checking Experience matrix: 3+ Years verified",
    "FETCHING SKILLS GRAPH... 28 nodes indexed",
    "SYNTHESIZING 3D CYBERNETIC HOST MESH...",
    "CALIBRATING LIGHTHOUSE DIAGNOSTICS... SCORE: 98/100",
    "UPLINK STABLE. SANDEEP_AI IS ONLINE.",
  ];

  // Output logs sequentially
  useEffect(() => {
    if (currentStep < bootSequence.length) {
      const delay = Math.random() * 200 + 100; // random type delay
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, bootSequence[currentStep]]);
        setCurrentStep((prev) => prev + 1);
        setProgress(Math.round(((currentStep + 1) / bootSequence.length) * 100));
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
    }
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-space-black z-[9999] flex flex-col items-center justify-center font-space text-gray-400 p-6 select-none hologram-container">
      {/* Glitch Scanline Line overlay */}
      <div className="hologram-line" />

      {/* Cyber Frame Box */}
      <div className="w-full max-w-2xl border border-cyber-purple/20 bg-space-dark/80 rounded-lg p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)]">
        
        {/* Decorative HUD Corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan/60" />

        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-cyber-purple/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <span className="text-xs font-orbitron font-bold text-white tracking-widest uppercase">
              SECURE_SHELL // UPLINK_SYS
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] tracking-wider font-semibold text-gray-500">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyber-purple" /> 120B_MODEL
            </span>
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-cyber-emerald" /> UPLINK_ON
            </span>
          </div>
        </div>

        {/* Terminal Screen Console */}
        <div className="min-h-[220px] max-h-[300px] overflow-y-auto font-mono text-[11px] sm:text-xs leading-relaxed text-cyber-cyan flex flex-col gap-2 bg-black/40 p-4 rounded-md border border-space-border/20 mb-6 scrollbar-thin">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2 items-start animate-fade-in">
              <span className="text-cyber-purple select-none shrink-0">{">"}</span>
              <span className={log.includes("SUCCESS") || log.includes("ONLINE") ? "text-cyber-emerald font-bold" : ""}>
                {log}
              </span>
            </div>
          ))}
          {!isFinished && (
            <div className="flex gap-2 items-center">
              <span className="text-cyber-purple">{">"}</span>
              <span className="terminal-cursor" />
            </div>
          )}
        </div>

        {/* Bottom Status bar & trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-space-border/20 pt-4">
          {/* Progress telemetry */}
          <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] font-space tracking-widest text-gray-500 font-bold">
              <span>SYNCHRONIZING TELEMETRY</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-space-black rounded-full overflow-hidden border border-space-border/20 relative">
              <div 
                className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>

          {/* Trigger Button */}
          <div className="w-full sm:w-auto flex justify-end">
            {isFinished ? (
              <button
                onClick={onComplete}
                className="w-full sm:w-auto px-6 py-2.5 bg-cyber-purple hover:bg-cyber-cyan border border-cyber-purple/50 hover:border-cyber-cyan text-white hover:text-black font-orbitron text-xs font-black tracking-widest uppercase rounded cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse"
              >
                INITIALIZE SYS_UPLINK
              </button>
            ) : (
              <span className="text-[10px] text-gray-500 font-space tracking-widest uppercase flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-cyber-purple animate-spin" />
                SYSTEM LOCK // DECRYPTING...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
