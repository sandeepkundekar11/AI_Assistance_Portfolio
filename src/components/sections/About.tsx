import { HardDrive } from "lucide-react";
import { portfolioData } from "../../data/portfolio";

export function About() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs font-space text-cyber-cyan font-bold tracking-widest uppercase">
        <HardDrive className="w-4.5 h-4.5 text-cyber-purple" />
        <span>System.Log // Bio_Core</span>
      </div>
      <h3 className="text-3xl font-orbitron font-extrabold text-white">Sandeep Kundekar</h3>
      <p className="text-gray-300 font-sans text-sm leading-relaxed">
        {portfolioData.personalInfo.bio}
      </p>
      <p className="text-gray-300 font-sans text-sm leading-relaxed">
        With a background working across dynamic tech teams like Zicops, Priyaraja Electronics, and TMITS, I refine frontend pipelines, set up clean testing matrices, and optimize web app loading profiles to achieve 98+ Lighthouse scores.
      </p>

      <div className="grid grid-cols-2 gap-4 border-y border-space-border/20 py-4 my-2">
        <div>
          <span className="text-[10px] text-gray-400 font-space tracking-widest uppercase">Experience Matrix</span>
          <span className="text-white font-orbitron font-bold text-base mt-0.5 block">{portfolioData.personalInfo.experienceYears} Verified</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-space tracking-widest uppercase">Operation Center</span>
          <span className="text-white font-orbitron font-bold text-base mt-0.5 block">{portfolioData.personalInfo.location}</span>
        </div>
      </div>

      {/* Pillars */}
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl border border-space-border/20 bg-space-black/30 flex gap-4 items-start">
          <div className="p-2.5 bg-space-black border border-space-border/30 rounded text-cyber-cyan font-bold">01</div>
          <div>
            <h4 className="font-orbitron font-bold text-white text-sm">Performance Optimization</h4>
            <p className="text-sm text-gray-300 mt-1 leading-relaxed">Delivering load times under 1.5 seconds. Obsessed with reducing LCP, eliminating layout shifts, and minimizing JavaScript payloads.</p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-space-border/20 bg-space-black/30 flex gap-4 items-start">
          <div className="p-2.5 bg-space-black border border-space-border/30 rounded text-cyber-purple font-bold">02</div>
          <div>
            <h4 className="font-orbitron font-bold text-white text-sm">Component Architect</h4>
            <p className="text-sm text-gray-300 mt-1 leading-relaxed">Designing highly reusable atomic components and component libraries fully documented and cataloged using Storybook.</p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-space-border/20 bg-space-black/30 flex gap-4 items-start">
          <div className="p-2.5 bg-space-black border border-space-border/30 rounded text-cyber-emerald font-bold">03</div>
          <div>
            <h4 className="font-orbitron font-bold text-white text-sm">Clean Code & Testing</h4>
            <p className="text-sm text-gray-300 mt-1 leading-relaxed">Believer in strict static typing via TypeScript and ensuring platform resilience with automated Jest and RTL coverage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
