"use client";
import { useState, useEffect } from 'react';
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import { Skills } from "@/components/skills";
import { BackgroundShapes } from "@/components/background-shapes";
import { Hero } from "@/components/hero";
import { ScrollNav } from "@/components/scroll-nav";
import { CustomCursor } from "@/components/custom-cursor";
import { RippleEffect } from "@/components/ripple-effect";

export default function Home() {
  const [darkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Apply dark mode class to document body on mount and when changed
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const projects = [
    {
      title: "The New Page Project 📚",
      description: "A website made for the New Page Project, a non-profit that strives to promote equal-access education and improove literacy skills around the world.",
      tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
      link: "https://www.thenewpageproject.com"
    },
    {
      title: "Modified Black-Litterman Investment Model",
      description: "Stock allocation model built using Python; Won Semifinalist in the Wharton Global High School Investment Competition (50/5000+ teams)",
      tags: ["Python", "MatPlotLib", "Jupyter Notebook", "SciPy", "pandas"],
      github: "https://github.com/ericzhou12/WGHSIC"
    },
    {
      title: "AquaNet: An Artificial Neural Network for Water Quality ",
      description: "Artificial neural network built with PyTorch which leveraged EPA datasets to predict water quality; Won NOAA Taking the Pulse of the Planet (1/789) and Stockholm Junior Water Prize (4/58)",
      tags: ["Python", "PyTorch", "MatPlotLib", "pandas", "Jupyter Notebook"],
      github: "https://github.com/ericzhou12/GreatLakesWaterQualityANN"
    }
  ];

  return (
    <main className="relative">
      <CustomCursor />
      <RippleEffect />
      <BackgroundShapes />
      <ScrollNav />
      <section id="hero">
        <Hero />
      </section>
      <section id="projects">
        <Projects projects={projects} />
      </section>
      <section id="about">
        <About />
      </section>

      <section id="skills">
        <Skills />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}