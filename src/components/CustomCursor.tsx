'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  // Very tight spring — settles in ~3 frames, no perceptible lag
  const x = useSpring(mx, { stiffness: 900, damping: 60, mass: 0.1 });
  const y = useSpring(my, { stiffness: 900, damping: 60, mass: 0.1 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      setHovered(!!(e.target as Element).closest('a, button, [role="button"]'));
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, [visible, mx, my]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] bg-coral"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: hovered ? 20 : 9, height: hovered ? 20 : 9, opacity: hovered ? 0.5 : 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    />
  );
}
