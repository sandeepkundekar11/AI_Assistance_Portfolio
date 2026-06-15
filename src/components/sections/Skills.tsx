import React, { Suspense } from "react";
import { Cpu } from "lucide-react";
import { portfolioData } from "../../data/portfolio";

const SkillsGalaxy = React.lazy(() =>
  import("../three/SkillsGalaxy").then((module) => ({ default: module.SkillsGalaxy }))
);

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

interface SkillsProps {
  show3dSkills: boolean;
  setShow3dSkills: (show: boolean) => void;
}

export function Skills({ show3dSkills, setShow3dSkills }: SkillsProps) {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-space-border/15 pb-3">
        <div className="flex items-center gap-2 text-xs font-space text-cyber-cyan font-bold tracking-widest uppercase">
          <Cpu className="w-4 h-4 text-cyber-cyan" />
          <span>Cognitive Skill Matrix</span>
        </div>
        <button
          onClick={() => setShow3dSkills(!show3dSkills)}
          className="px-3 py-1 bg-cyber-purple/10 border border-cyber-purple/35 hover:border-cyber-cyan rounded text-xs font-space font-bold text-cyber-purple hover:text-cyber-cyan tracking-widest uppercase cursor-pointer transition-colors duration-200"
        >
          {show3dSkills ? "View Static Grid" : "View 3D Galaxy"}
        </button>
      </div>

      {show3dSkills ? (
        <div className="w-full h-[400px] border border-space-border/20 rounded-xl bg-space-black/40 relative cursor-grab active:cursor-grabbing overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] text-gray-400 font-space tracking-widest uppercase z-10 pointer-events-none">
            DRAG TO ROTATE // INTERACTIVE CONSTELLATION
          </div>
          <Suspense fallback={<CanvasFallback />}>
            <SkillsGalaxy />
          </Suspense>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {portfolioData.skills.map((category, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-space-border/25 bg-space-black/30">
              <h4 className="font-orbitron text-xs font-black tracking-widest uppercase text-cyber-cyan text-glow-cyan mb-4 border-l-2 border-cyber-cyan pl-2">
                {category.category.toUpperCase()}
              </h4>
              <div className="flex flex-col gap-3.5">
                {category.skills.map((sk, skIdx) => (
                  <div key={skIdx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm font-space font-semibold text-gray-200">
                      <span>{sk.name}</span>
                      <span className="text-cyber-purple font-bold">{sk.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-space-black/60 rounded-full overflow-hidden border border-space-border/10">
                      <div 
                        className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all duration-500"
                        style={{ width: `${sk.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
