'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// ─── Currency model ────────────────────────────────────────────────────────────
// All product prices in the codebase are stored in **Tunisian Dinar (TND)** as the
// base. The visitor picks a region on opening (RegionGate); foreigners see Euro.
// Conversion + formatting happen at *display* time only — the cart always keeps
// the TND base, so order logic (totals, national-delivery minimum) stays correct.

export const EUR_PER_TND = 0.30; // 1 TND ≈ 0,30 € (≈ 3,33 TND / €)

export type Region = 'tn' | 'intl';
export type CurrencyCode = 'TND' | 'EUR';

const STORAGE_KEY = 'soltana-region';

export function regionCurrency(region: Region | null): CurrencyCode {
  return region === 'intl' ? 'EUR' : 'TND';
}

export function convertAmount(tnd: number, code: CurrencyCode): number {
  return code === 'EUR' ? tnd * EUR_PER_TND : tnd;
}

/** Number only, locale-styled (comma decimal). TND keeps millimes (3 dp); EUR 2 dp. */
export function formatAmount(tnd: number, code: CurrencyCode): string {
  return code === 'EUR'
    ? convertAmount(tnd, code).toFixed(2).replace('.', ',')
    : tnd.toFixed(3).replace('.', ',');
}

export function currencySymbol(code: CurrencyCode): string {
  return code === 'EUR' ? '€' : 'TND';
}

/** Full price string, e.g. "9,500 TND" or "2,85 €". */
export function formatPrice(tnd: number, code: CurrencyCode): string {
  return `${formatAmount(tnd, code)} ${currencySymbol(code)}`;
}

type CurrencyContextType = {
  region: Region | null;
  chosen: boolean;
  code: CurrencyCode;
  symbol: string;
  setRegion: (r: Region) => void;
  /** number only (no symbol) */
  amount: (tnd: number) => string;
  /** number + symbol */
  price: (tnd: number) => string;
  /** numeric value in the active currency */
  convert: (tnd: number) => number;
};

const Ctx = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Start `null` on both server and first client paint (no localStorage on the
  // server) so hydration matches; restore the saved region in an effect. The
  // opening loader masks the brief default-state window, so prices never flicker.
  const [region, setRegionState] = useState<Region | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === 'tn' || raw === 'intl') setRegionState(raw);
    } catch {
      /* ignore storage failures */
    }
  }, []);

  const setRegion = (r: Region) => {
    setRegionState(r);
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {
      /* ignore */
    }
  };

  const code = regionCurrency(region);

  return (
    <Ctx.Provider
      value={{
        region,
        chosen: region !== null,
        code,
        symbol: currencySymbol(code),
        setRegion,
        amount: (tnd) => formatAmount(tnd, code),
        price: (tnd) => formatPrice(tnd, code),
        convert: (tnd) => convertAmount(tnd, code),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
