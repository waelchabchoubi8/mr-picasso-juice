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

// ─── Hero fruit illustrations ─────────────────────────────────────────────────

// Pre-computed at module level — avoids server/client floating-point mismatch
const round1 = (n: number) => Math.round(n * 10) / 10;

const ORANGE_LINES_200 = [0, 60, 120, 180, 240, 300].map(a => {
  const r = (a * Math.PI) / 180;
  return {
    x1: round1(100 + 32 * Math.cos(r)), y1: round1(100 + 32 * Math.sin(r)),
    x2: round1(100 + 90 * Math.cos(r)), y2: round1(100 + 90 * Math.sin(r)),
  };
});

function OrangeSlice({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="90" fill="#FF5A1F" fillOpacity="0.12" stroke="#FF5A1F" strokeWidth="3" strokeOpacity="0.5"/>
      <circle cx="100" cy="100" r="32"  fill="#FF5A1F" fillOpacity="0.18" stroke="#FF5A1F" strokeWidth="2" strokeOpacity="0.5"/>
      {ORANGE_LINES_200.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="#FF5A1F" strokeWidth="1.8" strokeOpacity="0.4"/>
      ))}
    </svg>
  );
}

function LemonSlice({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 130" className={className} fill="none">
      <ellipse cx="90" cy="65" rx="80" ry="52" fill="#FFD34E" fillOpacity="0.14" stroke="#FFD34E" strokeWidth="2.5" strokeOpacity="0.55"/>
      <ellipse cx="90" cy="65" rx="80" ry="52" stroke="#FFD34E" strokeWidth="1" strokeOpacity="0.3"
        strokeDasharray="0" fill="none"/>
      <path d="M10 65 Q90 28 170 65 Q90 102 10 65Z" fill="#FFD34E" fillOpacity="0.08" stroke="#FFD34E" strokeWidth="1.5" strokeOpacity="0.35"/>
      <circle cx="90" cy="65" r="16" fill="#FFD34E" fillOpacity="0.2" stroke="#FFD34E" strokeWidth="1.5" strokeOpacity="0.45"/>
      <path d="M90 13 Q108 2 112 15" stroke="#7ED95A" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.6"/>
      <path d="M90 117 Q72 128 68 115" stroke="#7ED95A" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.6"/>
    </svg>
  );
}

function StrawberryFruit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 140" className={className} fill="none">
      <path d="M55 128 C22 100 6 70 12 42 C18 18 38 10 55 20 C72 10 92 18 98 42 C104 70 88 100 55 128Z"
        fill="#FF5B7A" fillOpacity="0.15" stroke="#FF5B7A" strokeWidth="2.5" strokeOpacity="0.5"/>
      {[[40,52],[58,44],[52,70],[68,65],[40,78],[60,82]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx="3" ry="3.5" fill="#FF5B7A" fillOpacity="0.3"/>
      ))}
      <path d="M55 20 C48 4 30 0 26 14" stroke="#7ED95A" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.65"/>
      <path d="M55 20 C58 2 76 -2 80 12"  stroke="#7ED95A" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.65"/>
      <path d="M55 20 L55 8"              stroke="#7ED95A" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.65"/>
    </svg>
  );
}

function MangoFruit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 180" className={className} fill="none">
      <path d="M65 10 C96 10 118 42 118 78 C118 120 96 165 65 172 C34 165 12 120 12 78 C12 42 34 10 65 10Z"
        fill="#FFD34E" fillOpacity="0.14" stroke="#FFD34E" strokeWidth="2.5" strokeOpacity="0.5"/>
      <path d="M65 10 C77 36 80 70 72 106 C66 132 60 155 65 172"
        stroke="#FFD34E" strokeWidth="1.5" strokeOpacity="0.35"/>
      <path d="M36 38 C52 48 72 46 96 40" stroke="#FFD34E" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path d="M22 78 C40 84 80 84 108 78"  stroke="#FFD34E" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path d="M26 116 C44 120 82 120 104 116" stroke="#FFD34E" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path d="M65 4 Q76 -6 84 4" stroke="#7ED95A" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.6"/>
    </svg>
  );
}

function MintSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} fill="none">
      <path d="M50 125 L50 20" stroke="#7ED95A" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round"/>
      <path d="M50 95  C35 88 20 70 22 52 C38 56 52 68 50 95Z"  fill="#7ED95A" fillOpacity="0.18" stroke="#7ED95A" strokeWidth="1.8" strokeOpacity="0.45"/>
      <path d="M50 95  C38 88 22 70 20 52 C20 52 38 56 50 95Z"  fill="none"/>
      <path d="M50 65  C65 58 80 40 78 22 C62 26 48 38 50 65Z"  fill="#7ED95A" fillOpacity="0.18" stroke="#7ED95A" strokeWidth="1.8" strokeOpacity="0.45"/>
      <path d="M50 40  C38 32 24 18 28 4 C42 8 54 20 50 40Z"   fill="#7ED95A" fillOpacity="0.15" stroke="#7ED95A" strokeWidth="1.8" strokeOpacity="0.4"/>
    </svg>
  );
}

// Float animation helper
function FloatingFruit({ children, delay = 0, duration = 6, rotateAmt = 8, className = '' }: {
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
      style={{ background: 'linear-gradient(145deg, #FFFBF5 0%, #FFF3DC 40%, #F5FFFB 100%)' }}
    >
      {/* Ambient light blobs — pure CSS, no filter */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coral/8 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sunny/10 rounded-full blur-[70px]" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal/8  rounded-full blur-[60px]" />
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
            {[{ value: '24+', label: 'Recettes' }, { value: '3', label: 'Formats' }, { value: '100%', label: 'Naturel' }].map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="font-playfair text-2xl font-bold text-warm">{s.value}</span>
                <span className="text-warm/35 text-xs uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* ── Mobile fruit row — visible only below lg ── */}
          <motion.div
            variants={itemVariants}
            className="lg:hidden flex justify-center items-end gap-6 pt-6"
          >
            <FloatingFruit delay={0} duration={7} rotateAmt={6}>
              <OrangeSlice className="w-28 h-28" />
            </FloatingFruit>
            <FloatingFruit delay={0.6} duration={9} rotateAmt={10} className="-mb-4">
              <MangoFruit className="w-20 h-28" />
            </FloatingFruit>
            <FloatingFruit delay={1.2} duration={6.5} rotateAmt={8}>
              <LemonSlice className="w-28 h-20" />
            </FloatingFruit>
            <FloatingFruit delay={1.8} duration={8} rotateAmt={12} className="hidden min-[420px]:block -mb-2">
              <StrawberryFruit className="w-20 h-24" />
            </FloatingFruit>
          </motion.div>

        </motion.div>

        {/* ── Right: floating fruit scene (desktop only) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:block relative h-[560px]"
        >
          {/* Main orange — center */}
          <FloatingFruit delay={0} duration={7} rotateAmt={6} className="absolute top-[8%] left-[15%]">
            <OrangeSlice className="w-64 h-64" />
          </FloatingFruit>

          {/* Mango — right */}
          <FloatingFruit delay={1.2} duration={8} rotateAmt={10} className="absolute top-[5%] right-[5%]">
            <MangoFruit className="w-40 h-52" />
          </FloatingFruit>

          {/* Lemon — bottom left */}
          <FloatingFruit delay={0.6} duration={6.5} rotateAmt={8} className="absolute bottom-[12%] left-[5%]">
            <LemonSlice className="w-48 h-36" />
          </FloatingFruit>

          {/* Strawberry — top right */}
          <FloatingFruit delay={1.8} duration={5.5} rotateAmt={12} className="absolute top-[2%] right-[30%]">
            <StrawberryFruit className="w-24 h-28" />
          </FloatingFruit>

          {/* Mint — bottom right */}
          <FloatingFruit delay={0.9} duration={9} rotateAmt={7} className="absolute bottom-[8%] right-[8%]">
            <MintSprig className="w-20 h-28" />
          </FloatingFruit>

          {/* Small orange — center right */}
          <FloatingFruit delay={2.2} duration={6} rotateAmt={15} className="absolute top-[45%] right-[18%]">
            <OrangeSlice className="w-20 h-20 opacity-70" />
          </FloatingFruit>

          {/* Tiny lemon — upper center */}
          <FloatingFruit delay={1.5} duration={7.5} rotateAmt={20} className="absolute top-[30%] left-[48%]">
            <LemonSlice className="w-24 h-18 opacity-60" />
          </FloatingFruit>
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
