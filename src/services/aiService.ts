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
      return `You can reach me by email at sandeepkundekar1000@gmail.com or call me at +91 8217291928. I am based in Belgaum and Bengaluru, Karnataka. You can also view my open-source code repositories on GitHub or check out my professional network on LinkedIn. Let's connect!`;
    }

    // 2. Introduction / Greetings
    if (normalized.includes("hello") || normalized.includes("hi ") || normalized.includes("hey") || normalized.includes("who are you") || normalized.includes("introduce") || normalized.includes("about yourself")) {
      return recruiterAnswers.introduceYourself;
    }

    // 3. Technical Skills
    if (normalized.includes("skill") || normalized.includes("stack") || normalized.includes("tech") || normalized.includes("react") || normalized.includes("typescript") || normalized.includes("next") || normalized.includes("redux") || normalized.includes("zustand") || normalized.includes("testing") || normalized.includes("jest")) {
      const frontendSkills = skills.frontend.slice(0, 6).join(", ");
      const stateSkills = skills.stateManagement.slice(0, 3).join(", ");
      const toolSkills = skills.tools.slice(0, 4).join(", ");
      return `I specialize in frontend engineering. My primary toolkit includes ${frontendSkills}. For managing application state, I work with ${stateSkills}, and my developer tools include ${toolSkills}. I focus on building performant, responsive, and robust user interfaces.`;
    }

    // 4. Career Experience
    if (normalized.includes("experience") || normalized.includes("job") || normalized.includes("work") || normalized.includes("company") || normalized.includes("tmits") || normalized.includes("priyaraja") || normalized.includes("zicops") || normalized.includes("history") || normalized.includes("intern")) {
      const expDetails = experience.map(exp => `${exp.position} at ${exp.company}`).join(", followed by my work as a ");
      return `I have over ${identity.experience} of professional experience. I started my career as a ${expDetails}. In these positions, I led initiatives to optimize web speed, build interactive learning features, and refactor applications.`;
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

      const petTitles = petProjects.map(p => p.title).join(", a ");
      const workTitles = workProjects.map(p => p.title).join(", a ");

      return `I have built both professional production-grade projects and independent self-study systems. In my professional experience at TMITS, Priyaraja Electronics, and Zicops, I engineered core systems including the ${workTitles}. For my personal study profile, I built projects such as a ${petTitles}. These represent my expertise in Next.js/React architectures, Redis API caching, WebRTC systems, and list virtualization.`;
    }

    // 6. Achievements
    if (normalized.includes("achievement") || normalized.includes("accomplish") || normalized.includes("lighthouse") || normalized.includes("errors")) {
      return `Some of my achievements include optimizing legacy web applications to achieve a ninety-five plus score in Lighthouse performance, and refactoring build structures to reduce runtime errors.`;
    }

    // 7. Education
    if (normalized.includes("education") || normalized.includes("college") || normalized.includes("degree") || normalized.includes("cgpa") || normalized.includes("university")) {
      const deg = education.degree;
      return `I completed my ${deg.degree} in ${deg.specialization} at ${deg.institution} with a final cumulative grade point average of ${deg.cgpa}.`;
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
      You are AI Sandeep.

      Answer only questions about Sandeep.
      Speak in the first person as Sandeep. Answer like a real person talking naturally in a conversation, not like reading a list of database entries or structured facts.

      INFORMATION:
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
        model: "gpt-oss-120b",
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
