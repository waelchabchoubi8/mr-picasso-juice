'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: SPRING } },
};

// ─── Hero pâtisserie illustrations (line-art, semi-transparent) ────────────────

// Pre-computed at module level — avoids server/client floating-point mismatch
const round1 = (n: number) => Math.round(n * 10) / 10;

// Dashed decorative ring ticks for the monogram medallion.
const MEDALLION_TICKS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
  const r = (a * Math.PI) / 180;
  return {
    x1: round1(100 + 70 * Math.cos(r)), y1: round1(100 + 70 * Math.sin(r)),
    x2: round1(100 + 78 * Math.cos(r)), y2: round1(100 + 78 * Math.sin(r)),
  };
});

// Masmoudi "M" monogram medallion — the brand mark.
function MonogramMedallion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="92" fill="#6C5CE7" fillOpacity="0.12" stroke="#6C5CE7" strokeWidth="3" strokeOpacity="0.5" />
      <circle cx="100" cy="100" r="84" stroke="#6C5CE7" strokeWidth="1.2" strokeOpacity="0.3" />
      {MEDALLION_TICKS.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#6C5CE7" strokeWidth="2" strokeOpacity="0.4" />
      ))}
      {/* double-loop M */}
      <path d="M64 138 L64 76 C64 66 76 62 82 72 L100 104 L118 72 C124 62 136 66 136 76 L136 138"
        stroke="#6C5CE7" strokeWidth="7" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 104 L100 132" stroke="#6C5CE7" strokeWidth="7" strokeOpacity="0.6" strokeLinecap="round" />
    </svg>
  );
}

// Baklawa — layered diamond with a pistachio centre.
function BaklawaDiamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none">
      <path d="M80 14 L146 80 L80 146 L14 80 Z" fill="#C9A24B" fillOpacity="0.14" stroke="#C9A24B" strokeWidth="3" strokeOpacity="0.5" />
      <path d="M80 36 L124 80 L80 124 L36 80 Z" stroke="#C9A24B" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M30 64 L130 64 M30 96 L130 96" stroke="#C9A24B" strokeWidth="1.5" strokeOpacity="0.32" />
      <circle cx="80" cy="80" r="15" fill="#7ED95A" fillOpacity="0.3" stroke="#7ED95A" strokeWidth="2" strokeOpacity="0.5" />
    </svg>
  );
}

// Gift box / coffret with lid and ribbon.
function GiftBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 170" className={className} fill="none">
      {/* base */}
      <rect x="30" y="64" width="110" height="84" rx="8" fill="#6C5CE7" fillOpacity="0.12" stroke="#6C5CE7" strokeWidth="2.8" strokeOpacity="0.5" />
      {/* lid */}
      <rect x="22" y="48" width="126" height="26" rx="7" fill="#6C5CE7" fillOpacity="0.18" stroke="#6C5CE7" strokeWidth="2.8" strokeOpacity="0.55" />
      {/* ribbon vertical */}
      <rect x="78" y="48" width="14" height="100" fill="#FFD34E" fillOpacity="0.25" stroke="#FFD34E" strokeWidth="2" strokeOpacity="0.5" />
      {/* bow */}
      <path d="M85 48 C70 28 44 32 60 50 C44 46 50 30 85 48Z" fill="#FFD34E" fillOpacity="0.2" stroke="#FFD34E" strokeWidth="2" strokeOpacity="0.5" />
      <path d="M85 48 C100 28 126 32 110 50 C126 46 120 30 85 48Z" fill="#FFD34E" fillOpacity="0.2" stroke="#FFD34E" strokeWidth="2" strokeOpacity="0.5" />
    </svg>
  );
}

// Makroud — a date-filled lozenge with criss-cross marks.
function Makroud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 110" className={className} fill="none">
      <path d="M30 78 L60 30 L130 30 L100 78 Z" fill="#9A5A2C" fillOpacity="0.15" stroke="#9A5A2C" strokeWidth="2.6" strokeOpacity="0.5" />
      <path d="M48 54 L118 54" stroke="#9A5A2C" strokeWidth="1.5" strokeOpacity="0.35" />
      <path d="M70 30 L52 78 M92 30 L74 78 M114 30 L96 78" stroke="#9A5A2C" strokeWidth="1.4" strokeOpacity="0.3" />
    </svg>
  );
}

// Pistachio sprig — leaves garnish.
function PistachioSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} fill="none">
      <path d="M50 125 L50 20" stroke="#7ED95A" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" />
      <path d="M50 95  C35 88 20 70 22 52 C38 56 52 68 50 95Z" fill="#7ED95A" fillOpacity="0.18" stroke="#7ED95A" strokeWidth="1.8" strokeOpacity="0.45" />
      <path d="M50 65  C65 58 80 40 78 22 C62 26 48 38 50 65Z" fill="#7ED95A" fillOpacity="0.18" stroke="#7ED95A" strokeWidth="1.8" strokeOpacity="0.45" />
      <path d="M50 40  C38 32 24 18 28 4 C42 8 54 20 50 40Z"  fill="#7ED95A" fillOpacity="0.15" stroke="#7ED95A" strokeWidth="1.8" strokeOpacity="0.4" />
    </svg>
  );
}

// Float animation helper
function FloatingItem({ children, delay = 0, duration = 6, rotateAmt = 8, className = '' }: {
  children: React.ReactNode; delay?: number; duration?: number; rotateAmt?: number; className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -14, 0], rotate: [-rotateAmt/2, rotateAmt/2, -rotateAmt/2] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function HeroSection() {
  const t     = useTranslations('hero');
  const words = t('tagline').split(' ');

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex items-center"
      style={{ background: 'linear-gradient(145deg, #FFFBF5 0%, #F1ECFF 45%, #FAF7FF 100%)' }}
    >
      {/* Ambient light blobs — pure CSS, no filter */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coral/8 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sunny/10 rounded-full blur-[70px]" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-lilac/20 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-8 items-center min-h-screen pt-28 pb-16 lg:py-36">

        {/* ── Left: text ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 bg-coral/10 border border-coral/20 text-coral rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase">{t('badge')}</span>
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-playfair text-[clamp(3rem,7.5vw,6.5rem)] font-bold leading-[0.9] tracking-tight text-warm"
          >
            {words.map((word, i) => (
              <span key={i}>
                <span className={i % 2 !== 0 ? 'italic text-coral' : ''}>{word}</span>
                {i < words.length - 1 && ' '}
              </span>
            ))}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-warm/55 text-lg leading-relaxed max-w-[400px]">
            {t('subtitle')}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-1">
            <a href="#menu" className="group relative overflow-hidden bg-coral text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-coral/25 hover:shadow-coral/45 transition-shadow duration-300 cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                {t('cta')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
              <span className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
            </a>
            <a href="#palette" className="text-warm/50 hover:text-coral text-sm font-medium border-b border-warm/20 hover:border-coral pb-0.5 transition-colors duration-200 cursor-pointer">
              {t('createJuice')}
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-7 pt-4 border-t border-warm/10">
            {[{ value: '50+', label: 'Pâtisseries' }, { value: '3', label: 'Tailles' }, { value: '1969', label: 'À Sfax' }].map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="font-playfair text-2xl font-bold text-warm">{s.value}</span>
                <span className="text-warm/35 text-xs uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* ── Mobile pâtisserie row — visible only below lg ── */}
          <motion.div
            variants={itemVariants}
            className="lg:hidden flex justify-center items-end gap-6 pt-6"
          >
            <FloatingItem delay={0} duration={7} rotateAmt={6}>
              <MonogramMedallion className="w-28 h-28" />
            </FloatingItem>
            <FloatingItem delay={0.6} duration={9} rotateAmt={10} className="-mb-4">
              <GiftBox className="w-24 h-24" />
            </FloatingItem>
            <FloatingItem delay={1.2} duration={6.5} rotateAmt={8}>
              <BaklawaDiamond className="w-24 h-24" />
            </FloatingItem>
            <FloatingItem delay={1.8} duration={8} rotateAmt={12} className="hidden min-[420px]:block -mb-2">
              <Makroud className="w-24 h-16" />
            </FloatingItem>
          </motion.div>

        </motion.div>

        {/* ── Right: floating pâtisserie scene (desktop only) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:block relative h-[560px]"
        >
          {/* Monogram medallion — center */}
          <FloatingItem delay={0} duration={7} rotateAmt={5} className="absolute top-[8%] left-[15%]">
            <MonogramMedallion className="w-64 h-64" />
          </FloatingItem>

          {/* Gift box — right */}
          <FloatingItem delay={1.2} duration={8} rotateAmt={9} className="absolute top-[5%] right-[5%]">
            <GiftBox className="w-44 h-44" />
          </FloatingItem>

          {/* Baklawa — bottom left */}
          <FloatingItem delay={0.6} duration={6.5} rotateAmt={8} className="absolute bottom-[12%] left-[5%]">
            <BaklawaDiamond className="w-44 h-44" />
          </FloatingItem>

          {/* Makroud — top right */}
          <FloatingItem delay={1.8} duration={5.5} rotateAmt={12} className="absolute top-[2%] right-[32%]">
            <Makroud className="w-28 h-20" />
          </FloatingItem>

          {/* Pistachio sprig — bottom right */}
          <FloatingItem delay={0.9} duration={9} rotateAmt={7} className="absolute bottom-[8%] right-[8%]">
            <PistachioSprig className="w-20 h-28" />
          </FloatingItem>

          {/* Small baklawa — center right */}
          <FloatingItem delay={2.2} duration={6} rotateAmt={15} className="absolute top-[46%] right-[18%]">
            <BaklawaDiamond className="w-20 h-20 opacity-70" />
          </FloatingItem>

          {/* Small makroud — upper center */}
          <FloatingItem delay={1.5} duration={7.5} rotateAmt={18} className="absolute top-[30%] left-[48%]">
            <Makroud className="w-24 h-16 opacity-60" />
          </FloatingItem>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-warm/25 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-gradient-to-b from-transparent via-coral/40 to-transparent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
