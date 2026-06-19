import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Cpu, Bot } from "lucide-react";
import { portfolioData } from "../../data/portfolio";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { id: "hero", label: "Core" },
    { id: "about", label: "Bio" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "architecture", label: "Architecture" },
    // { id: "ai-assistant", label: "AI Assistant" },
    { id: "performance", label: "Telemetry" },
    { id: "contact", label: "Uplink" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[110] transition-all duration-300 ${isOpen
        ? "bg-transparent border-b-transparent"
        : scrolled
          ? "bg-space-black/60 border-b border-space-border backdrop-blur-md"
          : "bg-transparent"
        } ${scrolled ? "py-4" : "py-6"}`}
    >
      <div className="relative z-[120] max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => handleTabClick("hero")}
          className="flex items-center gap-2 font-orbitron font-bold text-lg text-white tracking-widest group focus:outline-none"
        >
          <Cpu className="w-5 h-5 text-cyber-cyan group-hover:rotate-180 transition-transform duration-500" />
          <span className="flex items-center gap-1.5 text-xs md:text-sm font-orbitron tracking-widest text-white">
            SANDEEP<span className="text-cyber-cyan font-bold">.</span>K
            <span className="text-[9px] text-cyber-purple font-space font-extrabold px-1.5 py-0.5 bg-cyber-purple/10 border border-cyber-purple/30 rounded">// AI_AGENT</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-space font-medium tracking-wide">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleTabClick(link.id)}
                  className={`relative py-1 transition-colors duration-200 focus:outline-none hover:text-cyber-cyan cursor-pointer ${activeTab === link.id ? "text-cyber-cyan" : "text-gray-400"
                    }`}
                >
                  {link.label}
                  {activeTab === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* <button
            onClick={() => window.dispatchEvent(new Event("open-ai-chat"))}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyber-cyan/15 hover:bg-cyber-cyan/30 border border-cyber-cyan/40 hover:border-cyber-cyan rounded-md font-space text-xs font-semibold text-white tracking-wide transition-all duration-200 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
          >
            <Bot className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span>AI Synergy</span>
          </button> */}

          <a
            href={portfolioData.personalInfo.resumeUrl}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 bg-cyber-purple/20 hover:bg-cyber-purple/35 border border-cyber-purple/40 hover:border-cyber-purple rounded-md font-space text-xs font-semibold text-white tracking-wide transition-all duration-200"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-300 hover:text-white focus:outline-none"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-space-black/95 backdrop-blur-lg z-[100] transition-all duration-300 lg:hidden flex flex-col justify-between p-8 pt-24 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
      >
        <ul className="flex flex-col gap-6 text-xl font-space font-bold tracking-wider">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleTabClick(link.id)}
                className={`py-1 text-left w-full transition-colors duration-200 cursor-pointer ${activeTab === link.id ? "text-cyber-cyan text-glow-cyan" : "text-gray-400 hover:text-white"
                  }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="pt-8 border-t border-space-border/20 flex flex-col gap-3">
          {/* <button
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new Event("open-ai-chat"));
            }}
            className="flex justify-center items-center gap-2 w-full py-4 bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-lg font-space text-base font-bold text-white tracking-widest cursor-pointer hover:bg-cyber-cyan/35 transition-all duration-200"
          >
            <Bot className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <span>AI SYNERGY PORTAL</span>
          </button> */}

          <a
            href={portfolioData.personalInfo.resumeUrl}
            target="_blank"
            className="flex justify-center items-center gap-2 w-full py-4 bg-cyber-purple/30 border border-cyber-purple/50 rounded-lg font-space text-base font-bold text-white tracking-widest hover:bg-cyber-purple/45 transition-all duration-200"
          >
            <span>VIEW RESUME</span>
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
