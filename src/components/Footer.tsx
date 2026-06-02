import { Link } from '@/navigation';

const HOURS = [
  { day: 'Lundi — Vendredi', time: '08h00 — 20h00' },
  { day: 'Samedi',            time: '08h00 — 22h00' },
  { day: 'Dimanche',          time: '09h00 — 18h00' },
];

const SOCIALS = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-warm text-white/70 pt-12 lg:pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 lg:pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-coral to-sunny flex items-center justify-center shadow-md">
                <span className="text-white font-playfair font-bold text-base">A</span>
              </div>
              <div>
                <p className="font-playfair text-white font-semibold text-sm leading-tight">AIT Juice</p>
                <p className="text-white/35 text-xs">Tunis, Tunisie</p>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed">
              Jus artisanaux pressés à la minute.<br />
              L&apos;art du jus frais depuis 2020.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-5">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/[0.07] hover:bg-coral/80 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Menu links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Accueil', href: '/' },
                { label: 'Notre Carte', href: '/#menu' },
                { label: 'Palette AIT', href: '/#palette' },
                { label: 'Notre Histoire', href: '/#about' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/50 hover:text-white text-sm transition-colors duration-200 cursor-pointer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Horaires</h4>
            <ul className="space-y-2.5">
              {HOURS.map(h => (
                <li key={h.day} className="text-sm">
                  <p className="text-white/50">{h.day}</p>
                  <p className="text-white/80 font-medium">{h.time}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2.5 items-start">
                <svg className="mt-0.5 flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-white/50 leading-relaxed">Votre adresse, Tunis<br/>Tunisie</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <svg className="flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6.08 6.08l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                </svg>
                <a href="tel:+21600000000" className="text-white/50 hover:text-white transition-colors cursor-pointer">
                  +216 00 000 000
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <svg className="flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:contact@aitjuice.tn" className="text-white/50 hover:text-white transition-colors cursor-pointer text-xs">
                  contact@aitjuice.tn
                </a>
              </li>
            </ul>

            <a
              href={`https://wa.me/21600000000?text=${encodeURIComponent('Bonjour AIT Juice, je voudrais commander.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold px-4 py-2 rounded-full transition-colors duration-200 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.402A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.406 13.616c-.242-.121-1.43-.706-1.651-.786-.221-.08-.382-.121-.543.121-.16.242-.624.786-.765.948-.14.162-.281.182-.523.061-.242-.121-1.022-.377-1.946-1.2-.719-.641-1.204-1.432-1.345-1.674-.14-.242-.015-.373.106-.494.109-.109.242-.282.363-.423.121-.14.16-.242.242-.403.08-.161.04-.302-.02-.423-.061-.121-.543-1.311-.744-1.795-.197-.471-.397-.407-.543-.415-.14-.007-.302-.009-.463-.009-.16 0-.423.061-.645.302-.221.242-.845.826-.845 2.014s.865 2.335.986 2.496c.121.16 1.705 2.604 4.132 3.651.578.25 1.029.398 1.38.51.58.185 1.107.159 1.524.096.465-.07 1.43-.585 1.632-1.15.2-.564.2-1.047.14-1.15-.06-.1-.221-.16-.463-.282z"/>
              </svg>
              Commander sur WhatsApp
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>© 2025 AIT Juice · Tunis, Tunisie · Tous droits réservés</p>
          <a
            href="https://ait-tun.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/25 hover:text-white/60 transition-colors duration-200 group"
          >
            <span>Conçu &amp; développé par</span>
            {/* AIT logo */}
            <span className="flex items-center gap-1.5">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50 group-hover:opacity-90 transition-opacity">
                <circle cx="20" cy="20" r="20" fill="#FFFFFF" fillOpacity="0.15"/>
                <text x="20" y="26" textAnchor="middle" fill="white" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="16">a.</text>
              </svg>
              <span className="font-semibold tracking-wide text-white/40 group-hover:text-white/70 transition-colors">AIT</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
