"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function ScrollNav() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
      <div className="relative h-48">
        <div className="absolute left-1.25 top-0 h-full w-0.5 bg-primary/0 rounded-full">
          <motion.div
            className="absolute top-0 left-0 w-full bg-primary/100 rounded-full"
            style={{ height: `${progress}%` }}
          />
        </div>
        {sections.map((section, index) => {
          const sectionProgress = (index / (sections.length - 1)) * 100;
          const isReached = progress >= sectionProgress;
          
          return (
            <div 
              key={section.id} 
              className="absolute left-0 flex items-center gap-3" 
              style={{ 
                top: `${sectionProgress}%`,
                transform: 'translateY(-50%)'
              }}
            >
              <motion.button
                onClick={() => scrollToSection(section.id)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  isReached ? "bg-primary/100" : "bg-primary/20"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
              <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
                {section.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 