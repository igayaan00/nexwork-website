"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const letterSpring = {
  type: "spring",
  stiffness: 420,
  damping: 22,
};

export default function IntroSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1850);
    return () => clearTimeout(timer);
  }, []);

  const leftLetters = ["N", "E"];
  const rightLetters = ["W", "O", "R", "K"];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nexwork-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -28 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B1120] px-4"
        >
          {/* Ambient Brand Glow */}
          <div className="pointer-events-none absolute h-72 w-[28rem] rounded-full bg-gradient-to-r from-[#00AEEF]/20 via-[#004C97]/20 to-[#F7941D]/20 blur-3xl" />

          {/* Letter-by-Letter Pop-Up NEXWORK® Brand Mark */}
          <div className="relative flex items-center justify-center select-none">
            <div className="flex items-center font-black tracking-tighter text-white text-5xl sm:text-7xl">
              {/* N, E */}
              {leftLetters.map((char, idx) => (
                <motion.span
                  key={char + idx}
                  initial={{ opacity: 0, y: 34, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...letterSpring, delay: 0.08 + idx * 0.09 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}

              {/* Complete Brand 'X' (White Right Chevron + Light Blue, Deep Blue & Orange Chevrons) */}
              <motion.span
                initial={{ opacity: 0, y: 34, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...letterSpring, delay: 0.26 }}
                className="mx-0.5 inline-flex items-center"
                aria-label="X"
              >
                <svg
                  viewBox="0 0 96 100"
                  className="h-[0.76em] w-auto overflow-visible"
                  fill="none"
                >
                  {/* White right-hand '<' arms of X */}
                  <polygon points="69,0 95,0 77,50 96,100 70,100 52,50" fill="#FFFFFF" />
                  {/* Three signature '>' chevrons */}
                  <polygon points="0,0 18,0 38,50 18,100 0,100 20,50" fill="#00AEEF" />
                  <polygon points="18,0 41,0 61,50 41,100 18,100 38,50" fill="#004C97" />
                  <polygon points="41,0 59,0 79,50 59,100 41,100 61,50" fill="#F7941D" />
                </svg>
              </motion.span>

              {/* W, O, R, K */}
              {rightLetters.map((char, idx) => (
                <motion.span
                  key={char + idx}
                  initial={{ opacity: 0, y: 34, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...letterSpring, delay: 0.35 + idx * 0.09 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}

              {/* Registered ® Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...letterSpring, delay: 0.74 }}
                className="ml-1.5 mb-1.5 flex h-5 w-5 items-center justify-center self-end rounded-full border-2 border-[#F7941D] text-[10px] font-bold text-[#F7941D] sm:h-6 sm:w-6 sm:text-xs"
              >
                R
              </motion.span>
            </div>
          </div>

          {/* Smooth Gradient Progress Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 h-[3px] w-48 origin-left rounded-full bg-gradient-to-r from-[#00AEEF] via-[#004C97] to-[#F7941D]"
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.65 }}
            className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400"
          >
            Media • AI • Digital
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}