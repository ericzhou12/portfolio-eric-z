"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 rounded-full border border-primary/30 bg-primary/20 backdrop-blur-sm pointer-events-none z-50"
      animate={{
        x: mousePosition.x - 3,
        y: mousePosition.y - 3,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 10,
        mass: 0.1,
      }}
    />
  );
} 