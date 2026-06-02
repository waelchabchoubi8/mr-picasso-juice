'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

// The beforeinstallprompt event isn't in the standard TS lib yet.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'picasso-pwa-dismissed';

/* ---------- icons ---------- */
function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
function ShareIcon() {
  // iOS share glyph
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 16V4" />
      <path d="m8 8 4-4 4 4" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  );
}
function PlusSquareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function InstallPWA() {
  const t = useTranslations('pwa');
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  /* register service worker on any real domain (HTTPS).
     Only skip on localhost dev, where the SW would cache Next.js HMR chunks
     and serve stale assets — there we actively unregister any leftover worker.
     Keyed on hostname (not NODE_ENV) so it works even if the server runs `next dev`. */
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const host = window.location.hostname;
    const isLocal =
      host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
    if (isLocal) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
    } else {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  /* detect platform + install state */
  useEffect(() => {
    const ua = window.navigator.userAgent;
    const ios =
      /iphone|ipad|ipod/i.test(ua) ||
      // iPadOS reports as Mac with touch
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    setIsIOS(ios);
    setStandalone(isStandalone);

    const dismissed = (() => {
      try {
        const ts = localStorage.getItem(DISMISS_KEY);
        if (!ts) return false;
        // re-offer after 7 days
        return Date.now() - Number(ts) < 7 * 24 * 60 * 60 * 1000;
      } catch {
        return false;
      }
    })();

    if (isStandalone || dismissed) return;

    // iOS never fires beforeinstallprompt → show the button so we can guide them.
    // In dev, also show it (preview) since the native prompt can't fire without HTTPS.
    if (ios || process.env.NODE_ENV !== 'production') {
      const tm = setTimeout(() => setShowButton(true), 2500);
      return () => clearTimeout(tm);
    }
  }, []);

  /* capture the native install prompt (Android / Chrome / Edge desktop) */
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };
    const onInstalled = () => {
      setStandalone(true);
      setShowButton(false);
      setModalOpen(false);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleClick = useCallback(async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === 'accepted') setShowButton(false);
      setDeferred(null);
      return;
    }
    // iOS or browsers without a native prompt → show guided modal
    setModalOpen(true);
  }, [deferred]);

  /* let other components (e.g. the navbar) trigger the install flow */
  useEffect(() => {
    const open = () => handleClick();
    window.addEventListener('picasso:open-install', open);
    return () => window.removeEventListener('picasso:open-install', open);
  }, [handleClick]);

  const dismiss = useCallback(() => {
    setShowButton(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, []);

  if (standalone) return null;

  const benefits = [t('benefit1'), t('benefit2'), t('benefit3')];

  return (
    <>
      {/* ---------- floating install pill ---------- */}
      <AnimatePresence>
        {showButton && !modalOpen && (
          <motion.div
            key="install-pill"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-6 left-4 sm:left-6 z-50 flex items-center"
          >
            <button
              onClick={handleClick}
              aria-label={t('install')}
              className="group relative flex items-center gap-2 bg-warm text-cream pl-3.5 pr-4 py-3 rounded-full shadow-xl cursor-pointer overflow-hidden"
              style={{ boxShadow: '0 8px 28px rgba(26,10,0,0.28)' }}
            >
              {/* gradient sheen */}
              <span className="absolute inset-0 bg-gradient-to-r from-coral/0 via-coral/0 to-sunny/0 group-hover:from-coral/20 group-hover:to-sunny/20 transition-all duration-500" />
              <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-coral to-sunny text-white shadow-sm">
                <DownloadIcon />
              </span>
              <span className="relative text-sm font-semibold whitespace-nowrap pr-0.5">
                {t('install')}
              </span>
              {/* subtle pulse ring */}
              <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-coral/40 animate-ping" style={{ animationDuration: '2.4s' }} />
            </button>
            {/* dismiss */}
            <button
              onClick={dismiss}
              aria-label={t('close')}
              className="ml-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-warm/10 hover:bg-warm/20 text-warm/60 hover:text-warm transition-colors cursor-pointer text-sm leading-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- guide modal ---------- */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="install-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-warm/45 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* header with brand gradient */}
              <div className="relative px-6 pt-7 pb-6 bg-gradient-to-br from-coral to-sunny text-white text-center">
                <button
                  onClick={() => setModalOpen(false)}
                  aria-label={t('close')}
                  className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer text-lg leading-none"
                >
                  ×
                </button>
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.08 }}
                  className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.svg" alt="" width={44} height={44} className="rounded-xl" />
                </motion.div>
                <h2 className="font-playfair text-xl font-bold">
                  {isIOS ? t('titleIOS') : t('titleAndroid')}
                </h2>
                <p className="text-white/85 text-sm mt-1 max-w-xs mx-auto">
                  {isIOS ? t('subtitleIOS') : t('subtitleAndroid')}
                </p>
              </div>

              {/* body */}
              <div className="px-6 py-6">
                {isIOS ? (
                  <ol className="space-y-3.5">
                    <Step
                      n={1}
                      icon={<ShareIcon />}
                      title={t('iosStep1')}
                      detail={t('iosStep1Detail')}
                    />
                    <Step
                      n={2}
                      icon={<PlusSquareIcon />}
                      title={t('iosStep2')}
                      detail={t('iosStep2Detail')}
                    />
                    <p className="text-xs text-warm/50 text-center pt-1">{t('iosNote')}</p>
                  </ol>
                ) : (
                  <>
                    {deferred ? (
                      <button
                        onClick={async () => {
                          await deferred.prompt();
                          const { outcome } = await deferred.userChoice;
                          if (outcome === 'accepted') setShowButton(false);
                          setDeferred(null);
                          setModalOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-coral text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-coral/30 hover:shadow-coral/50 transition-shadow cursor-pointer"
                      >
                        <DownloadIcon />
                        {t('installCta')}
                      </button>
                    ) : (
                      <ol className="space-y-3.5">
                        <Step n={1} icon={<DownloadIcon />} title={t('androidStep1')} />
                        <Step n={2} icon={<PlusSquareIcon />} title={t('androidStep2')} />
                      </ol>
                    )}

                    {/* benefits */}
                    <ul className="mt-5 space-y-2">
                      {benefits.map((b, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-warm/70">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center" style={{ color: '#4FA82E' }}>
                            <CheckIcon />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Step({
  n,
  icon,
  title,
  detail,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  detail?: string;
}) {
  return (
    <li className="flex items-center gap-3.5">
      <span className="flex-shrink-0 relative w-10 h-10 rounded-2xl bg-warm/[0.06] flex items-center justify-center text-warm/80">
        {icon}
        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-coral text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
          {n}
        </span>
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-warm leading-tight">{title}</p>
        {detail && <p className="text-xs text-warm/50 mt-0.5">{detail}</p>}
      </div>
    </li>
  );
}
