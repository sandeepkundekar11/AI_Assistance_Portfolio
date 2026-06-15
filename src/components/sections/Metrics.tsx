import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Server, Shield, CodeXml, BookOpen } from "lucide-react";
import { portfolioData } from "../../data/portfolio";

export function Metrics() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const iconMap: { [key: string]: React.ReactNode } = {
    zap: <Zap className="w-6 h-6 text-cyber-cyan" />,
    server: <Server className="w-6 h-6 text-cyber-purple" />,
    shield: <Shield className="w-6 h-6 text-cyber-emerald" />,
    "code-xml": <CodeXml className="w-6 h-6 text-cyber-cyan" />,
    "book-open": <BookOpen className="w-6 h-6 text-cyber-purple" />,
  };

  const getMetricColor = (icon: string) => {
    switch (icon) {
      case "zap": return "text-cyber-cyan text-glow-cyan";
      case "shield": return "text-cyber-emerald text-glow-emerald";
      default: return "text-cyber-purple text-glow-purple";
    }
  };

  return (
    <section id="metrics" className="py-24 relative overflow-hidden px-6 bg-space-dark/30">
      {/* Laser horizontal grid line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-space-border/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-space-border/50 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10" ref={containerRef}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-orbitron font-bold text-cyber-purple text-glow-purple tracking-widest uppercase mb-3">
            [ SYS_PERFORMANCE_METRICS // CORE_04 ]
          </h2>
          <h3 className="text-3xl md:text-5xl font-orbitron font-extrabold text-white tracking-tight">
            CORE IMPACT TELEMETRY
          </h3>
          <div className="w-12 h-[2px] bg-cyber-purple mx-auto mt-4" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {portfolioData.achievements.map((ach, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              className="p-6 glow-card rounded-2xl flex flex-col justify-between items-center text-center bg-space-card/85 min-h-[220px]"
            >
              {/* Icon Container */}
              <div className="p-3 bg-space-black border border-space-border/20 rounded-xl mb-4">
                {iconMap[ach.icon] || <Zap className="w-6 h-6 text-cyber-cyan" />}
              </div>

              {/* Glowing value */}
              <div>
                <span className={`font-orbitron font-black text-3xl block ${getMetricColor(ach.icon)}`}>
                  {ach.value}
                </span>
                <span className="font-space text-xs font-semibold text-white tracking-wider uppercase block mt-1.5">
                  {ach.title}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-gray-500 font-sans mt-3.5 leading-relaxed">
                {ach.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
