'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, CartItem } from './CartContext';

const WHATSAPP_NUMBER = '21600000000';

function fmtPrice(n: number) {
  return n.toFixed(3).replace('.', ',');
}

function buildMessage(items: CartItem[], name: string, phone: string, total: number) {
  const lines = items.map(i => {
    const fruits = i.fruits?.length ? ` (${i.fruits.join(' × ')})` : '';
    return `• ${i.qty}x ${i.name}${fruits} — ${fmtPrice(i.price * i.qty)} TND`;
  });
  return [
    'Bonjour Mr. Picasso Juice! 🎨',
    '',
    `Commande de ${name || 'Client'}${phone ? ` (${phone})` : ''} :`,
    '',
    ...lines,
    '',
    `Total : ${fmtPrice(total)} TND`,
    '',
    'Merci ! 🍊',
  ].join('\n');
}

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

export default function CartDrawer() {
  const { items, open, totalItems, totalPrice, removeItem, setQty, clearCart, closeCart } = useCart();
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent]   = useState(false);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleOrder = () => {
    const msg = buildMessage(items, name, phone, totalPrice);
    const url  = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

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
            <div className="flex items-center justify-between px-5 py-4 border-b border-warm/8 flex-shrink-0">
              <div>
                <h2 className="font-playfair text-warm font-bold text-lg leading-tight">Mon Panier</h2>
                {totalItems > 0 && (
                  <p className="text-warm/35 text-[11px] mt-0.5">
                    {totalItems} article{totalItems > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
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

            {/* Items list */}
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
                        {/* Accent bar */}
                        <div
                          className="w-1.5 h-10 rounded-full flex-shrink-0"
                          style={{ background: item.color }}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-warm font-semibold text-[13px] truncate leading-tight">{item.name}</p>
                          <p className="text-warm/35 text-[10px] leading-tight mt-0.5">{item.format}</p>
                          {item.fruits && item.fruits.length > 0 && (
                            <p className="text-warm/25 text-[9px] truncate mt-0.5">{item.fruits.join(' × ')}</p>
                          )}
                        </div>

                        {/* Qty controls */}
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

                        {/* Price + remove */}
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

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-warm/8 px-5 py-4 flex flex-col gap-3.5 flex-shrink-0">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-warm/45 text-sm font-medium">Total</span>
                  <span className="font-playfair font-bold text-warm text-xl">
                    {fmtPrice(totalPrice)}
                    <span className="text-warm/40 text-sm font-normal ml-1">TND</span>
                  </span>
                </div>

                {/* Order form */}
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-warm/10 rounded-xl text-base sm:text-sm text-warm placeholder-warm/30 focus:outline-none focus:border-coral/40 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Numéro WhatsApp"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-warm/10 rounded-xl text-base sm:text-sm text-warm placeholder-warm/30 focus:outline-none focus:border-coral/40 transition-colors"
                  />
                </div>

                {/* WhatsApp CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOrder}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white text-sm transition-colors duration-300 cursor-pointer"
                  style={{ background: sent ? '#22c55e' : '#25D366' }}
                >
                  {sent ? <CheckCircleIcon /> : <WhatsAppIcon />}
                  {sent ? 'Commande envoyée !' : 'Commander via WhatsApp'}
                </motion.button>

                <p className="text-warm/22 text-[10px] text-center leading-relaxed">
                  Votre commande sera transmise par WhatsApp pour confirmation
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
