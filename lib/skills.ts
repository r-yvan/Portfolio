/**
 * Tech stack shown in the Skills section. `slug` maps to simpleicons.org so we
 * can render crisp monochrome SVGs with blueviolet hover colorization; a
 * graceful monogram fallback is used if an icon is unavailable.
 */
export type SkillCategory = "Frontend" | "Backend" | "Design" | "Tools";

export type Skill = {
  name: string;
  slug: string;
  category: SkillCategory;
  level: number; // 0–100
};

export const skillCategories: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Design",
  "Tools",
];

export const skills: Skill[] = [
  // Frontend
  { name: "React", slug: "react", category: "Frontend", level: 95 },
  { name: "Next.js", slug: "nextdotjs", category: "Frontend", level: 90 },
  { name: "TypeScript", slug: "typescript", category: "Frontend", level: 88 },
  { name: "JavaScript", slug: "javascript", category: "Frontend", level: 93 },
  { name: "Tailwind CSS", slug: "tailwindcss", category: "Frontend", level: 95 },
  { name: "Vue.js", slug: "vuedotjs", category: "Frontend", level: 80 },
  { name: "Angular", slug: "angular", category: "Frontend", level: 72 },
  { name: "Three.js", slug: "threedotjs", category: "Frontend", level: 70 },

  // Backend
  { name: "Node.js", slug: "nodedotjs", category: "Backend", level: 86 },
  { name: "Express", slug: "express", category: "Backend", level: 82 },
  { name: "Django", slug: "django", category: "Backend", level: 75 },
  { name: "Laravel", slug: "laravel", category: "Backend", level: 72 },
  { name: "MongoDB", slug: "mongodb", category: "Backend", level: 84 },
  { name: "PostgreSQL", slug: "postgresql", category: "Backend", level: 76 },

  // Design
  { name: "Figma", slug: "figma", category: "Design", level: 90 },
  { name: "Framer", slug: "framer", category: "Design", level: 82 },
  { name: "Photoshop", slug: "adobephotoshop", category: "Design", level: 80 },
  { name: "Illustrator", slug: "adobeillustrator", category: "Design", level: 78 },
  { name: "Canva", slug: "canva", category: "Design", level: 85 },

  // Tools
  { name: "Git", slug: "git", category: "Tools", level: 88 },
  { name: "GitHub", slug: "github", category: "Tools", level: 90 },
  { name: "Vercel", slug: "vercel", category: "Tools", level: 85 },
];
