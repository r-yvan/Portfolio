import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Path } from "@/components/sections/Path";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { getContent } from "@/lib/content";
import { githubFallbackProjects } from "@/lib/github";
import type { NavItem } from "@/lib/site-config";

export default async function Home() {
  const content = await getContent();
  const { profile, settings } = content;

  const curated = content.projects.filter((p) => p.visible);
  const projects = curated.length ? curated : await githubFallbackProjects(profile.githubUser);

  const showJourney = settings.showJourney && content.milestones.length > 0;
  const showTestimonials = settings.showTestimonials && content.testimonials.length > 0;

  // Section numbers follow whatever is actually shown.
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  const idx = {
    about: next(),
    approach: next(),
    skills: next(),
    work: next(),
    path: showJourney ? next() : "",
    words: showTestimonials ? next() : "",
    contact: next(),
  };

  const nav: NavItem[] = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Work", href: "#work" },
    ...(showJourney ? [{ label: "Path", href: "#path" }] : []),
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <Navbar items={nav} initials={profile.initials} />
      <main>
        <Hero profile={profile} stats={content.stats} />
        <About index={idx.about} profile={profile} />
        <Approach index={idx.approach} principles={content.principles} />
        <Skills index={idx.skills} groups={content.skillGroups} />
        <Work index={idx.work} projects={projects} githubUser={profile.githubUser} />
        {showJourney && <Path index={idx.path} milestones={content.milestones} />}
        {showTestimonials && <Testimonials index={idx.words} items={content.testimonials} />}
        <Contact index={idx.contact} profile={profile} socials={content.socials} />
      </main>
      <Footer profile={profile} socials={content.socials} nav={nav} />
    </>
  );
}
