import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { Download, ArrowRight } from "lucide-react";
import { portfolioData } from "../../data/portfolio";
import { RobotHumanoid } from "./AiAvatar";

function DigitalSlate({ activeTab }: { activeTab: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Slow hovering rotations
    meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.15;
    meshRef.current.rotation.x = 0.2 + Math.cos(time * 0.4) * 0.08;
  });

  // Color changes based on active tab to represent different states
  const accentColor = activeTab === 0 ? "#06b6d4" : activeTab === 1 ? "#8b5cf6" : "#10b981";

  return (
    <group ref={meshRef} rotation={[0.2, -0.4, 0]}>
      {/* Outer tablet frame */}
      <mesh>
        <boxGeometry args={[3.2, 4.4, 0.15]} />
        <meshStandardMaterial
          color="#0d0d18"
          roughness={0.15}
          metalness={0.9}
          emissive={accentColor}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Outer neon border highlight */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <boxGeometry args={[3.2, 4.4, 0.15]} />
        <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.3} />
      </mesh>

      {/* Glossy Screen */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[2.9, 4.1]} />
        <meshStandardMaterial
          color="#050508"
          roughness={0.02}
          metalness={0.98}
          emissive="#06b6d4"
          emissiveIntensity={activeTab === 0 ? 0.08 : 0.02}
        />
      </mesh>

      {/* Internal decorative grid circuit lines */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[2.8, 4.0, 10, 15]} />
        <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.05} />
      </mesh>

      {/* Interactive Dossier Terminal Content */}
      <Html
        transform
        distanceFactor={3.2}
        position={[0, 0, 0.091]}
        className="w-[320px] h-[450px] pointer-events-none select-none"
      >
        <div className="w-full h-full p-6 flex flex-col justify-between bg-space-black border border-space-border/60 rounded-xl text-white font-space text-[12px] leading-relaxed">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-space-border/35 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="text-[10px] font-space font-bold uppercase tracking-wider text-cyber-cyan text-glow-cyan">
                SYS_DOSSIER // SECURE_NODE
              </span>
            </div>
            <span className="text-gray-500 font-mono text-[9px] font-bold">PAGE_0{activeTab + 1}</span>
          </div>

          {/* Dynamic Content */}
          <div className="flex-grow my-5 flex flex-col justify-start select-none overflow-y-auto pr-1">
            {activeTab === 0 ? (
              <div className="flex flex-col gap-4">
                <span className="text-cyber-cyan text-glow-cyan font-orbitron font-extrabold tracking-wider text-[11px] uppercase">
                  &gt; CORE TECH STACK
                </span>
                <div className="flex flex-col gap-3 text-[11px]">
                  <div>
                    <span className="text-cyber-purple text-glow-purple font-space font-bold uppercase text-[9px] block">Languages</span>
                    <span className="text-gray-200 font-medium">TypeScript, ES6+, HTML5, CSS3</span>
                  </div>
                  <div>
                    <span className="text-cyber-purple text-glow-purple font-space font-bold uppercase text-[9px] block">Frameworks</span>
                    <span className="text-gray-200 font-medium">React 18/19, Next.js (App/Pages Router)</span>
                  </div>
                  <div>
                    <span className="text-cyber-purple text-glow-purple font-space font-bold uppercase text-[9px] block">Cache & State</span>
                    <span className="text-gray-200 font-medium">Redux Toolkit, Zustand, React Query</span>
                  </div>
                </div>
              </div>
            ) : activeTab === 1 ? (
              <div className="flex flex-col gap-4">
                <span className="text-cyber-purple text-glow-purple font-orbitron font-extrabold tracking-wider text-[11px] uppercase">
                  &gt; WORK CHRONICLES
                </span>
                <div className="flex flex-col gap-4 text-[10px]">
                  <div>
                    <div className="flex justify-between text-cyber-cyan text-glow-cyan font-bold text-[10px] mb-0.5">
                      <span>ZICOPS // FRONTEND ENG</span>
                      <span className="font-mono text-[9px]">2024 - PRES</span>
                    </div>
                    <p className="text-gray-300 font-space font-medium leading-normal">Led App Router conversion & TS migration. Reduced LCP by 30%.</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-cyber-cyan text-glow-cyan font-bold text-[10px] mb-0.5">
                      <span>PRIYARAJA // JR ENGINEER</span>
                      <span className="font-mono text-[9px]">2023 - 2024</span>
                    </div>
                    <p className="text-gray-300 font-space font-medium leading-normal">Constructed standard Storybook library. Scaled tests to 85%+.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <span className="text-cyber-emerald text-glow-emerald font-orbitron font-extrabold tracking-wider text-[11px] uppercase">
                  &gt; SYSTEM TELEMETRY
                </span>
                <div className="flex flex-col gap-3 text-[11px]">
                  <div className="flex justify-between items-center border-b border-space-border/15 pb-1.5">
                    <span className="text-gray-400 font-medium">Lighthouse performance</span>
                    <span className="text-cyber-emerald text-glow-emerald font-bold font-mono text-[12px]">+30%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-space-border/15 pb-1.5">
                    <span className="text-gray-400 font-medium">Network payload size</span>
                    <span className="text-cyber-emerald text-glow-emerald font-bold font-mono text-[12px]">-35%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-space-border/15 pb-1.5">
                    <span className="text-gray-400 font-medium">Automation test coverage</span>
                    <span className="text-cyber-emerald text-glow-emerald font-bold font-mono text-[12px]">85%+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">TypeScript integration</span>
                    <span className="text-cyber-emerald text-glow-emerald font-bold font-mono text-[12px]">100%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-space-border/20 pt-3 flex justify-between items-center text-[9px] text-gray-500 font-space font-semibold tracking-widest">
            <span>CONNECTION_SECURE</span>
            <span className="text-cyber-cyan text-glow-cyan font-bold font-orbitron animate-pulse">ONLINE</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

export function ResumeViewer() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: "Core Stack",
      content: (
        <div className="flex flex-col gap-4 text-xs font-sans">
          <p className="text-gray-400 font-semibold tracking-wide">TECHNICAL ENGINE SPECS:</p>
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-[10px] text-cyber-cyan font-space uppercase font-semibold">Languages</span>
              <p className="text-white text-xs mt-0.5 font-mono">TypeScript, ES6+, HTML5, CSS3</p>
            </div>
            <div>
              <span className="text-[10px] text-cyber-cyan font-space uppercase font-semibold">Frameworks</span>
              <p className="text-white text-xs mt-0.5 font-mono">React 18/19, Next.js (App & Pages Router)</p>
            </div>
            <div>
              <span className="text-[10px] text-cyber-cyan font-space uppercase font-semibold">Data & Cache</span>
              <p className="text-white text-xs mt-0.5 font-mono">Redux Toolkit, Zustand, TanStack React Query</p>
            </div>
            <div>
              <span className="text-[10px] text-cyber-cyan font-space uppercase font-semibold">Validation & Component tools</span>
              <p className="text-white text-xs mt-0.5 font-mono">Storybook, Jest, React Testing Library, ESLint</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Active Orbit",
      content: (
        <div className="flex flex-col gap-4 text-xs font-sans">
          <p className="text-gray-400 font-semibold tracking-wide">PROFESSIONAL CHRONICLES:</p>
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between items-center text-[10px] font-space text-cyber-purple font-semibold">
                <span>ZICOPS // FRONTEND ENGINEER</span>
                <span>2024 - PRESENT</span>
              </div>
              <p className="text-white text-xs mt-1">Lead architecture migrations, TypeScript integration, core web vitals speedup.</p>
            </div>
            <div>
              <div className="flex justify-between items-center text-[10px] font-space text-cyber-purple font-semibold">
                <span>PRIYARAJA ELECTRONICS // JR ENGINEER</span>
                <span>2023 - 2024</span>
              </div>
              <p className="text-white text-xs mt-1">Storybook library construction, test suite coverage scaling to 85%+.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Telemetry Metrics",
      content: (
        <div className="flex flex-col gap-4 text-xs font-sans">
          <p className="text-gray-400 font-semibold tracking-wide">SYS_TELEMETRY PERFORMANCE:</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-space-border/15 pb-1">
              <span className="text-gray-400">Lighthouse Performance Boost</span>
              <span className="text-cyber-emerald font-mono font-bold">+30%</span>
            </div>
            <div className="flex justify-between items-center border-b border-space-border/15 pb-1">
              <span className="text-gray-400">Payload optimization</span>
              <span className="text-cyber-emerald font-mono font-bold">-35%</span>
            </div>
            <div className="flex justify-between items-center border-b border-space-border/15 pb-1">
              <span className="text-gray-400">Testing coverage</span>
              <span className="text-cyber-emerald font-mono font-bold">85%+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">TypeScript Code Coverage</span>
              <span className="text-cyber-emerald font-mono font-bold">100%</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="resume" className="py-24 relative overflow-hidden px-6 bg-space-dark/10">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-orbitron font-bold text-cyber-cyan text-glow-cyan tracking-widest uppercase mb-3">
            [ BIO_CREDENTIALS // INDEX_08 ]
          </h2>
          <h3 className="text-3xl md:text-5xl font-orbitron font-extrabold text-white tracking-tight">
            INTERACTIVE 3D RESUME VIEWER
          </h3>
          <div className="w-12 h-[2px] bg-cyber-cyan mx-auto mt-4" />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Interactive tabs controller (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-center order-2 lg:order-1">
            <div className="flex flex-col gap-3.5">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`p-5 text-left border rounded-xl font-space transition-all duration-300 flex items-center justify-between ${
                    activeTab === idx
                      ? "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan text-glow-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "bg-space-card border-space-border/20 text-gray-400 hover:text-white"
                  } focus:outline-none`}
                >
                  <span className="font-orbitron font-bold uppercase tracking-wider text-sm">
                    {tab.title}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                    activeTab === idx ? "translate-x-1" : "opacity-30"
                  }`} />
                </button>
              ))}
            </div>

            {/* Document contents wrapper */}
            <div className="p-6 glow-card rounded-2xl bg-space-card min-h-[190px] flex flex-col justify-between">
              {tabs[activeTab].content}
              
              <div className="mt-8 pt-4 border-t border-space-border/20 flex gap-4">
                <a
                  href={portfolioData.personalInfo.resumeUrl}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyber-purple/20 hover:bg-cyber-purple/35 border border-cyber-purple/40 hover:border-cyber-purple text-white font-space text-xs font-semibold rounded-md transition-all duration-200 uppercase w-full"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Dossier</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3D Slate Canvas (Right) */}
          <div className="lg:col-span-7 h-[450px] glow-card rounded-3xl border border-space-border/25 bg-space-card/20 relative overflow-hidden order-1 lg:order-2">
            <div className="absolute top-4 left-4 font-space text-[10px] text-gray-500 tracking-wider">
              TELEMETRY DISPLAY MODULE // ACTIVE_ROTATION
            </div>
            
            <Canvas
              camera={{ position: [0, 0, 5.5], fov: 55 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[5, 5, 5]} intensity={1.5} color="#8b5cf6" />
              <pointLight position={[-5, -5, -5]} intensity={1.5} color="#06b6d4" />
              
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <DigitalSlate activeTab={activeTab} />
              </Float>

              {/* AI Robot Humanoid standing behind the slate */}
              <group position={[0.0, -1.9, -1.0]} scale={[0.85, 0.85, 0.85]}>
                <RobotHumanoid isThinking={false} isTyping={false} />
              </group>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
