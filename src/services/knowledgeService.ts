import knowledgeBase from "../data/knowledge-base.json";

export interface Identity {
  fullName: string;
  title: string;
  experience: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

export interface ProfessionalSummary {
  short: string;
  detailed: string;
}

export interface Skills {
  frontend: string[];
  stateManagement: string[];
  backend: string[];
  apiAndAuth: string[];
  testing: string[];
  tools: string[];
  architecture: string[];
  performance: string[];
}

export interface ExperienceEntry {
  company: string;
  position: string;
  duration: string;
  highlights: string[];
}

export interface ProjectEntry {
  title: string;
  category: string;
  technologies: string[];
  description: string;
  features: string[];
}

export interface EducationDetail {
  institution: string;
  degree?: string;
  specialization?: string;
  duration?: string;
  cgpa?: string;
  stream?: string;
}

export interface Education {
  degree: EducationDetail;
  preUniversity: EducationDetail;
}

export interface RecruiterAnswers {
  introduceYourself: string;
  coreExpertise: string;
  yearsOfExperience: string;
  fullStackExperience: string;
  strongestSkill: string;
  whyHireMe: string;
  currentFocus: string;
  preferredRole: string;
  availability: string;
}

export interface BehavioralTraits {
  teamwork: string;
  leadership: string;
  problemSolving: string;
  ownership: string;
  learningMindset: string;
}

export interface Restrictions {
  doNotAnswer: string[];
  fallbackResponse: string;
}

export interface KnowledgeBaseSchema {
  version: string;
  lastUpdated: string;
  assistantName: string;
  systemPrompt: string;
  identity: Identity;
  professionalSummary: ProfessionalSummary;
  skills: Skills;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  achievements: string[];
  education: Education;
  recruiterAnswers: RecruiterAnswers;
  behavioralTraits: BehavioralTraits;
  portfolioCapabilities: string[];
  restrictions: Restrictions;
}

const kb = knowledgeBase as KnowledgeBaseSchema;

export const KnowledgeService = {
  getKnowledgeBase(): KnowledgeBaseSchema {
    return kb;
  },
  getIdentity(): Identity {
    return kb.identity;
  },
  getProfessionalSummary(): ProfessionalSummary {
    return kb.professionalSummary;
  },
  getSkills(): Skills {
    return kb.skills;
  },
  getExperience(): ExperienceEntry[] {
    return kb.experience;
  },
  getProjects(): ProjectEntry[] {
    return kb.projects;
  },
  getAchievements(): string[] {
    return kb.achievements;
  },
  getEducation(): Education {
    return kb.education;
  },
  getRecruiterAnswers(): RecruiterAnswers {
    return kb.recruiterAnswers;
  },
  getBehavioralTraits(): BehavioralTraits {
    return kb.behavioralTraits;
  },
  getRestrictions(): Restrictions {
    return kb.restrictions;
  },
  getSystemPrompt(): string {
    return kb.systemPrompt;
  }
};
