'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/navigation';

const MAGNETIC_STRENGTH = 0.38;

function MagneticButton({ children, className, onClick }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 12, stiffness: 180 });
  const sy = useSpring(y, { damping: 12, stiffness: 180 });

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width  / 2)) * MAGNETIC_STRENGTH);
        y.set((e.clientY - (r.top  + r.height / 2)) * MAGNETIC_STRENGTH);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

const NAV_LINKS = [
  { key: 'menu',    anchor: '#menu'    },
  { key: 'palette', anchor: '#palette' },
  { key: 'about',   anchor: '#about'   },
] as const;

export default function Navbar() {
  const t      = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const path   = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toggleLocale = () =>
    router.push(path, { locale: locale === 'fr' ? 'en' : 'fr' });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none"
    >
      <nav className={`
        pointer-events-auto w-full max-w-5xl flex items-center justify-between
        gap-4 sm:gap-8 px-4 sm:px-6 py-3 rounded-full border
        transition-all duration-500
        ${scrolled
          ? 'bg-white/94 backdrop-blur-md border-warm/10 shadow-lg shadow-warm/5'
          : 'bg-white/75 backdrop-blur-md border-white/80'}
      `}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-sunny flex items-center justify-center shadow-md shadow-coral/30 group-hover:shadow-coral/50 transition-shadow duration-300">
            <span className="text-white font-playfair font-bold text-sm">P</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-playfair text-warm font-semibold text-sm tracking-wide">Mr. Picasso</span>
            <span className="text-warm/35 text-xs ml-1">Juice</span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ key, anchor }) => (
            <a
              key={key}
              href={anchor}
              className="relative text-warm/60 hover:text-coral text-sm font-medium transition-colors duration-200 group cursor-pointer"
            >
              {t(key)}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-coral group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </div>

        {/* Right: language + CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            aria-label={`Switch to ${locale === 'fr' ? 'English' : 'Français'}`}
            className="flex items-center bg-warm/[0.05] hover:bg-warm/[0.1] border border-warm/10 rounded-full p-0.5 transition-all duration-200 cursor-pointer"
          >
            {(['fr', 'en'] as const).map((lang) => (
              <span
                key={lang}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-250 ${
                  locale === lang
                    ? 'bg-coral text-white shadow-sm shadow-coral/40'
                    : 'text-warm/45 hover:text-warm/80'
                }`}
              >
                {lang.toUpperCase()}
              </span>
            ))}
          </button>

          {/* Magnetic CTA — hidden on mobile, hamburger handles nav there */}
          <MagneticButton className="hidden sm:flex relative overflow-hidden bg-coral text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-md shadow-coral/30 hover:shadow-coral/50 transition-shadow duration-300 cursor-pointer whitespace-nowrap group">
            <span className="relative z-10">{t('orderNow')}</span>
            <span className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
          </MagneticButton>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 7  } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-warm rounded-full origin-center" />
            <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} className="block w-5 h-px bg-warm rounded-full" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-warm rounded-full origin-center" />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — AnimatePresence enables smooth exit */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0,   scaleY: 1 }}
            exit={{    opacity: 0, y: -10,  scaleY: 0.94 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto md:hidden absolute top-full left-0 right-0 mt-2 mx-auto w-full max-w-5xl bg-white/96 backdrop-blur-md border border-warm/10 rounded-3xl p-5 flex flex-col gap-2 shadow-xl shadow-warm/5 origin-top"
          >
            {NAV_LINKS.map(({ key, anchor }, i) => (
              <motion.a
                key={key}
                href={anchor}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="text-warm/70 hover:text-coral text-base font-medium py-2.5 px-4 rounded-xl hover:bg-coral/5 transition-colors duration-200 cursor-pointer"
              >
                {t(key)}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
