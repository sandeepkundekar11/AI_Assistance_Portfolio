import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquareCode,
  GitBranch,
  ExternalLink,
  ArrowUpRight,
  Cpu,
  Activity,
  Code2,
  Layers,
} from "lucide-react";
import { portfolioData } from "../../data/portfolio";

interface HeroTextProps {
  onOpenChat: () => void;
}

const ROLES = [
  "React.js Developer",
  "Next.js Developer",
  "TypeScript Developer",
  "Frontend Engineer",
  "UI Performance Engineer",
];

export function HeroText({ onOpenChat }: HeroTextProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Typing animation
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex <= currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayedRole(currentRole.slice(0, charIndex));
        setCharIndex((c) => c + 1);
      }, 60);
    } else if (!isDeleting && charIndex > currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayedRole(currentRole.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, 35);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const stats = [
    { icon: Activity, value: "3+", label: "Yrs Exp", color: "text-cyber-cyan" },
    { icon: Code2, value: "98", label: "Lighthouse", color: "text-cyber-emerald" },
    { icon: Layers, value: "85%+", label: "Test Cov.", color: "text-cyber-purple" },
    { icon: Cpu, value: "100%", label: "TypeScript", color: "text-yellow-400" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-7 h-full"
    >
      {/* ── TOP: System identity line ── */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-3 h-3">
          <span className="w-3 h-3 bg-cyber-emerald rounded-full animate-ping opacity-75 absolute" />
          <span className="w-2 h-2 bg-cyber-emerald rounded-full" />
        </div>
        <span className="font-space text-[11px] text-cyber-emerald font-bold tracking-[0.2em] uppercase">
          ONLINE // IDENTITY_CORE VERIFIED
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-cyber-emerald/40 to-transparent" />
      </motion.div>

      {/* ── MAIN: Name + Role block ── */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        {/* Role label pill */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-cyber-purple/15 border border-cyber-purple/40 rounded text-[10px] font-orbitron font-bold text-cyber-purple tracking-widest uppercase">
            {portfolioData.personalInfo.title}
          </span>
          <span className="text-[10px] text-gray-500 font-space tracking-widest">// NODE_001</span>
        </div>

        {/* Name — big gradient headline */}
        <h1 className="font-orbitron font-black leading-none tracking-tight">
          <span
            className="text-3xl md:text-4xl lg:text-[2.6rem] block text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ffffff 0%, #06b6d4 45%, #8b5cf6 100%)",
            }}
          >
            {portfolioData.personalInfo.name.split(" ")[0]}
          </span>
          <span className="text-2xl md:text-3xl lg:text-4xl text-white/90">
            {portfolioData.personalInfo.name.split(" ").slice(1).join(" ")}
          </span>
        </h1>

        {/* Animated typing role */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-space text-gray-500 tracking-widest uppercase">Role:</span>
          <span className="font-space text-base md:text-lg font-semibold text-cyber-cyan">
            {displayedRole}
            <span className="inline-block w-0.5 h-4 bg-cyber-cyan ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
          </span>
        </div>
      </motion.div>

      {/* ── DIVIDER ── */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-6 h-px bg-cyber-cyan/50" />
        <span className="text-[9px] font-space text-gray-600 tracking-[0.25em] uppercase">Bio_Synopsis</span>
        <div className="flex-1 h-px bg-white/5" />
      </motion.div>

      {/* ── TAGLINE ── */}
      <motion.p
        variants={itemVariants}
        className="text-gray-300 text-sm leading-relaxed font-sans border-l-2 border-cyber-purple/50 pl-4"
      >
        {portfolioData.personalInfo.tagline}
      </motion.p>

      {/* ── STATS BAR ── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-4 gap-2"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border border-space-border/25 bg-space-black/40 hover:border-cyber-cyan/30 transition-colors duration-200 group"
            >
              <Icon className={`w-3.5 h-3.5 ${stat.color} group-hover:scale-110 transition-transform duration-200`} />
              <span className={`font-orbitron font-black text-sm ${stat.color}`}>{stat.value}</span>
              <span className="text-[9px] text-gray-500 font-space tracking-wide uppercase text-center leading-tight">{stat.label}</span>
            </div>
          );
        })}
      </motion.div>

      {/* ── ACTION ROW ── */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        {/* Primary CTA */}
        <button
          onClick={onOpenChat}
          className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-space text-sm font-bold text-white tracking-wider uppercase cursor-pointer transition-all duration-300 group relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(6,182,212,0.15) 100%)",
            border: "1px solid rgba(139,92,246,0.5)",
            boxShadow: "0 0 20px rgba(139,92,246,0.1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(139,92,246,0.35)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(139,92,246,0.1)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)";
          }}
        >
          <MessageSquareCode className="w-4 h-4 text-cyber-cyan group-hover:scale-110 transition-transform duration-200" />
          <span>Query AI Sandeep</span>
          <span className="text-[9px] text-cyber-purple font-space font-extrabold tracking-widest ml-1 opacity-70">// LIVE</span>
        </button>

        {/* Secondary links row */}
        <div className="flex items-center gap-2">
          <a
            href={portfolioData.personalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-space-border/30 bg-space-black/30 hover:border-cyber-cyan/40 hover:bg-cyber-cyan/5 text-gray-400 hover:text-white transition-all duration-200 group"
          >
            <GitBranch className="w-3.5 h-3.5 group-hover:text-cyber-cyan transition-colors" />
            <span className="text-xs font-space font-semibold tracking-wide">GitHub</span>
          </a>
          <a
            href={portfolioData.personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-space-border/30 bg-space-black/30 hover:border-cyber-purple/40 hover:bg-cyber-purple/5 text-gray-400 hover:text-white transition-all duration-200 group"
          >
            <ExternalLink className="w-3.5 h-3.5 group-hover:text-cyber-purple transition-colors" />
            <span className="text-xs font-space font-semibold tracking-wide">LinkedIn</span>
          </a>
          <a
            href={portfolioData.personalInfo.resumeUrl}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-space-border/30 bg-space-black/30 hover:border-cyber-emerald/40 hover:bg-cyber-emerald/5 text-gray-400 hover:text-white transition-all duration-200 group"
          >
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-cyber-emerald transition-colors" />
            <span className="text-xs font-space font-semibold tracking-wide">Resume</span>
          </a>
        </div>
      </motion.div>

      {/* ── BOTTOM: Location badge ── */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 mt-auto pt-2 border-t border-space-border/15">
        <span className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-pulse" />
        <span className="text-[10px] font-space text-gray-500 tracking-widest uppercase">
          {portfolioData.personalInfo.location}
        </span>
        <span className="ml-auto text-[10px] font-space text-gray-600 tracking-widest">
          {portfolioData.personalInfo.email}
        </span>
      </motion.div>
    </motion.div>
  );
}
