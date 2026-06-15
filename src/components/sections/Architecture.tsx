import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Database, Compass, Paintbrush, HelpCircle } from "lucide-react";
import { portfolioData } from "../../data/portfolio";

export function Architecture() {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  const getIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Paintbrush className="w-4 h-4 text-cyber-cyan" />;
      case 1: return <Compass className="w-4 h-4 text-cyber-purple" />;
      case 2: return <HelpCircle className="w-4 h-4 text-cyber-cyan" />;
      case 3: return <Database className="w-4 h-4 text-cyber-emerald" />;
      default: return <Server className="w-4 h-4 text-cyber-purple" />;
    }
  };

  const getBorderColor = (idx: number) => {
    if (selectedLayerIndex === idx) {
      return idx === 3 ? "border-cyber-emerald shadow-[0_0_12px_rgba(16,185,129,0.15)]" : idx === 0 || idx === 2 ? "border-cyber-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]" : "border-cyber-purple shadow-[0_0_12px_rgba(139,92,246,0.15)]";
    }
    return "border-space-border/20 hover:border-space-border-hover/45";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header telemetry info */}
      <div className="flex items-center gap-2 text-[10px] font-space text-cyber-cyan font-bold tracking-widest uppercase border-b border-space-border/15 pb-3">
        <Database className="w-4 h-4 text-cyber-cyan" />
        <span>SYS_SCHEMATICS // ARCHITECTURE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Layer Buttons Stack */}
        <div className="md:col-span-5 flex flex-col gap-2.5">
          {portfolioData.architecture.layers.map((layer, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedLayerIndex(idx)}
              className={`w-full flex gap-3.5 items-center p-3.5 bg-space-black/40 hover:bg-space-black/60 border rounded-xl text-left cursor-pointer transition-all duration-200 ${getBorderColor(
                idx
              )} focus:outline-none`}
            >
              {/* Node circle */}
              <div className="w-7 h-7 rounded-full bg-space-black flex items-center justify-center border border-space-border/40 shrink-0">
                {getIcon(idx)}
              </div>

              <div className="flex-grow overflow-hidden">
                <h4 className="font-orbitron font-bold text-white text-xs tracking-wider">
                  {layer.name}
                </h4>
                <span className="text-[9px] font-space text-gray-500 block truncate mt-0.5">
                  {layer.tech}
                </span>
              </div>

              {/* Arrow active pointer */}
              {selectedLayerIndex === idx && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
            </button>
          ))}
        </div>

        {/* Detailed Inspector Card */}
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLayerIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl border border-space-border/25 bg-space-black/35 relative overflow-hidden h-full flex flex-col justify-between"
            >
              {/* Visual scanner background lines */}
              <div className="hologram-line" />
              <div className="absolute top-3 right-3 font-space text-[8px] text-gray-500 tracking-widest uppercase">
                LAYER_0{selectedLayerIndex + 1}_SPEC
              </div>

              <div>
                <span className="text-[9px] font-orbitron font-bold text-cyber-cyan uppercase block mb-1">
                  Layer Specifications
                </span>
                <h4 className="text-xl font-orbitron font-black text-white tracking-wide mb-3">
                  {portfolioData.architecture.layers[selectedLayerIndex].name}
                </h4>
                <div className="px-2.5 py-1 bg-space-black border border-space-border/20 rounded font-space text-[10px] text-cyber-purple text-glow-purple font-semibold mb-4 inline-block">
                  {portfolioData.architecture.layers[selectedLayerIndex].tech}
                </div>
                <p className="text-gray-400 text-xs font-sans leading-relaxed">
                  {portfolioData.architecture.layers[selectedLayerIndex].desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-space-border/20 flex justify-between items-center text-[8px] font-space text-gray-500 tracking-wider">
                <span>STANDARD: SOLID // DRY</span>
                <span>SECURE_ENVELOPE</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

