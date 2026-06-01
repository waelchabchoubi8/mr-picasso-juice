'use client';

import { useEffect, useRef, useState } from 'react';

const PALETTES = [
  // coral phase
  ['#FF5A1F', '#FF8C60', '#FFB085'],
  // yellow phase
  ['#FFD34E', '#FFCA28', '#FFB800'],
  // teal phase
  ['#3ECFB0', '#26C6DA', '#7ED95A'],
  // pink phase
  ['#FF85A1', '#F472B6', '#FFB085'],
  // lime phase
  ['#7ED95A', '#A3E635', '#3ECFB0'],
];

const BLOBS = [
  { size: 520, top: '-8%',  left: '55%',  animDur: '14s', animDelay: '0s'   },
  { size: 380, top: '50%',  left: '70%',  animDur: '18s', animDelay: '-5s'  },
  { size: 300, top: '15%',  left: '10%',  animDur: '16s', animDelay: '-9s'  },
  { size: 260, top: '70%',  left: '20%',  animDur: '20s', animDelay: '-3s'  },
  { size: 180, top: '40%',  left: '45%',  animDur: '12s', animDelay: '-7s'  },
];

interface MorphicBackgroundProps {
  colorCycleMs?: number;
  className?: string;
}

export function MorphicBackground({
  colorCycleMs = 15_000,
  className    = 'absolute inset-0 -z-20 bg-cream',
}: MorphicBackgroundProps) {
  const [palette, setPalette] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setPalette(p => (p + 1) % PALETTES.length);
    }, colorCycleMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [colorCycleMs]);

  const colors = PALETTES[palette];

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-50 transition-[background-color] duration-[4000ms] ease-in-out"
          style={{
            width:  b.size,
            height: b.size,
            top:    b.top,
            left:   b.left,
            background:     colors[i % colors.length],
            filter:         'blur(70px)',
            animation:      `morphBlob ${b.animDur} ease-in-out infinite`,
            animationDelay: b.animDelay,
            willChange:     'transform, border-radius',
          }}
        />
      ))}
      <div className={className} />
    </div>
  );
}
