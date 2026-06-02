'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Replace with your real WhatsApp number (country code + number, no +)
const PHONE = '21600000000';
const MSG   = encodeURIComponent('Bonjour AIT Juice 🍊 Je souhaite passer une commande.');

export function WhatsAppButton() {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {!footerVisible && (
        <motion.a
          key="whatsapp-btn"
          href={`https://wa.me/${PHONE}?text=${MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Commander via WhatsApp"
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
          style={{ background: '#25D366', boxShadow: '0 4px 24px #25D36655' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.93 }}
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.402A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.958 7.958 0 01-4.078-1.117l-.292-.174-3.027.852.887-3.1-.19-.316A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.884c-.242-.121-1.43-.706-1.651-.786-.221-.08-.382-.121-.543.121-.16.242-.624.786-.765.948-.14.162-.281.182-.523.061-.242-.121-1.022-.377-1.946-1.2-.719-.641-1.204-1.432-1.345-1.674-.14-.242-.015-.373.106-.494.109-.109.242-.282.363-.423.121-.14.16-.242.242-.403.08-.161.04-.302-.02-.423-.061-.121-.543-1.311-.744-1.795-.197-.471-.397-.407-.543-.415-.14-.007-.302-.009-.463-.009-.16 0-.423.061-.645.302-.221.242-.845.826-.845 2.014s.865 2.335.986 2.496c.121.16 1.705 2.604 4.132 3.651.578.25 1.029.398 1.38.51.58.185 1.107.159 1.524.096.465-.07 1.43-.585 1.632-1.15.2-.564.2-1.047.14-1.15-.06-.1-.221-.16-.463-.282z"/>
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
