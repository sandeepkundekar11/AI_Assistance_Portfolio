import { KnowledgeService } from "./knowledgeService";
import type {
  Identity,
  Skills,
  ExperienceEntry,
  ProjectEntry,
  Education,
  RecruiterAnswers,
  BehavioralTraits,
  ProfessionalSummary
} from "./knowledgeService";

export const AIService = {
  formatIdentity(id: Identity): string {
    return `### Identity Profile
- Name: ${id.fullName}
- Title: ${id.title}
- Experience: ${id.experience}
- Location: ${id.location}
- Email: ${id.email}
- Phone: ${id.phone}
- LinkedIn: ${id.linkedin}
- GitHub: ${id.github}`;
  },

  formatSkills(skills: Skills): string {
    return `### Technical Skills Matrix
- Frontend Stack: ${skills.frontend.join(", ")}
- State Management: ${skills.stateManagement.join(", ")}
- Backend & Database: ${skills.backend.join(", ")}
- API & Authentication: ${skills.apiAndAuth.join(", ")}
- Testing & QA: ${skills.testing.join(", ")}
- Developer Tools: ${skills.tools.join(", ")}
- Architecture Patterns: ${skills.architecture.join(", ")}
- Performance Tuning: ${skills.performance.join(", ")}`;
  },

  formatExperience(expList: ExperienceEntry[]): string {
    let str = `### Professional Experience Logs\n`;
    expList.forEach(exp => {
      str += `\n- Company: ${exp.company}
  Role: ${exp.position}
  Duration: ${exp.duration}
  Highlights:
${exp.highlights.map((h: string) => `    * ${h}`).join("\n")}`;
    });
    return str;
  },

  formatProjects(projList: ProjectEntry[]): string {
    let str = `### Key Engineered Projects\n`;
    projList.forEach(p => {
      str += `\n- Project: ${p.title}
  Category: ${p.category}
  Technologies: ${p.technologies.join(", ")}
  Description: ${p.description}
  Features:
${p.features.map((f: string) => `    * ${f}`).join("\n")}`;
    });
    return str;
  },

  formatAchievements(achievements: string[]): string {
    return `### Professional Achievements
${achievements.map(a => `- ${a}`).join("\n")}`;
  },

  formatEducation(edu: Education): string {
    return `### Education Matrix
- Degree: ${edu.degree.degree} in ${edu.degree.specialization} from ${edu.degree.institution} (Duration: ${edu.degree.duration}, CGPA: ${edu.degree.cgpa})
- Pre-University: Stream: ${edu.preUniversity.stream} from ${edu.preUniversity.institution} (Duration: ${edu.preUniversity.duration}, CGPA: ${edu.preUniversity.cgpa})`;
  },

  formatBehavioralTraits(traits: BehavioralTraits): string {
    return `### Behavioral Traits & Style
- Teamwork: ${traits.teamwork}
- Leadership: ${traits.leadership}
- Problem Solving: ${traits.problemSolving}
- Ownership: ${traits.ownership}
- Learning Mindset: ${traits.learningMindset}`;
  },

  formatRecruiterAnswers(answers: RecruiterAnswers): string {
    return `### Recruiter Q&A Guidelines
- Introduce Yourself: ${answers.introduceYourself}
- Core Expertise: ${answers.coreExpertise}
- Years of Experience: ${answers.yearsOfExperience}
- Full-Stack Experience: ${answers.fullStackExperience}
- Strongest Skill: ${answers.strongestSkill}
- Why Hire Me: ${answers.whyHireMe}
- Current Focus: ${answers.currentFocus}
- Preferred Role: ${answers.preferredRole}
- Availability: ${answers.availability}`;
  },

  formatProfessionalSummary(sum: ProfessionalSummary): string {
    return `### Professional Summary
- Short Summary: ${sum.short}
- Detailed Summary: ${sum.detailed}`;
  },

  /**
   * Builds context dynamically from knowledge-base.json matching keywords to prevent prompt bloat/hallucinations
   */
  buildDynamicContext(query: string): string {
    const normalized = query.toLowerCase();
    const contextParts: string[] = [];

    // Always include basic identity details
    contextParts.push(this.formatIdentity(KnowledgeService.getIdentity()));

    // Conditionally include relevant sections
    if (normalized.includes("skill") || normalized.includes("stack") || normalized.includes("tech") || normalized.includes("expert") || normalized.includes("languages")) {
      contextParts.push(this.formatSkills(KnowledgeService.getSkills()));
    }

    if (normalized.includes("experience") || normalized.includes("job") || normalized.includes("work") || normalized.includes("company") || normalized.includes("timeline") || normalized.includes("history")) {
      contextParts.push(this.formatExperience(KnowledgeService.getExperience()));
    }

    if (normalized.includes("project") || normalized.includes("portfolio") || normalized.includes("build") || normalized.includes("platform") || normalized.includes("commerce") || normalized.includes("task") || normalized.includes("quiz")) {
      contextParts.push(this.formatProjects(KnowledgeService.getProjects()));
    }

    if (normalized.includes("achievement") || normalized.includes("accomplish") || normalized.includes("lighthouse") || normalized.includes("milestone")) {
      contextParts.push(this.formatAchievements(KnowledgeService.getAchievements()));
    }

    if (normalized.includes("education") || normalized.includes("college") || normalized.includes("degree") || normalized.includes("cgpa")) {
      contextParts.push(this.formatEducation(KnowledgeService.getEducation()));
    }

    if (normalized.includes("behavior") || normalized.includes("team") || normalized.includes("lead") || normalized.includes("solve") || normalized.includes("owner")) {
      contextParts.push(this.formatBehavioralTraits(KnowledgeService.getBehavioralTraits()));
    }

    if (normalized.includes("why") || normalized.includes("hire") || normalized.includes("focus") || normalized.includes("role") || normalized.includes("avail") || normalized.includes("stack")) {
      contextParts.push(this.formatRecruiterAnswers(KnowledgeService.getRecruiterAnswers()));
    }

    // Default fallback if no specific keywords matched
    if (contextParts.length === 1) {
      contextParts.push(this.formatProfessionalSummary(KnowledgeService.getProfessionalSummary()));
    }

    return contextParts.join("\n\n");
  },

  /**
   * Generates grounded answers locally for offline fallback mode
   */
  generateLocalGroundedResponse(query: string): string {
    const normalized = query.toLowerCase();
    const identity = KnowledgeService.getIdentity();
    const skills = KnowledgeService.getSkills();
    const experience = KnowledgeService.getExperience();
    const projects = KnowledgeService.getProjects();
    const education = KnowledgeService.getEducation();
    const recruiterAnswers = KnowledgeService.getRecruiterAnswers();

    // 1. Contact Info
    if (normalized.includes("contact") || normalized.includes("email") || normalized.includes("phone") || normalized.includes("linkedin") || normalized.includes("github") || normalized.includes("gmail") || normalized.includes("location") || normalized.includes("address")) {
      return `Yeah sure, the best way to reach me is by email at sandeepkundekar1000@gmail.com, or you can call me at plus 91 8217291928. I'm based between Belgaum and Bengaluru in Karnataka. And my GitHub and LinkedIn are always open if you want to see my work or just connect.`;
    }

    // 2. Introduction / Greetings
    if (normalized.includes("hello") || normalized.includes("hi ") || normalized.includes("hey") || normalized.includes("who are you") || normalized.includes("introduce") || normalized.includes("about yourself")) {
      return recruiterAnswers.introduceYourself;
    }

    // 3. Technical Skills
    if (normalized.includes("skill") || normalized.includes("stack") || normalized.includes("tech") || normalized.includes("react") || normalized.includes("typescript") || normalized.includes("next") || normalized.includes("redux") || normalized.includes("zustand") || normalized.includes("testing") || normalized.includes("jest")) {
      const frontendSkills = skills.frontend.slice(0, 5).join(", ");
      const stateSkills = skills.stateManagement.slice(0, 3).join(", ");
      return `So my main focus is really on the frontend. I spend most of my time working with ${frontendSkills}. For state management I'm pretty comfortable with ${stateSkills}, and I've got solid testing experience too. Basically I just like building things that are fast, clean, and actually feel good to use.`;
    }

    // 4. Career Experience
    if (normalized.includes("experience") || normalized.includes("job") || normalized.includes("work") || normalized.includes("company") || normalized.includes("tmits") || normalized.includes("priyaraja") || normalized.includes("zicops") || normalized.includes("history") || normalized.includes("intern")) {
      const first = experience[0];
      const last = experience[experience.length - 1];
      return `I've got a little over ${identity.experience} of experience now. I started out at ${last?.company} where I honestly learned a lot about shipping real production systems, then moved into more senior work at ${first?.company}. Across those roles I was building actual user-facing products — dashboards, real-time trackers, e-commerce platforms, that kind of thing.`;
    }

    // 5. Projects
    if (
      normalized.includes("project") ||
      normalized.includes("portfolio") ||
      normalized.includes("commerce") ||
      normalized.includes("task") ||
      normalized.includes("quiz") ||
      normalized.includes("blog") ||
      normalized.includes("tmits") ||
      normalized.includes("priyaraja") ||
      normalized.includes("zicops")
    ) {
      const petProjects = projects.filter(p => !p.title.includes("("));
      const workProjects = projects.filter(p => p.title.includes("("));
      const petSample = petProjects.slice(0, 2).map(p => p.title).join(" and a ");
      const workSample = workProjects.slice(0, 2).map(p => p.title.replace(/\s*\(.*\)/, "")).join(" and the ");
      return `Honestly there's quite a bit. On the professional side I built things like the ${workSample} at TMITS — real production systems with actual users. And separately I've got personal projects too, like a ${petSample}. So it's a mix of company work and things I built just because I wanted to solve a problem.`;
    }

    // 6. Achievements
    if (normalized.includes("achievement") || normalized.includes("accomplish") || normalized.includes("lighthouse") || normalized.includes("errors")) {
      return `One thing I'm actually pretty proud of is pushing a Lighthouse performance score past ninety-five on one of the legacy apps. That involved a lot of code splitting, lazy loading, and fixing some deep render bottlenecks. It made a real difference to how the app felt to use day to day.`;
    }

    // 7. Education
    if (normalized.includes("education") || normalized.includes("college") || normalized.includes("degree") || normalized.includes("cgpa") || normalized.includes("university")) {
      const deg = education.degree;
      return `I did my ${deg.degree} in ${deg.specialization} at ${deg.institution} and graduated with a ${deg.cgpa} CGPA. Honestly that's where I first got into building things and realized frontend engineering was what I actually wanted to do.`;
    }

    // 8. Specific recruiter items
    if (normalized.includes("why hire") || normalized.includes("hire you")) {
      return recruiterAnswers.whyHireMe;
    }
    if (normalized.includes("current focus") || normalized.includes("focus")) {
      return recruiterAnswers.currentFocus;
    }
    if (normalized.includes("preferred role") || normalized.includes("role")) {
      return recruiterAnswers.preferredRole;
    }
    if (normalized.includes("availability") || normalized.includes("available")) {
      return recruiterAnswers.availability;
    }
    if (normalized.includes("full stack") || normalized.includes("backend")) {
      return recruiterAnswers.fullStackExperience;
    }
    if (normalized.includes("strongest skill")) {
      return recruiterAnswers.strongestSkill;
    }

    // Default general summary
    return recruiterAnswers.introduceYourself;
  },

  /**
   * Generates a response using the gpt-oss-120b API, fully grounded on dynamic context
   */
  async generateLLMResponse(
    query: string,
    chatHistory: { role: "user" | "assistant"; content: string }[]
  ): Promise<string> {
    const activeApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!activeApiKey) {
      throw new Error("API Key is missing.");
    }

    const context = this.buildDynamicContext(query);
    const systemPrompt = `
You are AI Sandeep — a digital replica of Sandeep N Kundekar, a frontend engineer.

Your job is to answer questions about Sandeep in a spoken, conversational way — exactly like a real person talking in a job interview or casual chat. You are being read aloud by a text-to-speech voice, so your response MUST sound natural when spoken.

STRICT RULES — NEVER BREAK THESE:
- Do NOT use any markdown: no ##, no **, no *, no bullet points (- or •), no numbered lists (1. 2. 3.), no backticks, no colons at the end of a sentence.
- Do NOT structure your answer like a document or a list of facts.
- Do NOT start sentences with labels like "Skills:", "Experience:", "Projects:" or "Here are my...".
- Do NOT say "Here is a summary of..." or "Let me list...".
- Keep it SHORT and NATURAL — 3 to 5 sentences maximum unless the user asks for details.
- Talk the way a confident person talks in an interview — relaxed, direct, and real.
- Use connecting words like "so", "actually", "honestly", "I mean", "basically", "you know" when it makes sense.
- If listing technologies or skills, weave them into a sentence naturally, do not line them up.

GOOD EXAMPLE (natural): "Yeah so I've been doing frontend work for a little over two years now. Most of my time has been with React and Next.js, honestly that's where I feel most confident. I've shipped a bunch of stuff at TMITS including a full e-commerce platform that ended up boosting their Lighthouse score by thirty percent."

BAD EXAMPLE (do not do this): "Here are my skills: React, Next.js, TypeScript. I have experience at TMITS. My projects include..."

INFORMATION ABOUT SANDEEP (use this as your source of truth, do not make things up):
${context}
    `;

    const baseUrl = import.meta.env.VITE_OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions";

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${activeApiKey}`
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || "gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Telemetry response payload is empty.";
  }
};
