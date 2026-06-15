import { Shield } from "lucide-react";
import { portfolioData } from "../../data/portfolio";

export function Performance() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs font-space text-cyber-cyan font-bold tracking-widest uppercase">
        <Shield className="w-4 h-4 text-cyber-emerald" />
        <span>Lighthouse & Diagnostics</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.keys(portfolioData.performance.lighthouse).map((key) => {
          const score = portfolioData.performance.lighthouse[key as keyof typeof portfolioData.performance.lighthouse];
          let colorClass = "text-cyber-emerald";
          if (score < 90) colorClass = "text-yellow-500";
          
          return (
            <div key={key} className="p-4 border border-space-border/20 rounded-xl bg-space-black/30 flex flex-col items-center justify-center text-center">
              <span className={`font-orbitron font-black text-2xl ${colorClass}`}>{score}</span>
              <span className="font-space text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1.5">
                {key === "bestPractices" ? "Best Practices" : key.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="p-4 border border-space-border/20 rounded-xl bg-space-black/35 mt-2">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-space-border/20 text-gray-400 font-space uppercase tracking-wider">
              <th className="pb-2">Metric</th>
              <th className="pb-2 text-center">Before</th>
              <th className="pb-2 text-center text-cyber-emerald">Optimized</th>
              <th className="pb-2 text-right">Goal</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.performance.metrics.map((metric, idx) => (
              <tr key={idx} className="border-b border-space-border/10 hover:bg-space-black/35 transition-colors">
                <td className="py-3 font-semibold text-white">{metric.name}</td>
                <td className="py-3 text-center text-red-400 font-mono">{metric.before}</td>
                <td className="py-3 text-center text-cyber-emerald font-mono font-bold">{metric.after}</td>
                <td className="py-3 text-right text-gray-400 font-mono">{metric.goal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border border-space-border/20 rounded-xl bg-space-black/35 flex flex-col gap-4">
        <h4 className="font-orbitron text-xs font-black tracking-widest uppercase text-cyber-cyan border-l-2 border-cyber-cyan pl-2">Core Impact Telemetry</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm leading-relaxed">
          {portfolioData.achievements.map((ach, idx) => (
            <div key={idx} className="p-3 border border-space-border/10 rounded-lg bg-space-black/40">
              <span className="font-orbitron font-bold text-cyber-purple block">{ach.title} // {ach.value}</span>
              <p className="text-xs text-gray-300 mt-1">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
