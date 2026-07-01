import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Statistics } from "@/components/sections/Statistics";
import { Education } from "@/components/sections/Education";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { getProjects } from "@/lib/github";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Approach />
        <Skills />
        <Projects projects={projects} />
        <Statistics projectCount={projects.length} />
        <Education />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
