"use client";

import { motion } from "framer-motion";

const sparks = Array.from({ length: 28 }, (_, idx) => ({
  id: idx,
  left: `${(idx * 37) % 100}%`,
  delay: (idx % 7) * 0.22,
  duration: 1.6 + (idx % 4) * 0.35,
  drift: ((idx % 9) - 4) * 12
}));

export function ReleaseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {sparks.map((spark) => (
        <motion.span
          key={spark.id}
          className="absolute bottom-0 inline-block h-2 w-2 rounded-full bg-yellow-200 shadow-[0_0_12px_rgba(255,215,64,0.9)]"
          style={{ left: spark.left }}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], y: -420, x: spark.drift, scale: [0.5, 1.3, 0.8] }}
          transition={{
            duration: spark.duration,
            repeat: Infinity,
            delay: spark.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}
