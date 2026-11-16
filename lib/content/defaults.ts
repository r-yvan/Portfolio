import type { Content } from "./schema";

/**
 * Factory defaults. The live content lives in storage (content/portfolio.json
 * locally, Vercel Blob in production) and is edited from /admin — this file
 * is only the fallback used when storage is empty or a section is invalid.
 *
 * Project links were verified when this was written: demo URLs that returned
 * 404 / DEPLOYMENT_NOT_FOUND (Chatten, DoBuddy, DoneWithIt, Cartly) are left
 * out so every button on the site goes somewhere real.
 */
export const defaultContent: Content = {
  version: 1,
  updatedAt: "2026-11-16T00:00:00.000Z",

  profile: {
    firstName: "Yvan",
    lastName: "Rubuto",
    fullName: "Yvan Kiliye Rubuto",
    displayName: "Rubuto Yvan",
    initials: "RY",
    title: "Software Engineer & Designer",
    roles: [
      "Software engineer",
      "Full-stack developer",
      "UI/UX designer",
      "Builder of beautiful things",
    ],
    headline: "I build *digital experiences* for _ambitious ideas._",
    tagline:
      "I build digital experiences at the intersection of engineering precision and visual obsession.",
    bio: [
      "I'm a software engineer and designer based in Kigali, Rwanda, obsessed with the space where rigorous engineering meets cinematic design.",
      "I build fast, expressive interfaces — from full-stack web apps to motion-rich product experiences — treating every pixel, transition, and millisecond as intentional.",
    ],
    location: "Kigali, Rwanda",
    area: "Gikondo, Kicukiro",
    timezone: "Africa/Kigali",
    coordinates: { lat: -1.9697, lng: 30.0768 }, // Gikondo, Kicukiro District
    email: "yvankiliye.rubuto@gmail.com",
    phone: "+250795617693",
    available: true,
    availability: "Available for work",
    githubUser: "r-yvan",
    resumeUrl: "",
  },

  socials: [
    {
      id: "github",
      label: "GitHub",
      handle: "@r-yvan",
      url: "https://github.com/r-yvan",
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@rubuto.yvan",
      url: "https://instagram.com/rubuto.yvan",
    },
    {
      id: "email",
      label: "Email",
      handle: "yvankiliye.rubuto@gmail.com",
      url: "mailto:yvankiliye.rubuto@gmail.com",
    },
  ],

  stats: [
    { label: "Years building", value: 3, suffix: "+" },
    { label: "Projects shipped", value: 20, suffix: "+" },
    { label: "Technologies", value: 15, suffix: "+" },
    { label: "Cups of coffee", value: 999, suffix: "+" },
  ],

  principles: [
    {
      label: "Fig 0.1 — Foundation",
      title: "Engineered to last.",
      body: "Clean, typed foundations and tested architecture — so the work keeps scaling long after launch day.",
    },
    {
      label: "Fig 0.2 — Intent",
      title: "Designed with intent.",
      body: "Structure, hierarchy and motion composed as one deliberate system — never decoration for its own sake.",
    },
    {
      label: "Fig 0.3 — Momentum",
      title: "Built for speed.",
      body: "Performance is a feature: fast loads, fluid interaction and real momentum on every device.",
    },
  ],

  skillGroups: [
    {
      id: "frontend",
      name: "Frontend",
      blurb:
        "Pixel-precise, motion-rich interfaces built on modern React and the web platform.",
      skills: [
        { name: "React", slug: "react" },
        { name: "Next.js", slug: "nextdotjs" },
        { name: "TypeScript", slug: "typescript" },
        { name: "JavaScript", slug: "javascript" },
        { name: "Tailwind CSS", slug: "tailwindcss" },
        { name: "Vue.js", slug: "vuedotjs" },
        { name: "Angular", slug: "angular" },
        { name: "Three.js", slug: "threedotjs" },
      ],
    },
    {
      id: "backend",
      name: "Backend",
      blurb:
        "APIs, data models and server logic engineered to stay fast under real-world load.",
      skills: [
        { name: "Node.js", slug: "nodedotjs" },
        { name: "Express", slug: "express" },
        { name: "Spring Boot", slug: "springboot" },
        { name: "Django", slug: "django" },
        { name: "Laravel", slug: "laravel" },
        { name: "Python", slug: "python" },
        { name: "MongoDB", slug: "mongodb" },
        { name: "PostgreSQL", slug: "postgresql" },
      ],
    },
    {
      id: "design",
      name: "Design",
      blurb:
        "Turning rough ideas into clean, intentional visual systems and prototypes.",
      skills: [
        { name: "Figma", slug: "figma" },
        { name: "Framer", slug: "framer" },
        { name: "Photoshop", slug: "" },
        { name: "Illustrator", slug: "" },
        { name: "Canva", slug: "" },
      ],
    },
    {
      id: "tools",
      name: "Tools",
      blurb:
        "The workflow that ships reliably — version control, deploys and delivery.",
      skills: [
        { name: "Git", slug: "git" },
        { name: "GitHub", slug: "github" },
        { name: "Vercel", slug: "vercel" },
      ],
    },
  ],

  projects: [
    {
      id: "picdeck",
      title: "PicDeck",
      summary:
        "A modern image gallery built with React — browse the latest images by category in a clean, card-based layout.",
      category: "Web",
      tags: ["React", "Vite", "JavaScript"],
      year: "2024",
      role: "Design & development",
      image: "/uploads/picdeck.webp",
      imageAlt: "PicDeck home page with the image gallery hero and latest images",
      liveUrl: "https://pic-deck.vercel.app",
      repoUrl: "https://github.com/r-yvan/PicDeck",
      featured: true,
      visible: true,
    },
    {
      id: "dripdrop",
      title: "DripDrop",
      summary:
        "Full-stack e-commerce platform for buyers and sellers, built with Spring Boot, Spring 6 and a React storefront.",
      category: "Web",
      tags: ["Spring Boot", "Java", "React"],
      year: "2024",
      role: "Full-stack development",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/DripDrop",
      featured: true,
      visible: true,
    },
    {
      id: "taskplannet",
      title: "TaskPlannet",
      summary:
        "A focused task manager built with React to plan your day and keep productivity up from morning to night.",
      category: "Web",
      tags: ["React", "JavaScript"],
      year: "2024",
      role: "Design & development",
      image: "",
      imageAlt: "",
      liveUrl: "https://plan-hub.vercel.app",
      repoUrl: "https://github.com/r-yvan/TaskPlannet",
      featured: false,
      visible: true,
    },
    {
      id: "cartly",
      title: "Cartly",
      summary:
        "E-commerce app for buying and selling products online, built with Next.js and TypeScript.",
      category: "Web",
      tags: ["Next.js", "TypeScript"],
      year: "2025",
      role: "Full-stack development",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/Cartly",
      featured: false,
      visible: true,
    },
    {
      id: "healify",
      title: "Healify",
      summary:
        "Modern web app for booking medical appointments, with a Spring Boot API and a React Router frontend.",
      category: "Web",
      tags: ["Spring Boot", "React Router", "TypeScript"],
      year: "2025",
      role: "Full-stack development",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/Healify",
      featured: false,
      visible: true,
    },
    {
      id: "orbion",
      title: "Orbion",
      summary:
        "School management system that connects discipline staff, teachers and students in one place, built on the Spring framework.",
      category: "Web",
      tags: ["Spring", "Next.js", "TypeScript"],
      year: "2025",
      role: "Full-stack development",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/Orbion",
      featured: false,
      visible: true,
    },
    {
      id: "mochago",
      title: "MochaGo",
      summary:
        "Coffee-shop ordering app built with React Native, so people can order coffee remotely wherever they are.",
      category: "Mobile",
      tags: ["React Native", "Expo Router", "TypeScript"],
      year: "2025",
      role: "Mobile development",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/MochaGo",
      featured: false,
      visible: true,
    },
    {
      id: "dobuddy",
      title: "DoBuddy",
      summary:
        "A simple React Native to-do app designed to boost productivity and motivation.",
      category: "Mobile",
      tags: ["React Native", "Expo", "TypeScript"],
      year: "2024",
      role: "Mobile development",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/DoBuddy",
      featured: false,
      visible: true,
    },
    {
      id: "chatten",
      title: "Chatten",
      summary:
        "A simple chat app built with Node.js and Bun to make conversations between people effortless.",
      category: "Web",
      tags: ["Node.js", "Bun", "TypeScript"],
      year: "2024",
      role: "Backend development",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/Chatten",
      featured: false,
      visible: true,
    },
    {
      id: "facelocking",
      title: "FaceLocking",
      summary:
        "Real-time face recognition and tracking with OpenCV, MediaPipe landmarks and ArcFace embeddings — with face locking, blink and smile detection.",
      category: "AI & Vision",
      tags: ["Python", "OpenCV", "MediaPipe", "ONNX"],
      year: "2026",
      role: "Computer vision",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/FaceLocking",
      featured: false,
      visible: true,
    },
    {
      id: "servofacelock",
      title: "ServoFaceLock",
      summary:
        "Distributed vision-control system: face tracking publishes MQTT commands that steer a servo motor, mirrored live on a WebSocket dashboard.",
      category: "AI & Vision",
      tags: ["Python", "MQTT", "WebSocket", "OpenCV"],
      year: "2026",
      role: "Vision & IoT",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/ServoFaceLock",
      featured: false,
      visible: true,
    },
    {
      id: "smartplatedetector",
      title: "SmartPlateDetector",
      summary:
        "Number-plate extraction pipeline — detection, perspective alignment, Tesseract OCR, Rwandan-format validation and multi-frame filtering.",
      category: "AI & Vision",
      tags: ["Python", "OpenCV", "Tesseract"],
      year: "2026",
      role: "Computer vision",
      image: "",
      imageAlt: "",
      liveUrl: "",
      repoUrl: "https://github.com/r-yvan/SmartPlateDetector",
      featured: false,
      visible: true,
    },
    {
      id: "portfolio",
      title: "Portfolio",
      summary:
        "This site — a Next.js and Three.js portfolio with a custom motion system, light and dark themes, and a private admin CMS.",
      category: "Web",
      tags: ["Next.js", "Three.js", "TypeScript"],
      year: "2026",
      role: "Design & development",
      image: "/uploads/portfolio.webp",
      imageAlt: "The portfolio hero with a grey 3D wave field behind a centred headline",
      liveUrl: "https://r-yvan.vercel.app",
      repoUrl: "https://github.com/r-yvan/Portfolio",
      featured: false,
      visible: true,
    },
  ],

  milestones: [
    {
      id: "first-line",
      year: "2020",
      title: "The first line of code",
      subtitle: "Self-taught — Kigali",
      description:
        "Wrote my first HTML, CSS and JavaScript out of pure curiosity. The moment a static page came alive in the browser, I was hooked.",
      tags: ["HTML", "CSS", "JavaScript"],
      current: false,
    },
    {
      id: "frontend",
      year: "2021",
      title: "Falling for the frontend",
      subtitle: "Self-directed study",
      description:
        "Went deep on React and modern frontend architecture — components, state, and the craft of turning designs into fast, responsive interfaces.",
      tags: ["React", "Tailwind", "Git"],
      current: false,
    },
    {
      id: "full-stack",
      year: "2022",
      title: "Going full-stack",
      subtitle: "Freelance & personal projects",
      description:
        "Added Node.js, Express and databases to the toolkit, shipping end-to-end apps for real clients and learning to own a product from idea to deploy.",
      tags: ["Node.js", "MongoDB", "REST"],
      current: false,
    },
    {
      id: "design-engineering",
      year: "2023",
      title: "Design meets engineering",
      subtitle: "UI/UX & motion focus",
      description:
        "Obsessed over interface design, design systems and motion — bridging the gap between what looks beautiful and what performs flawlessly.",
      tags: ["Figma", "Design Systems", "Framer Motion"],
      current: false,
    },
    {
      id: "production",
      year: "2024",
      title: "Production at scale",
      subtitle: "Full-stack engineer",
      description:
        "Built and maintained production applications, refining performance, accessibility and DX while exploring 3D and WebGL on the side.",
      tags: ["Next.js", "TypeScript", "Three.js"],
      current: false,
    },
    {
      id: "now",
      year: "Now",
      title: "Crafting award-worthy web",
      subtitle: "Kigali, Rwanda — open to work",
      description:
        "Building cinematic, engineering-grade web experiences — and always chasing the next thing to learn.",
      tags: ["WebGL", "Motion", "Product"],
      current: true,
    },
  ],

  // NOTE: placeholder testimonials carried over from the previous version.
  // Replace them with real quotes (or hide the section) from /admin.
  testimonials: [
    {
      id: "aline",
      quote:
        "Yvan turned a vague idea into a polished product faster than I thought possible. The attention to motion and detail made our app feel genuinely premium.",
      name: "Aline U.",
      role: "Founder",
      company: "Startup, Kigali",
    },
    {
      id: "david",
      quote:
        "Rare to find an engineer who designs this well. Clean code, pixel-perfect UI, and he actually cares about performance. A joy to work with.",
      name: "David M.",
      role: "Product Lead",
      company: "Remote",
    },
    {
      id: "sarah",
      quote:
        "The interface he built for us is still the thing clients compliment most. Thoughtful, fast, and beautifully animated.",
      name: "Sarah K.",
      role: "Marketing Director",
      company: "Agency",
    },
    {
      id: "jean",
      quote:
        "He communicates clearly, ships on time, and brings ideas to the table you didn't know you needed. Highly recommend.",
      name: "Jean P.",
      role: "Collaborator",
      company: "Freelance Network",
    },
  ],

  settings: {
    showJourney: true,
    showTestimonials: true,
  },
};
