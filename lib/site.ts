/**
 * Single source of truth for Yvan Rubuto's personal data.
 * Sections read from here so content stays consistent and is easy to wire
 * to the admin CMS in phase 2.
 */

export const site = {
  firstName: "Yvan",
  lastName: "Rubuto",
  fullName: "Yvan Kiliye Rubuto",
  displayName: "Rubuto Yvan",
  location: "Kigali, Rwanda",
  coordinates: { lat: -1.9441, lng: 30.0619 }, // Kigali
  email: "yvankiliye.rubuto@gmail.com",
  phone: "+250795617693",
  githubUser: "r-yvan",

  /** Rotating role titles for the hero morph animation. */
  roles: [
    "Software Engineer",
    "Full-Stack Developer",
    "UI/UX Designer",
    "Builder of Beautiful Things",
  ],

  tagline:
    "I build digital experiences at the intersection of engineering precision and visual obsession.",

  /** First-person manifesto used in the About section. */
  bio: [
    "I'm a software engineer and designer based in Kigali, Rwanda, obsessed with the space where rigorous engineering meets cinematic design.",
    "I build fast, expressive interfaces — from full-stack web apps to motion-rich product experiences — treating every pixel, transition, and millisecond as intentional.",
  ],

  stats: [
    { label: "Years building", value: 3, suffix: "+" },
    { label: "Projects shipped", value: 20, suffix: "+" },
    { label: "Technologies", value: 15, suffix: "+" },
    { label: "Cups of coffee", value: 999, suffix: "+" },
  ],

  socials: {
    github: { label: "GitHub", handle: "@r-yvan", url: "https://github.com/r-yvan" },
    instagram: {
      label: "Instagram",
      handle: "@rubuto.yvan",
      url: "https://instagram.com/rubuto.yvan",
    },
    email: {
      label: "Email",
      handle: "yvankiliye.rubuto@gmail.com",
      url: "mailto:yvankiliye.rubuto@gmail.com",
    },
  },
} as const;

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Path", href: "#education" },
  { label: "Contact", href: "#contact" },
];
