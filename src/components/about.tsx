"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "2021",
    title: "Started programming",
    description: ":D",
  },
  {
    year: "2023, 5 -> 2023, 9",
    title: "SWE/QA Intern @ BoardX",
    description: "Fixed bugs and implemented features in the frontend of the application, tested in iOS, MacOS, Linux, and Windows",
  },
  {
    year: "2024, 5 -> ?",
    title: "Blockchain Research @ WSU",
    description: "Working on a blockchain and AI integrated application for health education, with Prof. Lu",
  },
  {
    year: "2025, 6 -> 2025, 8",
    title: "Simons Summer Research Program",
    description: "Researching Byzantine Fault Tolerance Systems and consensus algorithms, with Prof. Amiri",
  },
];

export function About() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-lg md:text-xl text-muted-foreground font-light tracking-wider mb-4">
            ABOUT ME
          </h2>
          <h3 className="text-4xl md:text-5xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            Timeline
          </h3>
        </motion.div>

        <div className="relative w-full">
          {/* Timeline line */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-primary/20" />

          <div className="relative flex justify-between items-center px-8 md:px-16 lg:px-32">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center"
              >
                {/* Timeline dot */}
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/100 z-10" />
                
                <div className="text-center max-w-[200px] mt-24">
                  <div className="max-h-[60px]">
                    <h4 className="text-base font-playfair font-medium mb-1 text-muted-foreground">
                      {item.year}
                    </h4>
                    <h5 className="text-sm font-medium mb-1 text-muted-foreground/80">
                      {item.title}
                    </h5>
                    <p className="text-xs text-muted-foreground/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 