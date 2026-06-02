'use client';

const ITEMS = [
  'Pâtisserie d\'Exception',
  'Depuis 1969',
  'Sfax · Tunisie',
  'Masmoudi',
  'Pistache d\'Alep',
  'Baklawa · Makroud · Mlabes',
  'Fait Main',
  'Coffrets sur Mesure',
  'Livraison partout en Tunisie',
];

const SEP = '·';

export function MarqueeTicker() {
  const items = [...ITEMS, ...ITEMS]; // duplicate for seamless loop

  return (
    <div className="relative w-full overflow-hidden border-y border-warm/8 py-3 bg-white/40">
      <div className="flex items-center gap-0 animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-5 px-5">
            <span className="text-warm/55 text-xs font-medium tracking-[0.18em] uppercase">
              {item}
            </span>
            <span className="text-coral/40 text-xs">{SEP}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
