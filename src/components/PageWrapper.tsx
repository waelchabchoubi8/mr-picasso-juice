'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen } from './LoadingScreen';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  // Always show loader on every visit — no sessionStorage check
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>
      {children}
    </>
  );
}
