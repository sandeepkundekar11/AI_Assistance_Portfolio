import { Terminal } from "lucide-react";
import { portfolioData } from "../../data/portfolio";

export function Experience() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs font-space text-cyber-cyan font-bold tracking-widest uppercase">
        <Terminal className="w-4 h-4 text-cyber-purple" />
        <span>Work Chronology Logs</span>
      </div>
      <div className="relative pl-5 border-l border-space-border/30 flex flex-col gap-8">
        {portfolioData.experience.map((exp, idx) => (
          <div key={idx} className="relative">
            {/* Timeline Bullet node */}
            <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 bg-space-black border border-cyber-cyan rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.6)]" />

            {/* Experience block */}
            <div className="p-5 border border-space-border/20 rounded-xl bg-space-black/30 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2 flex-wrap sm:flex-nowrap">
                <div>
                  <h4 className="text-base font-orbitron font-bold text-white tracking-wide">{exp.role}</h4>
                  <span className="font-space text-sm font-semibold text-cyber-cyan block mt-0.5">{exp.company}</span>
                </div>
                <div className="text-xs text-gray-400 font-space font-medium text-right mt-1">
                  <div>{exp.duration}</div>
                  <div>{exp.location}</div>
                </div>
              </div>

              <ul className="flex flex-col gap-2 text-gray-300 text-sm font-sans list-disc pl-4 leading-relaxed font-bold">
                {exp.description.map((item, dIdx) => (
                  <li key={dIdx}>{item}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-space-border/10">
                {exp.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="px-2 py-0.5 bg-space-black/80 border border-space-border/20 rounded text-xs font-space text-gray-300 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
