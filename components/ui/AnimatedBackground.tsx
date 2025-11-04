"use client"
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

type BgSymbol = {
  x: number;
  y: number;
  left: number;
  width: number;
  top: number;
  height: number;
  duration: number;
  delay: number;
}

const AnimatedBackground = () => {
  const [symbols, setSymbols] = useState<BgSymbol[]>([]);
  useEffect(() => {
    const generatedSymbols = Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      height: Math.random() * 50 + 20,
      width: Math.random() * 50 + 20,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setSymbols(generatedSymbols);
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden z-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {symbols.map((symbol, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.2, 1],
              x: [0, symbol.x, 0],
              y: [0, symbol.y, 0],
            }}
            transition={{
              duration: symbol.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: symbol.delay,
            }}
            className="absolute rounded-full bg-primary/10"
            style={{
              left: `${symbol.left}%`,
              top: `${symbol.top}%`,
              width: `${symbol.width}px`,
              height: `${symbol.height}px`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedBackground;
