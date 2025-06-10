"use client";

import { motion } from "framer-motion";

const skills = [
  {
    category: "Blockchain Development",
    items: ["Solidity", "Forge/Foundry"],
    color: "from-blue-500/20 to-blue-600/20",
    textColor: "text-blue-500",
  },
  {
    category: "Web Development",
    items: ["Next.js", "React.js", "TypeScript", "HTML/CSS"],
    color: "from-purple-500/20 to-purple-600/20",
    textColor: "text-purple-500",
  },
  {
    category: "Programming Languages",
    items: ["Python", "C++", "Java"],
    color: "from-green-500/20 to-green-600/20",
    textColor: "text-green-500",
  },
  {
    category: "Machine Learning",
    items: ["PyTorch"],
    color: "from-orange-500/20 to-orange-600/20",
    textColor: "text-orange-500",
  },
];

export function Skills() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-lg md:text-xl text-muted-foreground font-light tracking-wider mb-4">
            TECHNICAL SKILLS
          </h2>
          <h3 className="text-4xl md:text-5xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            Skills & Technologies
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {skills.map((category) =>
            category.items.map((skill, index) => (
              <motion.div
                key={`${category.category}-${skill}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full bg-gradient-to-r ${category.color} ${category.textColor} font-medium text-sm backdrop-blur-sm`}
              >
                {skill}
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Continuously expanding my skill set and exploring new technologies to
            stay at the forefront of software development.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 