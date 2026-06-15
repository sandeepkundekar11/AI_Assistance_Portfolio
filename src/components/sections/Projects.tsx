import { Terminal, ExternalLink } from "lucide-react";
import { portfolioData } from "../../data/portfolio";

export function Projects() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs font-space text-cyber-cyan font-bold tracking-widest uppercase">
        <Terminal className="w-4 h-4 text-cyber-cyan" />
        <span>Feats & Projects Blueprint</span>
      </div>
      <div className="flex flex-col gap-6">
        {portfolioData.projects.map((proj) => (
          <div key={proj.id} className="p-5 border border-space-border/25 rounded-xl bg-space-black/35 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-[2.5px] h-0 bg-cyber-cyan group-hover:h-full transition-all duration-300 ease-out" />
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-orbitron font-bold text-white tracking-wide">{proj.title}</h4>
                <span className="text-xs font-space text-cyber-purple font-semibold tracking-wider block mt-0.5">{proj.tagline}</span>
              </div>
              {proj.metrics && (
                <span className="text-xs font-space font-semibold tracking-wider text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyan-500/25 uppercase">
                  {proj.metrics.label}: {proj.metrics.value}
                </span>
              )}
            </div>

            <p className="text-gray-300 text-sm font-sans leading-relaxed mb-4">{proj.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {proj.techStack.map((tech, tIdx) => (
                <span key={tIdx} className="px-2 py-0.5 bg-space-black border border-space-border/20 rounded text-xs font-space text-gray-300 font-medium">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-space-border/15 text-xs font-space text-gray-400">
              <span>SYS_REPOS</span>
              {proj.links.github && (
                <a 
                  href={proj.links.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-cyber-cyan hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>CODE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
