"use client";
import { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, Mail, Code, User, Moon, Sun } from 'lucide-react';
import TextScramble from '@/components/ui/TextScramble';
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { Nav } from "@/components/nav";
import { CustomCursor } from "@/components/custom-cursor";
import { RippleEffect } from "@/components/ripple-effect";
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import { Skills } from "@/components/skills";
import { BackgroundShapes } from "@/components/background-shapes";
import { Hero } from "@/components/hero";
import { ScrollNav } from "@/components/scroll-nav";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

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
      title: "Modified Black-Litterman Investment Model",
      description: "Stock allocation model built using Python; Won Semifinalist in the Wharton Global High School Investment Competition (50/5000+ teams)",
      tags: ["Python", "MatPlotLib", "Jupyter Notebook", "SciPy", "pandas"],
      github: "https://github.com/ericzhou12/WGHSIC"
    },
    {
      title: "Neural Network for Water Quality",
      description: "Artificial neural network built with PyTorch which leveraged EPA datasets to predict water quality; Won NOAA Taking the Pulse of the Planet (1/789) and Stockholm Junior Water Prize (4/58)",
      tags: ["Python", "PyTorch", "MatPlotLib", "pandas", "Jupyter Notebook"],
      github: "https://github.com/ericzhou12/GreatLakesWaterQualityANN"
    }
  ];

  const skills = [
    "Solidity", "Python", "C++", "Foundry", "React.js", "PyTorch", "MatPlotLib", "Next.js", "HTML/CSS", "Java"
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
      <section id="about">
        <About />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="projects">
        <Projects projects={projects} />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}