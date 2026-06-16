export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  techStack: string[];
  metrics: { label: string; value: string };
  links: { github?: string; live?: string };
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
  skills: string[];
}

export interface Achievement {
  title: string;
  value: string;
  description: string;
  icon: string;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level: number; icon?: string }[];
}

export const portfolioData = {
  personalInfo: {
    name: "Sandeep N Kundekar",
    title: "Frontend Engineer",
    experienceYears: "3+ Years",
    tagline: "Building scalable, high-performance web applications using React, Next.js, and TypeScript.",
    bio: "I specialize in React.js, Next.js, TypeScript, frontend performance optimization, scalable UI architecture, state management, API integrations, and developer experience. My focus is on building maintainable, production-grade applications that are performant, scalable, and user-friendly.",
    email: "sandeepkundekar1000@gmail.com",
    github: "https://github.com/sandeepkundekar11",
    linkedin: "https://www.linkedin.com/in/sandeep-kundekar-044a711b2/",
    location: "Belgaum / Bengaluru, Karnataka, India",
    resumeUrl: "/Sandeep_Resume_June_2026.pdf"
  },
  skills: [
    {
      category: "Frontend Stack",
      skills: [
        { name: "React.js", level: 95 },
        { name: "Next.js", level: 92 },
        { name: "JavaScript", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "HTML5 / CSS3", level: 95 },
        { name: "Tailwind CSS", level: 92 },
        { name: "Material UI", level: 88 }
      ]
    },
    {
      category: "State Management",
      skills: [
        { name: "Redux Toolkit", level: 90 },
        { name: "Redux", level: 88 },
        { name: "React Query", level: 92 },
        { name: "Context API", level: 95 },
        { name: "Zustand", level: 85 }
      ]
    },
    {
      category: "Backend & APIs",
      skills: [
        { name: "Node.js", level: 80 },
        { name: "Express.js", level: 80 },
        { name: "MongoDB", level: 78 },
        { name: "REST APIs", level: 90 },
        { name: "GraphQL", level: 82 }
      ]
    },
    {
      category: "Testing & Tools",
      skills: [
        { name: "Jest", level: 85 },
        { name: "React Testing Library", level: 85 },
        { name: "Playwright", level: 80 },
        { name: "Docker", level: 75 },
        { name: "Webpack / Vite", level: 88 },
        { name: "Storybook", level: 90 }
      ]
    },
    {
      category: "Architecture & Tuning",
      skills: [
        { name: "SSR / SSG / CSR", level: 92 },
        { name: "Micro Frontends", level: 85 },
        { name: "Code Splitting / Lazy Loading", level: 90 },
        { name: "Web Vitals Optimization", level: 95 }
      ]
    }
  ] as SkillCategory[],

  projects: [
    {
      id: "e-commerce-platform",
      title: "E-Commerce Platform",
      tagline: "Full-Stack Enterprise E-Commerce Engine",
      description: "Built a full-stack e-commerce application with authentication, payments, product management, cart workflows, and order processing.",
      features: [
        "JWT Authentication",
        "Stripe Payment Integration",
        "Redux State Management",
        "Lazy Loading",
        "Performance Optimization & Database Indexing"
      ],
      techStack: ["React.js", "Redux", "Node.js", "Express.js", "MongoDB", "Stripe", "JWT"],
      metrics: { label: "Performance Score", value: "98/100" },
      links: { github: "https://github.com/sandeepkundekar11" }
    },
    {
      id: "task-management",
      title: "Task Management System",
      tagline: "Collaborative Project Board with Drag & Drop",
      description: "Developed a Jira-style task management platform with drag-and-drop functionality and role-based access control.",
      features: [
        "Drag and Drop Tasks workflow rendering",
        "Role-Based Access Control integration",
        "Centralized Redux Store architectural pattern",
        "Workflow and sprint tracking boards"
      ],
      techStack: ["React.js", "Redux", "Node.js", "Express.js", "MongoDB"],
      metrics: { label: "State Sync Delay", value: "< 16ms" },
      links: { github: "https://github.com/sandeepkundekar11" }
    },
    {
      id: "quiz-blogging",
      title: "Quiz and Blogging Platform",
      tagline: "Gamified Quiz Creation and Blogging Engine",
      description: "Created a platform for blog publishing, quiz creation, and user management.",
      features: [
        "JWT secure user Authentication",
        "High speed REST APIs endpoints",
        "Dynamic Quiz Creation with interactive grading",
        "Responsive blog publishing and dashboard"
      ],
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
      metrics: { label: "API Sync Latency", value: "~25ms" },
      links: { github: "https://github.com/sandeepkundekar11" }
    }
  ] as Project[],

  experience: [
    {
      company: "TMITS - Technomind Solution Ltd",
      role: "React.js Developer",
      duration: "April 2025 - April 2026",
      location: "India (Hybrid)",
      description: [
        "Architected an SEO-optimised e-commerce platform with Next.js App Router (SSR, SSG), improving Lighthouse scores by 30% and organic search visibility by 40%.",
        "Engineered advanced caching (Redis, React Query) and code splitting, reducing TTFB by 25% and supporting 10,000+ concurrent users.",
        "Delivered an end-to-end logistics platform with real-time pickup/delivery workflows, serving 20,000+ daily transactions with 35% fewer redundant API calls.",
        "Designed and implemented dynamic RBAC security across 5+ user roles and integrated structured payment workflows with robust error handling/retry logic.",
        "Developed a scalable analytics dashboard with 60+ configurable reports, and built CI/CD automated Excel/JSON data transformation utilities cutting manual reporting effort by 60%."
      ],
      skills: ["Next.js", "React.js", "Redux Toolkit", "React Query", "Zustand", "TypeScript", "Webpack / Vite", "React Hook Form", "GitHub Actions"]
    },
    {
      company: "Priyaraja Electronics Ltd",
      role: "Frontend Developer",
      duration: "September 2023 - March 2025",
      location: "Pune, India",
      description: [
        "Designed and developed the company's official responsive website, showcasing product catalog specs and manufacturing capabilities.",
        "Optimized React application performance by 25%, implementing memoization, route-level code splitting, and Web Workers for heavy computations.",
        "Led JavaScript to TypeScript migration, reducing runtime defects by 30%.",
        "Created robust Playwright end-to-end testing suites to enhance regression prevention.",
        "Worked in Agile and Scrum environments with cross-functional teams."
      ],
      skills: ["React.js", "Next.js", "TypeScript", "Playwright", "Web Workers", "Agile/Scrum", "Redux Toolkit", "React Query"]
    },
    {
      company: "Zicops",
      role: "Frontend Developer Intern",
      duration: "December 2022 - April 2023",
      location: "India (Remote)",
      description: [
        "Contributed to a real-time video conferencing platform built with Next.js and WebRTC, supporting 500+ concurrent users.",
        "Worked on micro-frontend architecture migration initiatives.",
        "Developed modular, responsive user interfaces."
      ],
      skills: ["Next.js", "WebRTC", "Micro Frontends", "Responsive UI", "Context API", "Redux Toolkit"]
    }
  ] as Experience[],

  achievements: [
    {
      title: "Lighthouse Improvement",
      value: "30%",
      description: "Optimized Core Web Vitals to improve Lighthouse performance ratings on core platforms.",
      icon: "zap"
    },
    {
      title: "API Optimization",
      value: "35%",
      description: "Reduced redundant server requests through optimized caching and state management patterns.",
      icon: "server"
    },
    {
      title: "Test Coverage",
      value: "85%+",
      description: "Constructed comprehensive frontend testing configurations leveraging Jest and Playwright.",
      icon: "shield"
    },
    {
      title: "TypeScript Migration",
      value: "30%",
      description: "Reduced runtime error frequencies by converting legacy assets to strictly typed modules.",
      icon: "code-xml"
    },
    {
      title: "Storybook Library",
      value: "45%",
      description: "Standardized UI interfaces and reduced visual defects by creating modular components.",
      icon: "book-open"
    }
  ] as Achievement[],

  architecture: {
    layers: [
      {
        name: "UI / View Layer",
        tech: "React 19, Tailwind CSS v4, Lucide React",
        desc: "Strictly atomic, accessible, and visual-rich elements. Renders the layout and captures user events."
      },
      {
        name: "Animation & 3D Layer",
        tech: "Three.js, React Three Fiber, GSAP, Framer Motion, Lenis",
        desc: "Cinematic visual feedback, smooth scroll orchestration, and interactive 3D elements."
      },
      {
        name: "Custom Hooks (Logic)",
        tech: "React Custom Hooks (useLenis, useMouse, useInView)",
        desc: "Decouples component UI from browser behaviors, scroll dynamics, and event listeners."
      },
      {
        name: "State & Cache Layer",
        tech: "Redux Toolkit, React Query (TanStack), Zustand",
        desc: "Manages transient global UI states, caches network responses, and optimizes optimistic interactions."
      },
      {
        name: "API & Data Layer",
        tech: "Fetch, Axios, WebSockets (Socket.io)",
        desc: "Standardizes secure payload transfers, formats parameters, and handles data transmission."
      }
    ]
  },

  performance: {
    lighthouse: {
      performance: 98,
      accessibility: 100,
      bestPractices: 96,
      seo: 100
    },
    metrics: [
      { name: "Largest Contentful Paint (LCP)", before: "3.2s", after: "1.4s", goal: "< 2.5s" },
      { name: "Cumulative Layout Shift (CLS)", before: "0.24", after: "0.02", goal: "< 0.1" },
      { name: "Total Blocking Time (TBT)", before: "450ms", after: "80ms", goal: "< 200ms" },
      { name: "Bundle Size (Gzipped)", before: "680KB", after: "210KB", goal: "< 250KB" }
    ]
  }
};
