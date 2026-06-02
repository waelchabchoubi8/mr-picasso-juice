'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, CartItem } from './CartContext';

const WHATSAPP_NUMBER = '21600000000';
const DELIVERY_FEE    = 7;
const NATIONAL_MIN    = 30;

const WILAYAS = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
  'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef',
  'Mahdia', 'La Manouba', 'Médenine', 'Monastir', 'Nabeul',
  'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
  'Tozeur', 'Tunis', 'Zaghouan',
];

const STORES = [
  { id: 'tanyour', name: 'Tanyour Store', address: 'Adresse Tanyour, Sfax', emoji: '🏪' },
  { id: 'mall',    name: 'Mall Store',    address: 'Mall de Sfax',           emoji: '🏬' },
];

type Method = 'pickup' | 'sfax' | 'national';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(n: number) {
  return n.toFixed(3).replace('.', ',');
}

function isEligibleForNational(item: CartItem) {
  return item.format.includes('1L');
}

function buildWhatsAppMessage(
  items: CartItem[],
  method: Method,
  store: string | null,
  address: string,
  wilaya: string,
  name: string,
  phone: string,
  total: number,
) {
  const lines = items.map(i => {
    const fruits = i.fruits?.length ? ` (${i.fruits.join(' × ')})` : '';
    return `• ${i.qty}x ${i.name}${fruits} — ${fmtPrice(i.price * i.qty)} TND`;
  });

  const contact = `Commande de ${name || 'Client'}${phone ? ` — ${phone}` : ''}`;

  let delivery: string[] = [];
  if (method === 'pickup') {
    const s = STORES.find(s => s.id === store);
    delivery = [`Mode : Retrait en magasin`, `Magasin : ${s?.name ?? store}`];
  } else if (method === 'sfax') {
    delivery = [
      `Mode : Livraison Sfax (≤ 10 km)`,
      `Adresse : ${address}`,
      `Frais de livraison : +${fmtPrice(DELIVERY_FEE)} TND`,
    ];
  } else {
    delivery = [
      `Mode : Livraison Nationale`,
      `Wilaya : ${wilaya}`,
      `Adresse : ${address}`,
      `Frais de livraison : +${fmtPrice(DELIVERY_FEE)} TND`,
    ];
  }

  const grandTotal = method === 'pickup' ? total : total + DELIVERY_FEE;

  return [
    'Bonjour AIT Juice! 🎨',
    '',
    contact,
    '',
    ...delivery,
    '',
    ...lines,
    '',
    `Total : ${fmtPrice(grandTotal)} TND`,
    '',
    'Merci ! 🍊',
  ].join('\n');
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function PlusSmIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

// ─── Step progress dots ───────────────────────────────────────────────────────

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex justify-center items-center gap-2 pb-1">
      {[1, 2, 3].map(s => (
        <motion.div
          key={s}
          animate={{
            width:           s === step ? 22 : 7,
            backgroundColor: s <= step  ? '#FF5A1F' : '#1A0A0015',
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CartDrawer() {
  const {
    items, open, totalItems, totalPrice,
    removeItem, setQty, clearCart, closeCart,
  } = useCart();

  const [step,    setStep]    = useState(1);
  const [method,  setMethod]  = useState<Method | null>(null);
  const [store,   setStore]   = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [wilaya,  setWilaya]  = useState('');
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [dir,     setDir]     = useState(1); // 1 = forward, -1 = backward

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(1); setMethod(null); setStore(null);
        setAddress(''); setWilaya(''); setName(''); setPhone('');
        setSent(false); setDir(1);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // If cart empties while past step 1, return to step 1
  useEffect(() => {
    if (items.length === 0 && step > 1) goTo(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // ── Derived ──────────────────────────────────────────────────────────────

  const ineligible    = items.filter(i => !isEligibleForNational(i));
  const hasIneligible = method === 'national' && ineligible.length > 0;
  const belowMin      = method === 'national' && !hasIneligible && totalPrice < NATIONAL_MIN;
  const missingTND    = NATIONAL_MIN - totalPrice;

  const deliveryFeeApplies = method === 'sfax' || method === 'national';
  const grandTotal         = totalPrice + (deliveryFeeApplies ? DELIVERY_FEE : 0);

  const canSend =
    name.trim() !== '' &&
    phone.trim() !== '' &&
    (method !== 'pickup' || store !== null) &&
    (method !== 'sfax'   || address.trim() !== '') &&
    (method !== 'national' || (
      !hasIneligible && !belowMin &&
      wilaya !== '' && address.trim() !== ''
    ));

  const handleRemoveIneligible = () => {
    ineligible.forEach(i => removeItem(i.id));
  };

  const handleOrder = () => {
    const msg = buildWhatsAppMessage(
      items, method!, store, address, wilaya, name, phone, totalPrice,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  // ── Slide animation variants ─────────────────────────────────────────────

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  // ── Step 1: Cart items ───────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="flex flex-col h-full">
      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 pb-16">
            <div className="w-14 h-14 rounded-full bg-coral/8 flex items-center justify-center text-3xl">
              🧃
            </div>
            <div>
              <p className="font-playfair text-warm/45 text-base font-medium">Panier vide</p>
              <p className="text-warm/25 text-xs mt-1">Ajoutez des jus depuis le menu</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <AnimatePresence initial={false}>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-warm/8 shadow-sm shadow-warm/3"
                >
                  <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-warm font-semibold text-[13px] truncate leading-tight">{item.name}</p>
                    <p className="text-warm/35 text-[10px] leading-tight mt-0.5">{item.format}</p>
                    {item.fruits && item.fruits.length > 0 && (
                      <p className="text-warm/25 text-[9px] truncate mt-0.5">{item.fruits.join(' × ')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-warm/50 hover:text-warm border border-warm/15 hover:border-warm/30 transition-all cursor-pointer"
                    >
                      <MinusIcon />
                    </button>
                    <span className="w-4 text-center text-warm font-bold text-[13px]">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white transition-all cursor-pointer"
                      style={{ background: item.color }}
                    >
                      <PlusSmIcon />
                    </button>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-1">
                    <span className="font-playfair font-bold text-warm text-[13px] whitespace-nowrap">
                      {fmtPrice(item.price * item.qty)}
                      <span className="text-warm/35 text-[9px] font-normal ml-0.5">TND</span>
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-warm/18 hover:text-coral transition-colors cursor-pointer"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {items.length > 0 && (
        <div className="border-t border-warm/8 px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-warm/40 text-sm">Sous-total</span>
            <span className="font-playfair font-bold text-warm text-lg">
              {fmtPrice(totalPrice)}
              <span className="text-warm/35 text-sm font-normal ml-1">TND</span>
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => goTo(2)}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-coral text-white font-semibold text-sm shadow-lg shadow-coral/25 cursor-pointer"
          >
            <span>Choisir la livraison</span>
            <ChevronRightIcon />
          </motion.button>
        </div>
      )}
    </div>
  );

  // ── Step 2: Method selection ─────────────────────────────────────────────

  const METHODS = [
    {
      id:      'pickup' as Method,
      emoji:   '🏪',
      title:   'Réserver & Retirer',
      desc:    'Prêt en 30 min',
      sub:     'Tanyour Store · Mall Sfax',
      tag:     'GRATUIT',
      tagBg:   '#22c55e',
      color:   '#FF5A1F',
      glow:    '#FF5A1F',
    },
    {
      id:      'sfax' as Method,
      emoji:   '🛵',
      title:   'Livraison — Sfax',
      desc:    'À domicile · Zone ≤ 10 km',
      sub:     'Menu complet disponible',
      tag:     '+7,000 TND',
      tagBg:   '#3ECFB0',
      color:   '#18A88A',
      glow:    '#3ECFB0',
    },
    {
      id:      'national' as Method,
      emoji:   '📦',
      title:   'Livraison — Hors Sfax',
      desc:    'Bouteilles 1L · Palettes 1L',
      sub:     `Min. ${NATIONAL_MIN} TND · Livraison +7 TND`,
      tag:     '+7,000 TND',
      tagBg:   '#E6A800',
      color:   '#E6A800',
      glow:    '#FFD34E',
    },
  ];

  const renderStep2 = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
        <p className="text-warm/40 text-xs font-medium uppercase tracking-widest mb-5 text-center">
          Comment souhaitez-vous recevoir votre commande ?
        </p>
        <div className="flex flex-col gap-3">
          {METHODS.map(m => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setMethod(m.id); goTo(3); }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer"
              style={{
                borderColor: `${m.color}30`,
                background:  `${m.color}08`,
                boxShadow:   `0 4px 20px ${m.glow}10`,
              }}
            >
              {/* Emoji */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${m.color}15` }}
              >
                {m.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-warm text-[14px] leading-tight">{m.title}</p>
                <p className="text-warm/45 text-[11px] mt-0.5">{m.desc}</p>
                <p className="text-warm/28 text-[10px] mt-0.5">{m.sub}</p>
              </div>

              {/* Tag + arrow */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span
                  className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: m.tagBg }}
                >
                  {m.tag}
                </span>
                <span className="text-warm/20">
                  <ChevronRightIcon />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Step 3: Details ──────────────────────────────────────────────────────

  const inputCls =
    'w-full px-3.5 py-2.5 bg-white border border-warm/10 rounded-xl text-base sm:text-sm text-warm placeholder-warm/30 focus:outline-none focus:border-coral/40 transition-colors';

  const renderNationalGuard = () => (
    <div className="flex flex-col gap-4 px-5 py-2">
      {/* Warning card */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold text-warm text-sm leading-tight">Articles non disponibles</p>
            <p className="text-warm/50 text-xs mt-1 leading-relaxed">
              Ces articles ne sont pas disponibles pour la livraison hors Sfax :
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 pl-9">
          {ineligible.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-warm/65">
                {item.qty}× {item.name}
                <span className="text-warm/35 ml-1">({item.format})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-warm/35 text-xs text-center leading-relaxed px-2">
        Seules les <span className="font-semibold text-warm/55">Bouteilles 1L</span> et les <span className="font-semibold text-warm/55">Palettes 1L</span> sont disponibles hors Sfax.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleRemoveIneligible}
        className="w-full py-3.5 rounded-xl bg-coral text-white font-semibold text-sm shadow-md shadow-coral/20 cursor-pointer"
      >
        Retirer ces articles et continuer
      </motion.button>

      <button
        onClick={() => goTo(2)}
        className="w-full py-2.5 text-warm/35 hover:text-warm/60 text-sm transition-colors cursor-pointer"
      >
        ← Changer de méthode
      </button>
    </div>
  );

  const renderNationalMinWarning = () => (
    <div className="flex flex-col items-center gap-4 px-5 py-8 text-center">
      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl">📦</div>
      <div>
        <p className="font-playfair font-bold text-warm text-base mb-1">Minimum requis</p>
        <p className="text-warm/45 text-sm leading-relaxed">
          La livraison hors Sfax requiert un minimum de{' '}
          <span className="font-semibold text-warm">{fmtPrice(NATIONAL_MIN)} TND</span> hors livraison.
        </p>
        <p className="text-coral font-semibold text-sm mt-2">
          Il vous manque {fmtPrice(missingTND)} TND
        </p>
      </div>
      <button
        onClick={() => closeCart()}
        className="px-5 py-2.5 rounded-xl border border-warm/12 text-warm/50 hover:text-warm text-sm transition-colors cursor-pointer"
      >
        Compléter mon panier
      </button>
      <button
        onClick={() => goTo(2)}
        className="text-warm/30 hover:text-warm/55 text-sm transition-colors cursor-pointer"
      >
        ← Changer de méthode
      </button>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-warm/3 border border-warm/8 rounded-xl p-3.5 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-warm/40">
        <span>Articles ({totalItems})</span>
        <span>{fmtPrice(totalPrice)} TND</span>
      </div>
      {deliveryFeeApplies && (
        <div className="flex items-center justify-between text-xs text-warm/40">
          <span>Livraison</span>
          <span>+{fmtPrice(DELIVERY_FEE)} TND</span>
        </div>
      )}
      <div className="border-t border-warm/10 pt-2 flex items-center justify-between">
        <span className="font-semibold text-warm text-sm">Total</span>
        <span className="font-playfair font-bold text-warm text-base">
          {fmtPrice(grandTotal)}
          <span className="text-warm/35 text-xs font-normal ml-1">TND</span>
        </span>
      </div>
    </div>
  );

  const renderSendButton = () => (
    <>
      {renderOrderSummary()}
      <motion.button
        whileHover={canSend ? { scale: 1.02 } : {}}
        whileTap={canSend  ? { scale: 0.97 } : {}}
        onClick={canSend ? handleOrder : undefined}
        disabled={!canSend}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: sent ? '#22c55e' : '#25D366' }}
      >
        {sent ? <CheckCircleIcon /> : <WhatsAppIcon />}
        {sent ? 'Commande envoyée !' : 'Commander via WhatsApp'}
      </motion.button>
      <p className="text-warm/20 text-[10px] text-center leading-relaxed">
        Votre commande sera transmise par WhatsApp pour confirmation
      </p>
    </>
  );

  const renderStep3Pickup = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0 flex flex-col gap-4">
        <p className="text-warm/40 text-xs font-medium uppercase tracking-widest text-center">
          Choisissez un point de retrait
        </p>

        {/* Store cards */}
        <div className="flex flex-col gap-3">
          {STORES.map(s => {
            const selected = store === s.id;
            return (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStore(s.id)}
                className="flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: selected ? '#FF5A1F' : '#1A0A0012',
                  background:  selected ? '#FF5A1F08' : '#ffffff',
                  boxShadow:   selected ? '0 4px 18px #FF5A1F18' : undefined,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: selected ? '#FF5A1F15' : '#1A0A0006' }}
                >
                  {s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-warm text-sm leading-tight">{s.name}</p>
                  <p className="text-warm/40 text-[11px] mt-0.5">📍 {s.address}</p>
                  <p className="text-warm/35 text-[11px]">🕐 8h – 21h</p>
                </div>
                {selected && (
                  <div className="w-5 h-5 rounded-full bg-coral flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <input type="text"    placeholder="Votre nom"        value={name}  onChange={e => setName(e.target.value)}  className={inputCls} />
          <input type="tel"     placeholder="Numéro WhatsApp"  value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
        </div>

        {renderSendButton()}
      </div>
    </div>
  );

  const renderStep3Sfax = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0 flex flex-col gap-4">
        {/* Zone badge */}
        <div className="flex items-center gap-2.5 bg-teal/8 border border-teal/20 rounded-xl px-3.5 py-2.5">
          <span className="text-xl">🛵</span>
          <div>
            <p className="text-[#18A88A] font-semibold text-xs">Zone de livraison</p>
            <p className="text-warm/40 text-[11px]">≤ 10 km du centre de Sfax · Frais : 7,000 TND</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Votre adresse complète (rue, quartier…)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
          />
          <input type="text" placeholder="Votre nom"       value={name}  onChange={e => setName(e.target.value)}  className={inputCls} />
          <input type="tel"  placeholder="Numéro WhatsApp" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
        </div>

        {renderSendButton()}
      </div>
    </div>
  );

  const renderStep3National = () => {
    if (hasIneligible) return renderNationalGuard();
    if (items.length === 0) return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-5">
        <p className="font-playfair text-warm/40 text-base">Panier vide</p>
        <p className="text-warm/25 text-xs">Ajoutez des Bouteilles 1L ou Palettes 1L</p>
        <button onClick={() => goTo(2)} className="text-coral text-sm cursor-pointer">← Changer de méthode</button>
      </div>
    );
    if (belowMin) return renderNationalMinWarning();

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0 flex flex-col gap-4">
          {/* Notice badge */}
          <div className="flex items-center gap-2.5 bg-sunny/10 border border-sunny/30 rounded-xl px-3.5 py-2.5">
            <span className="text-xl">📦</span>
            <div>
              <p className="text-[#B8860B] font-semibold text-xs">Livraison Nationale</p>
              <p className="text-warm/40 text-[11px]">Bouteilles 1L · Palettes 1L · Min. {fmtPrice(NATIONAL_MIN)} TND</p>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-2">
            <select
              value={wilaya}
              onChange={e => setWilaya(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              <option value="">Sélectionner votre gouvernorat…</option>
              {WILAYAS.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <textarea
              placeholder="Adresse complète (rue, cité, code postal…)"
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
            />
            <input type="text" placeholder="Votre nom"       value={name}  onChange={e => setName(e.target.value)}  className={inputCls} />
            <input type="tel"  placeholder="Numéro WhatsApp" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
          </div>

          {renderSendButton()}
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    if (method === 'pickup')   return renderStep3Pickup();
    if (method === 'sfax')     return renderStep3Sfax();
    if (method === 'national') return renderStep3National();
    return null;
  };

  const stepTitles: Record<number, string> = {
    1: 'Mon Panier',
    2: 'Mode de livraison',
    3: method === 'pickup'   ? 'Retrait en magasin'
     : method === 'sfax'     ? 'Livraison Sfax'
     : method === 'national' ? 'Livraison Nationale'
     : 'Détails',
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-warm/25 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-[22rem] bg-[#FFFBF5] shadow-2xl shadow-warm/15 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button
                    onClick={() => goTo(step - 1)}
                    className="w-7 h-7 flex items-center justify-center text-warm/40 hover:text-warm rounded-full hover:bg-warm/6 transition-all cursor-pointer"
                  >
                    <ArrowLeftIcon />
                  </button>
                )}
                <div>
                  <h2 className="font-playfair text-warm font-bold text-lg leading-tight">
                    {stepTitles[step]}
                  </h2>
                  {step === 1 && totalItems > 0 && (
                    <p className="text-warm/35 text-[11px] mt-0.5">
                      {totalItems} article{totalItems > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {step === 1 && items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-warm/30 hover:text-coral text-xs px-2.5 py-1.5 rounded-lg hover:bg-coral/5 transition-all cursor-pointer"
                  >
                    Vider
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-8 h-8 flex items-center justify-center text-warm/40 hover:text-warm rounded-full hover:bg-warm/6 transition-all cursor-pointer"
                >
                  <XIcon />
                </button>
              </div>
            </div>

            {/* Step dots */}
            <div className="px-5 pb-2 flex-shrink-0">
              <StepDots step={step} />
            </div>

            {/* Divider */}
            <div className="h-px bg-warm/8 flex-shrink-0 mx-5" />

            {/* Animated step content */}
            <div className="flex-1 min-h-0 relative overflow-hidden">
              <AnimatePresence custom={dir} mode="wait">
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col"
                >
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
