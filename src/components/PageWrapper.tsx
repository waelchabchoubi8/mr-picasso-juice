'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen } from './LoadingScreen';
import { RegionGate } from './RegionGate';
import { useCurrency } from './CurrencyContext';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  // Always show loader on every visit — no sessionStorage check
  const [loading, setLoading] = useState(true);
  const { chosen } = useCurrency();

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {/* After the loader, first-time visitors pick their region (TND vs EUR).
          Returning visitors have it restored from storage → gate is skipped. */}
      <AnimatePresence>
        {!loading && !chosen && <RegionGate />}
      </AnimatePresence>

      {children}
    </>
  );
}
