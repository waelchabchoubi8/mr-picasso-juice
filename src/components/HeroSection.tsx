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

// ─── Tunisian-food illustrations (line-art, semi-transparent) ──────────────────

function TinCan({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none">
      {/* body */}
      <path d="M22 32 L22 128 C22 142 38 148 60 148 C82 148 98 142 98 128 L98 32 Z"
        fill="#CE2029" fillOpacity="0.12" stroke="#CE2029" strokeWidth="3" strokeOpacity="0.5" />
      {/* top rim */}
      <ellipse cx="60" cy="32" rx="38" ry="12" fill="#CE2029" fillOpacity="0.18" stroke="#CE2029" strokeWidth="2.5" strokeOpacity="0.55" />
      <ellipse cx="60" cy="32" rx="30" ry="8" stroke="#CE2029" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* label band */}
      <path d="M22 68 L98 68 M22 110 L98 110" stroke="#CE2029" strokeWidth="1.5" strokeOpacity="0.35" />
      <path d="M40 89 Q60 80 80 89" stroke="#CE2029" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

function Tagine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none">
      {/* conical lid */}
      <path d="M42 104 C50 36 110 36 118 104 Z"
        fill="#CE2029" fillOpacity="0.13" stroke="#CE2029" strokeWidth="2.8" strokeOpacity="0.5" />
      <path d="M58 96 C66 64 94 64 102 96" stroke="#CE2029" strokeWidth="1.5" strokeOpacity="0.32" />
      {/* knob */}
      <circle cx="80" cy="30" r="8" fill="#FFD34E" fillOpacity="0.3" stroke="#CE2029" strokeWidth="2.2" strokeOpacity="0.5" />
      {/* base bowl */}
      <ellipse cx="80" cy="104" rx="52" ry="12" fill="#FFD34E" fillOpacity="0.14" stroke="#CE2029" strokeWidth="2.6" strokeOpacity="0.5" />
      <path d="M30 104 C30 128 50 138 80 138 C110 138 130 128 130 104"
        fill="#FFD34E" fillOpacity="0.1" stroke="#CE2029" strokeWidth="2.6" strokeOpacity="0.5" />
    </svg>
  );
}

function ChiliPepper({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} fill="none">
      <path d="M44 28 C66 36 70 64 64 92 C58 118 44 130 34 128 C26 126 30 104 34 84 C38 60 40 38 44 28 Z"
        fill="#CE2029" fillOpacity="0.15" stroke="#CE2029" strokeWidth="2.5" strokeOpacity="0.5" />
      <path d="M44 28 C44 12 54 6 64 12" stroke="#7ED95A" strokeWidth="2.6" strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M44 28 L48 16" stroke="#7ED95A" strokeWidth="2.6" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
}

function OliveSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 110" className={className} fill="none">
      <path d="M14 22 C50 30 92 44 120 86" stroke="#7ED95A" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" fill="none" />
      {/* olives */}
      <ellipse cx="58" cy="40" rx="11" ry="14" transform="rotate(28 58 40)" fill="#7ED95A" fillOpacity="0.18" stroke="#7ED95A" strokeWidth="2" strokeOpacity="0.5" />
      <ellipse cx="90" cy="58" rx="11" ry="14" transform="rotate(32 90 58)" fill="#3ECFB0" fillOpacity="0.16" stroke="#3ECFB0" strokeWidth="2" strokeOpacity="0.5" />
      <ellipse cx="112" cy="82" rx="10" ry="13" transform="rotate(38 112 82)" fill="#7ED95A" fillOpacity="0.16" stroke="#7ED95A" strokeWidth="2" strokeOpacity="0.5" />
      {/* leaves */}
      <path d="M30 18 C44 8 58 12 60 26 C46 30 34 28 30 18 Z" fill="#7ED95A" fillOpacity="0.14" stroke="#7ED95A" strokeWidth="1.8" strokeOpacity="0.45" />
    </svg>
  );
}

function CouscousBowl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 110" className={className} fill="none">
      {/* mound */}
      <path d="M30 56 C36 30 114 30 120 56 Z" fill="#FFD34E" fillOpacity="0.16" stroke="#FFD34E" strokeWidth="2.4" strokeOpacity="0.55" />
      {/* bowl */}
      <ellipse cx="75" cy="56" rx="55" ry="12" fill="#CE2029" fillOpacity="0.1" stroke="#CE2029" strokeWidth="2.6" strokeOpacity="0.45" />
      <path d="M22 56 C22 86 42 100 75 100 C108 100 128 86 128 56"
        fill="#CE2029" fillOpacity="0.08" stroke="#CE2029" strokeWidth="2.6" strokeOpacity="0.45" />
      {/* steam */}
      <path d="M62 22 C56 14 68 10 62 2" stroke="#FFD34E" strokeWidth="2" strokeOpacity="0.45" strokeLinecap="round" />
      <path d="M88 22 C82 14 94 10 88 2" stroke="#FFD34E" strokeWidth="2" strokeOpacity="0.45" strokeLinecap="round" />
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

  const stats = [
    { value: '12+',  label: t('stat1') },
    { value: '3',    label: t('stat2') },
    { value: '100%', label: t('stat3') },
  ];

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
              {t('buildBox')}
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-7 pt-4 border-t border-warm/10">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="font-playfair text-2xl font-bold text-warm">{s.value}</span>
                <span className="text-warm/35 text-xs uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* ── Mobile food row — visible only below lg ── */}
          <motion.div
            variants={itemVariants}
            className="lg:hidden flex justify-center items-end gap-6 pt-6"
          >
            <FloatingItem delay={0} duration={7} rotateAmt={6}>
              <Tagine className="w-28 h-28" />
            </FloatingItem>
            <FloatingItem delay={0.6} duration={9} rotateAmt={10} className="-mb-4">
              <TinCan className="w-20 h-28" />
            </FloatingItem>
            <FloatingItem delay={1.2} duration={6.5} rotateAmt={8}>
              <CouscousBowl className="w-28 h-20" />
            </FloatingItem>
            <FloatingItem delay={1.8} duration={8} rotateAmt={12} className="hidden min-[420px]:block -mb-2">
              <ChiliPepper className="w-16 h-24" />
            </FloatingItem>
          </motion.div>

        </motion.div>

        {/* ── Right: floating food scene (desktop only) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:block relative h-[560px]"
        >
          {/* Main tagine — center */}
          <FloatingItem delay={0} duration={7} rotateAmt={6} className="absolute top-[8%] left-[15%]">
            <Tagine className="w-64 h-64" />
          </FloatingItem>

          {/* Tin can — right */}
          <FloatingItem delay={1.2} duration={8} rotateAmt={10} className="absolute top-[5%] right-[5%]">
            <TinCan className="w-40 h-52" />
          </FloatingItem>

          {/* Couscous bowl — bottom left */}
          <FloatingItem delay={0.6} duration={6.5} rotateAmt={8} className="absolute bottom-[12%] left-[5%]">
            <CouscousBowl className="w-48 h-36" />
          </FloatingItem>

          {/* Chili — top right */}
          <FloatingItem delay={1.8} duration={5.5} rotateAmt={12} className="absolute top-[2%] right-[30%]">
            <ChiliPepper className="w-20 h-28" />
          </FloatingItem>

          {/* Olive sprig — bottom right */}
          <FloatingItem delay={0.9} duration={9} rotateAmt={7} className="absolute bottom-[8%] right-[8%]">
            <OliveSprig className="w-28 h-24" />
          </FloatingItem>

          {/* Small chili — center right */}
          <FloatingItem delay={2.2} duration={6} rotateAmt={15} className="absolute top-[45%] right-[18%]">
            <ChiliPepper className="w-14 h-20 opacity-70" />
          </FloatingItem>

          {/* Olive — upper center */}
          <FloatingItem delay={1.5} duration={7.5} rotateAmt={20} className="absolute top-[30%] left-[48%]">
            <OliveSprig className="w-24 h-20 opacity-60" />
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
