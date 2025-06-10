"use client";

import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiPhone, FiGithub, FiLinkedin } from "react-icons/fi";

export function Contact() {
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
            GET IN TOUCH
          </h2>
          <h3 className="text-4xl md:text-5xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            Contact Me
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h4 className="text-xl font-playfair font-semibold">Let&apos;s Connect</h4>
              <p className="text-muted-foreground">
                I&apos;m always open to discussing new projects, creative ideas, or
                opportunities to be part of your vision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <FiMail className="text-primary" size={20} />
                  <a
                    href="mailto:erichyzhou@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    erichyzhou@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <FiPhone className="text-primary" size={20} />
                  <a
                    href="tel:+12482500040"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (248) 250-0040
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <FiMapPin className="text-primary" size={20} />
                  <span className="text-muted-foreground">
                    Troy, MI, USA
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <FiGithub className="text-primary" size={20} />
                  <a
                    href="https://github.com/ericzhou12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    github.com/ericzhou12
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <FiLinkedin className="text-primary" size={20} />
                  <a
                    href="https://linkedin.com/in/ericzhou12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    linkedin.com/in/erichyzhou
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 