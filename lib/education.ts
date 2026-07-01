/**
 * The "Path" timeline — Yvan's journey as a story. Generic, self-directed
 * milestones by design; swap in specific institutions/dates via the CMS later.
 */
export type Milestone = {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  kind: "spark" | "education" | "work" | "now";
};

export const milestones: Milestone[] = [
  {
    year: "2020",
    title: "The first line of code",
    subtitle: "Self-taught — Kigali",
    description:
      "Wrote my first HTML, CSS and JavaScript out of pure curiosity. The moment a static page came alive in the browser, I was hooked.",
    tags: ["HTML", "CSS", "JavaScript"],
    kind: "spark",
  },
  {
    year: "2021",
    title: "Falling for the frontend",
    subtitle: "Self-directed study",
    description:
      "Went deep on React and modern frontend architecture — components, state, and the craft of turning designs into fast, responsive interfaces.",
    tags: ["React", "Tailwind", "Git"],
    kind: "education",
  },
  {
    year: "2022",
    title: "Going full-stack",
    subtitle: "Freelance & personal projects",
    description:
      "Added Node.js, Express and databases to the toolkit, shipping end-to-end apps for real clients and learning to own a product from idea to deploy.",
    tags: ["Node.js", "MongoDB", "REST"],
    kind: "work",
  },
  {
    year: "2023",
    title: "Design meets engineering",
    subtitle: "UI/UX & motion focus",
    description:
      "Obsessed over interface design, design systems and motion — bridging the gap between what looks beautiful and what performs flawlessly.",
    tags: ["Figma", "Design Systems", "Framer Motion"],
    kind: "education",
  },
  {
    year: "2024",
    title: "Production at scale",
    subtitle: "Full-stack engineer",
    description:
      "Built and maintained production applications, refining performance, accessibility and DX while exploring 3D and WebGL on the side.",
    tags: ["Next.js", "TypeScript", "Three.js"],
    kind: "work",
  },
  {
    year: "Now",
    title: "Crafting award-worthy web",
    subtitle: "Kigali, Rwanda — open to work",
    description:
      "Building cinematic, engineering-grade web experiences — and always chasing the next thing to learn.",
    tags: ["WebGL", "Motion", "Product"],
    kind: "now",
  },
];
