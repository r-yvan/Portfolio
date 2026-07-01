/**
 * Testimonials shown in the "Kind Words" carousel. Placeholder content by
 * design — manage these through the admin CMS in phase 2.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Yvan turned a vague idea into a polished product faster than I thought possible. The attention to motion and detail made our app feel genuinely premium.",
    name: "Aline U.",
    role: "Founder",
    company: "Startup, Kigali",
  },
  {
    quote:
      "Rare to find an engineer who designs this well. Clean code, pixel-perfect UI, and he actually cares about performance. A joy to work with.",
    name: "David M.",
    role: "Product Lead",
    company: "Remote",
  },
  {
    quote:
      "The interface he built for us is still the thing clients compliment most. Thoughtful, fast, and beautifully animated.",
    name: "Sarah K.",
    role: "Marketing Director",
    company: "Agency",
  },
  {
    quote:
      "He communicates clearly, ships on time, and brings ideas to the table you didn't know you needed. Highly recommend.",
    name: "Jean P.",
    role: "Collaborator",
    company: "Freelance Network",
  },
];
