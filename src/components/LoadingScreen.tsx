'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onDone: () => void;
}

// Masmoudi "M" monogram that draws itself in as the page loads.
function MonogramLoader({ progress }: { progress: number }) {
  const p = Math.min(Math.max(progress / 100, 0), 1);
  return (
    <svg viewBox="0 0 160 160" className="w-36 h-36" fill="none">
      {/* track ring */}
      <circle cx="80" cy="80" r="70" stroke="#6C5CE7" strokeOpacity="0.12" strokeWidth="4" />
      {/* progress ring (draws clockwise from top) */}
      <motion.circle
        cx="80" cy="80" r="70"
        stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round"
        transform="rotate(-90 80 80)"
        style={{ pathLength: p }}
      />
      {/* soft gold inner halo */}
      <circle cx="80" cy="80" r="54" fill="#6C5CE7" fillOpacity="0.05" />

      {/* double-loop M — draws proportional to progress */}
      <motion.path
        d="M52 114 L52 60 C52 49 65 46 71 57 L80 76 L89 57 C95 46 108 49 108 60 L108 114"
        stroke="#6C5CE7" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
        animate={{ pathLength: p }}
        transition={{ ease: 'linear', duration: 0.08 }}
      />
      <motion.path
        d="M80 76 L80 110"
        stroke="#6C5CE7" strokeWidth="7" strokeLinecap="round"
        animate={{ pathLength: p }}
        transition={{ ease: 'linear', duration: 0.08 }}
      />
    </svg>
  );
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [fill,  setFill]  = useState(0);
  const [exit,  setExit]  = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const DURATION = 2400; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const raw      = (now - start) / DURATION;
      const progress = Math.min(raw, 1);
      // Ease in-out cubic
      const eased = progress < 0.5
        ? 4 * progress ** 3
        : 1 - (-2 * progress + 2) ** 3 / 2;

      setFill(eased * 100);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExit(true);
          setTimeout(onDone, 800);
        }, 350);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="loader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-cream"
        >
          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <p className="font-playfair text-4xl font-bold text-warm tracking-tight">
              <span className="text-coral">M</span>asmoudi
            </p>
            <p className="text-warm/35 text-xs tracking-[0.3em] uppercase mt-1">Sfax · Tunisie</p>
          </motion.div>

          {/* Monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MonogramLoader progress={fill} />
          </motion.div>

          {/* Percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-36 h-px bg-warm/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-coral rounded-full origin-left"
                animate={{ width: `${fill}%` }}
                transition={{ ease: 'linear', duration: 0.05 }}
              />
            </div>
            <span className="text-warm/30 text-xs tabular-nums">
              {Math.round(fill)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
