"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Shape {
  id: number;
  style: {
    width: number;
    height: number;
    left: string;
    top: string;
  };
  animate: {
    x: number[];
    y: number[];
    scale: number[];
    opacity: number[];
  };
  transition: {
    duration: number;
    repeat: number;
    ease: string;
    times: number[];
  };
}

export function BackgroundShapes() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const generateShapes = () => {
      return [...Array(8)].map((_, i) => ({
        id: i,
        style: {
          width: Math.random() * 400 + 200,
          height: Math.random() * 400 + 200,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        },
        animate: {
          x: [
            0,
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            0,
          ],
          y: [
            0,
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            0,
          ],
          scale: [1, 1.05, 1.1, 1.05, 1],
          opacity: [0.3, 0.4, 0.5, 0.4, 0.3],
        },
        transition: {
          duration: 20 + Math.random() * 10,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        },
      }));
    };
    setShapes(generateShapes());
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-primary/5"
          style={shape.style}
          animate={shape.animate}
          transition={shape.transition}
        />
      ))}
    </div>
  );
} 