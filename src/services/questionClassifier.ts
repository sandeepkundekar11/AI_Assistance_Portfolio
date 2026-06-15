import { KnowledgeService } from "./knowledgeService";

export const REJECTION_RESPONSE = "I am AI Sandeep, a portfolio assistant designed to answer questions about Sandeep's professional profile, experience, projects, and skills.";

export const QuestionClassifier = {
  /**
   * Detects if the query is PROFILE_RELATED or UNRELATED
   */
  classifyQuestion(query: string): "PROFILE_RELATED" | "UNRELATED" {
    const normalized = query.toLowerCase().trim();
    const restrictions = KnowledgeService.getRestrictions();

    // 1. Prohibited lists (politics, medical, legal, etc.)
    for (const topic of restrictions.doNotAnswer) {
      if (normalized.includes(topic.toLowerCase())) {
        return "UNRELATED";
      }
    }

    // 2. Allowed domain-specific keywords for Sandeep's portfolio
    const allowedKeywords = [
      "sandeep", "resume", "cv", "portfolio", "assistant", "clone", "uplink", "contact",
      "email", "phone", "call", "hire", "github", "linkedin", "title", "role", "job",
      "work", "experience", "company", "career", "skills", "tech", "stack", "frontend",
      "backend", "full stack", "react", "next", "typescript", "javascript", "redux",
      "zustand", "query", "context", "testing", "jest", "playwright", "storybook",
      "docker", "webpack", "vite", "redis", "education", "college", "degree",
      "cgpa", "achievement", "project", "commerce", "task", "jira", "kanban", "quiz", "blog",
      "technomind", "tmits", "priyaraja", "zicops", "intern", "teamwork", "leadership",
      "problem solving", "ownership", "hello", "hi", "hey", "who are you"
    ];

    const isProfileRelated = allowedKeywords.some(keyword => normalized.includes(keyword));
    if (!isProfileRelated) {
      return "UNRELATED";
    }

    return "PROFILE_RELATED";
  },

  getRejectionResponse(): string {
    return REJECTION_RESPONSE;
  }
};
