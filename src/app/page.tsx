import { getContent, getProjects, getGallery, getSkills, getFunFacts } from "@/lib/supabase";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Gallery from "@/components/Gallery";
import FunFacts from "@/components/FunFacts";
import About from "@/components/About";
import WhatIDo from "@/components/WhatIDo";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Revalidate every 60 seconds so edits appear quickly without a redeploy
export const revalidate = 60;

export default async function Home() {
  const [content, projects, gallery, skills, funFacts] = await Promise.all([
    getContent(),
    getProjects(),
    getGallery(),
    getSkills(),
    getFunFacts(),
  ]);

  return (
    <main>
      <Nav content={content} />
      <Hero content={content} />
      <Projects projects={projects} />
      <Gallery items={gallery} />
      <FunFacts facts={funFacts} />
      <About content={content} />
      <WhatIDo />
      <Skills skills={skills} />
      <Contact content={content} />
      <Footer content={content} />
    </main>
  );
}
