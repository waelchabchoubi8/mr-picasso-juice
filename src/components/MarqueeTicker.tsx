'use client';

const ITEMS = [
  'Cuisiné comme à la maison',
  '100% Traditionnel',
  'Sfax · Tunisie',
  'Soltana Pro Max',
  'Sans Conservateurs',
  'Recettes Authentiques',
  'Mloukhiya · Chakchouka · Ojja',
  'La Tradition en Conserve',
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
