import React, { useState, Suspense } from "react";
import { useThrottledMouseCoords } from "./hooks/useMousePosition";
import { SEO } from "./seo/SEO";
import { CustomCursor } from "./components/layout/CustomCursor";
import { Navbar } from "./components/layout/Navbar";
import { AiAssistantWidget } from "./components/layout/AiAssistantWidget";
import { GlobalStarField } from "./components/three/GlobalStarField";
import { BootScreen } from "./components/ui/BootScreen";
import { Terminal } from "lucide-react";

// Lazy loading components for optimization, code-splitting & speed
const HeroScene = React.lazy(() =>
  import("./components/three/HeroScene").then((module) => ({ default: module.HeroScene }))
);

const HeroText = React.lazy(() => import("./components/sections/HeroText").then(m => ({ default: m.HeroText })));
const About = React.lazy(() => import("./components/sections/About").then(m => ({ default: m.About })));
const Skills = React.lazy(() => import("./components/sections/Skills").then(m => ({ default: m.Skills })));
const Experience = React.lazy(() => import("./components/sections/Experience").then(m => ({ default: m.Experience })));
const Projects = React.lazy(() => import("./components/sections/Projects").then(m => ({ default: m.Projects })));
const Architecture = React.lazy(() => import("./components/sections/Architecture").then(m => ({ default: m.Architecture })));
const Performance = React.lazy(() => import("./components/sections/Performance").then(m => ({ default: m.Performance })));
const Contact = React.lazy(() => import("./components/sections/Contact").then(m => ({ default: m.Contact })));
const AiSandeep = React.lazy(() => import("./components/sections/AiSandeep").then(m => ({ default: m.AiSandeep })));

// Fallback spinner for dynamic modules loading
function ModuleFallback() {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-gray-500 font-space text-[10px] uppercase tracking-widest gap-2">
      <div className="w-6 h-6 rounded-full border border-cyber-purple border-t-transparent animate-spin" />
      <span>Decrypting System Module...</span>
    </div>
  );
}

// Fallback spinner for 3D elements
function CanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent text-gray-500 font-space text-[10px] tracking-widest uppercase">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-cyber-cyan border-t-transparent animate-spin" />
        <span>Synthesizing 3D Orbit...</span>
      </div>
    </div>
  );
}

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [show3dSkills, setShow3dSkills] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  // Track mouse coords - throttled via rAF so we only setState once per frame
  useThrottledMouseCoords((x, y) => setMouseCoords({ x, y }));

  const openAiChat = () => {
    window.dispatchEvent(new Event("open-ai-chat"));
  };

  if (!isBooted) {
    return (
      <>
        <SEO />
        <BootScreen onComplete={() => setIsBooted(true)} />
      </>
    );
  }

  return (
    <>
      <SEO />
      <CustomCursor />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <GlobalStarField />

      {/* Main Single-Viewport Dashboard Container */}
      <main className="w-full min-h-screen text-white bg-transparent relative overflow-hidden z-10 flex flex-col justify-center pt-24 pb-8 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 h-auto lg:h-[calc(100vh-140px)]">
          
          {/* LEFT SIDE: Immersive Interactive Hologram Panel */}
          <div className="w-full lg:w-5/12 min-h-[40vh] lg:min-h-0 rounded-2xl border border-space-border/30 bg-space-card/30 backdrop-blur-md overflow-hidden flex flex-col justify-between p-4 sm:p-5 shadow-[0_0_40px_rgba(6,182,212,0.07)] relative group">
            {/* HUD Corner Tech Accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyber-cyan/60" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyber-cyan/60" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyber-cyan/60" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyber-cyan/60" />

            {/* Scanline */}
            <div className="hologram-line" />

            {/* ── TOP STATUS BAR ── */}
            <div className="relative z-10 flex items-center justify-between select-none">
              <div className="flex items-center gap-2 bg-space-black/60 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-cyber-emerald rounded-full animate-ping" />
                <span className="font-orbitron text-[10px] font-bold text-white tracking-widest">AI_HOST // ONLINE</span>
              </div>
              <div className="bg-space-black/60 backdrop-blur-sm border border-space-border/30 rounded-lg px-3 py-1.5">
                <span className="font-space text-[10px] font-semibold text-cyber-cyan tracking-widest">3D_SYNTH</span>
              </div>
            </div>

            {/* Centered Hologram Grid Target */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-0 w-full max-w-[280px] aspect-square">
              <div className="absolute w-[200px] h-[200px] border border-cyber-cyan/10 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute w-[260px] h-[260px] border border-dashed border-cyber-purple/10 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
              <div className="absolute w-4 h-4 border border-cyber-cyan/15 rounded-full" />
            </div>

            {/* R3F 3D Humanoid Canvas */}
            <div className="absolute inset-0 z-0">
              <Suspense fallback={<CanvasFallback />}>
                <HeroScene />
              </Suspense>
            </div>

            {/* ── BOTTOM STATUS BAR ── */}
            <div className="relative z-10 flex items-center justify-between gap-3 select-none mt-auto">
              <div className="flex items-center gap-2 bg-space-black/60 backdrop-blur-sm border border-space-border/30 rounded-lg px-3 py-1.5">
                <span className="font-space text-[10px] text-gray-400 tracking-widest">CURSOR</span>
                <span className="font-mono text-[10px] text-cyber-purple font-bold">{mouseCoords.x}, {mouseCoords.y}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-space-black/60 backdrop-blur-sm border border-cyber-emerald/20 rounded-lg px-3 py-1.5">
                <div className="flex gap-[2px] items-end h-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="w-[2px] bg-cyber-emerald rounded-t animate-[pulse-bar_0.5s_ease-in-out_infinite_alternate]"
                      style={{ height: `${30 + i * 14}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <span className="font-space text-[10px] text-cyber-emerald font-bold tracking-widest">STABLE</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Tab Module Panel */}
          <div className="w-full lg:w-7/12 rounded-2xl border border-space-border/25 bg-space-card/85 backdrop-blur-md overflow-hidden flex flex-col shadow-[0_0_30px_rgba(139,92,246,0.05)] relative">
            
            {/* Panel Scanline Line overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyber-purple/1 to-transparent bg-[length:100%_4px] opacity-10" />

            {/* Card Header displaying active category */}
            <div className="bg-space-dark/80 px-6 py-4 flex justify-between items-center border-b border-space-border/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-cyber-purple animate-pulse" />
                <span className="font-space text-sm font-bold text-white tracking-widest uppercase">
                  SYS_MODULE_VIEWER // {activeTab.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-space font-extrabold tracking-widest uppercase">
                <span>SYS_SECURE</span>
              </div>
            </div>
                {/* Inner scrollable content block */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-grow h-full max-h-[calc(100vh-220px)] lg:max-h-none scrollbar-thin">
              <Suspense fallback={<ModuleFallback />}>
                {activeTab === "hero" && (
                  <div className="animate-fade-in py-2">
                    <HeroText onOpenChat={openAiChat} />
                  </div>
                )}
                {activeTab === "about" && <About />}
                {activeTab === "skills" && <Skills show3dSkills={show3dSkills} setShow3dSkills={setShow3dSkills} />}
                {activeTab === "experience" && <Experience />}
                {activeTab === "projects" && <Projects />}
                {activeTab === "architecture" && (
                  <div className="animate-fade-in py-2">
                    <Architecture />
                  </div>
                )}
                {activeTab === "performance" && <Performance />}
                {activeTab === "ai-assistant" && <AiSandeep />}
                {activeTab === "contact" && (
                  <div className="animate-fade-in flex flex-col flex-1 min-h-0">
                    <Contact />
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Global Floating AI Synergy Widget */}
      <AiAssistantWidget />
    </>
  );
}
