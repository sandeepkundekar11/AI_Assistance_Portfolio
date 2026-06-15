import { useEffect } from "react";
import { portfolioData } from "../data/portfolio";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SEO({
  title = `${portfolioData.personalInfo.name} | ${portfolioData.personalInfo.title}`,
  description = portfolioData.personalInfo.bio,
  keywords = "Sandeep Kundekar, Frontend Engineer, React Developer, Next.js Expert, TypeScript Developer, UI Performance Engineering, 3D Web Portfolio, React Three Fiber",
}: SEOProps) {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta Tags Helper
    const updateMetaTag = (attr: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    updateMetaTag("name", "description", description);
    updateMetaTag("name", "keywords", keywords);
    updateMetaTag("name", "author", portfolioData.personalInfo.name);

    // OpenGraph Tags
    updateMetaTag("property", "og:title", title);
    updateMetaTag("property", "og:description", description);
    updateMetaTag("property", "og:type", "website");
    updateMetaTag("property", "og:url", window.location.href);
    updateMetaTag("property", "og:site_name", `${portfolioData.personalInfo.name} Portfolio`);

    // Twitter Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", title);
    updateMetaTag("name", "twitter:description", description);

    // 3. JSON-LD Structured Data
    const schemaId = "structured-data-jsonld";
    let scriptElement = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = schemaId;
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": portfolioData.personalInfo.name,
      "jobTitle": portfolioData.personalInfo.title,
      "url": window.location.href,
      "sameAs": [
        portfolioData.personalInfo.github,
        portfolioData.personalInfo.linkedin
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Pune",
        "addressRegion": "Maharashtra",
        "addressCountry": "India"
      },
      "knowsAbout": [
        "React.js",
        "Next.js",
        "TypeScript",
        "Redux Toolkit",
        "React Query",
        "Performance Optimization",
        "Storybook",
        "Unit Testing",
        "3D Web Graphics",
        "Frontend Architecture"
      ]
    };

    scriptElement.textContent = JSON.stringify(structuredData);

    return () => {
      // Clean up script when component unmounts
      const script = document.getElementById(schemaId);
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords]);

  return null;
}
