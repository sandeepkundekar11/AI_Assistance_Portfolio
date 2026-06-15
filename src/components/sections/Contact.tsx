import React, { useState, useEffect, useRef } from "react";
import { Terminal, Send, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/Icons";
import { portfolioData } from "../../data/portfolio";

interface CommandLog {
  input?: string;
  output: string | React.ReactNode;
}

export function Contact() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      output: (
        <div>
          <p className="text-cyber-cyan font-bold text-xs">
            === COMMUNICATION UPLINK TERMINAL V1.0 ===
          </p>
          <p className="text-gray-400 mt-1 text-xs">
            Type{" "}
            <span className="text-cyber-purple font-semibold">"help"</span>{" "}
            to view commands, or click a macro below.
          </p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const presetCommands = ["help", "about", "skills", "contact", "hire", "clear"];

  const handleExecuteCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    let response: string | React.ReactNode = "";

    switch (cleanCmd) {
      case "help":
        response = (
          <div className="flex flex-col gap-0.5 text-xs">
            <p className="text-white font-semibold mb-1">Available commands:</p>
            {[
              ["about", "Biography and focus areas"],
              ["skills", "Software capabilities list"],
              ["contact", "Mail and network handles"],
              ["hire", "Open direct email prompt"],
              ["clear", "Clear terminal console"],
            ].map(([cmd, desc]) => (
              <p key={cmd}>
                <span className="text-cyber-cyan font-semibold">{cmd}</span>
                <span className="text-gray-500"> — {desc}</span>
              </p>
            ))}
          </div>
        );
        break;
      case "about":
        response = (
          <div className="flex flex-col gap-1 text-xs">
            <p className="text-white font-semibold">Sandeep Kundekar // Profile:</p>
            <p className="text-gray-400 leading-relaxed">{portfolioData.personalInfo.bio}</p>
            <p className="text-gray-400">Experience: {portfolioData.personalInfo.experienceYears}</p>
          </div>
        );
        break;
      case "skills":
        response = (
          <div className="flex flex-col gap-2 text-xs">
            <p className="text-white font-semibold">Core Capabilities:</p>
            <div className="grid grid-cols-2 gap-1">
              {portfolioData.skills.flatMap((cat) =>
                cat.skills.map((sk) => (
                  <div
                    key={sk.name}
                    className="flex justify-between items-center bg-space-black/50 px-2 py-0.5 border border-space-border/20 rounded"
                  >
                    <span className="text-gray-300 font-semibold">{sk.name}</span>
                    <span className="text-cyber-cyan">{sk.level}%</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
        break;
      case "contact":
        response = (
          <div className="flex flex-col gap-1 text-xs">
            <p className="text-white font-semibold">Network Channels:</p>
            <p>
              Email:{" "}
              <a
                href={`mailto:${portfolioData.personalInfo.email}`}
                className="text-cyber-cyan hover:underline"
              >
                {portfolioData.personalInfo.email}
              </a>
            </p>
            <p>
              GitHub:{" "}
              <a
                href={portfolioData.personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="text-cyber-cyan hover:underline"
              >
                github.com/sandeepkundekar11
              </a>
            </p>
            <p>
              LinkedIn:{" "}
              <a
                href={portfolioData.personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-cyber-cyan hover:underline"
              >
                linkedin.com/in/sandeep-kundekar
              </a>
            </p>
          </div>
        );
        break;
      case "clear":
        setLogs([]);
        setInput("");
        return;
      case "hire":
        response = (
          <div className="text-xs">
            <p className="text-cyber-emerald">Accessing mail protocol...</p>
            <p className="text-gray-400 mt-1">
              Or reach manually at: {portfolioData.personalInfo.email}
            </p>
          </div>
        );
        setTimeout(() => {
          window.location.href = `mailto:${portfolioData.personalInfo.email}?subject=Collaboration%20Inquiry`;
        }, 800);
        break;
      default:
        response = (
          <p className="text-red-400 font-semibold text-xs">
            Unknown command: "{cmd}". Type "help" for available commands.
          </p>
        );
    }

    setLogs((prev) => [...prev, { input: cmd, output: response }]);
    setInput("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteCommand(input);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-cyan" />
          <span className="font-orbitron text-xs font-bold text-white tracking-widest uppercase">
            Uplink Terminal
          </span>
        </div>
        {/* Social links */}
        <div className="flex items-center gap-3">
          <a
            href={portfolioData.personalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-cyber-cyan transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={portfolioData.personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-cyber-cyan transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${portfolioData.personalInfo.email}`}
            className="text-gray-500 hover:text-cyber-cyan transition-colors"
            aria-label="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ── Terminal Box ── */}
      <div className="flex-1 flex flex-col rounded-xl border border-space-border/25 bg-space-black/70 overflow-hidden font-mono text-xs text-gray-400 min-h-0">
        {/* Title bar */}
        <div className="bg-space-black/80 px-3 py-2 flex items-center justify-between border-b border-space-border/20 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-gray-600 font-space text-[10px] tracking-wider">
            sandeepk@: ~
          </span>
          <div className="w-10" />
        </div>

        {/* Console output */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin">
          {logs.map((log, index) => (
            <div key={index} className="flex flex-col gap-1">
              {log.input && (
                <div className="flex items-center gap-2">
                  <span className="text-cyber-cyan shrink-0">guest@:~$</span>
                  <span className="text-white font-semibold">{log.input}</span>
                </div>
              )}
              <div className="text-gray-300 pl-2 border-l border-space-border/15">
                {log.output}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Macro buttons */}
        <div className="px-3 py-2 bg-space-black/60 border-t border-space-border/15 flex flex-wrap gap-1.5 items-center shrink-0">
          <span className="text-[9px] text-gray-600 font-space tracking-wider uppercase font-semibold mr-1">
            macros:
          </span>
          {presetCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleExecuteCommand(cmd)}
              className="px-2 py-0.5 bg-cyber-purple/10 hover:bg-cyber-purple/25 border border-cyber-purple/35 hover:border-cyber-purple/60 rounded text-[10px] text-cyber-purple font-semibold font-space tracking-wide transition-all duration-150 uppercase focus:outline-none"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center bg-space-black/80 border-t border-space-border/20 px-3 py-2.5 shrink-0"
        >
          <span className="text-cyber-cyan font-bold mr-2 shrink-0 text-xs">
            guest@:~$
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='type command and press enter...'
            className="bg-transparent text-white font-mono text-xs placeholder-gray-600 focus:outline-none flex-grow"
            aria-label="Terminal input"
          />
          <button
            type="submit"
            className="text-cyber-cyan hover:text-white p-1 hover:bg-cyber-cyan/10 rounded transition-all duration-150"
            aria-label="Submit"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
