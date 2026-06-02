// Static decorative food illustrations with gentle CSS float animations.
// No JS, no event listeners — pure CSS keyframes (fruitFloat) on each shape.

const float = (dur: string, delay: string, dy = 12, rot = 4) =>
  ({
    animation: `fruitFloat ${dur} ease-in-out infinite ${delay}`,
    '--dy': `${dy}px`,
    '--rot': `${rot}deg`,
  } as React.CSSProperties);

const RED = '#CE2029';
const GOLD = '#FFD34E';
const GREEN = '#7ED95A';

export function FruitBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>

      {/* Tin can — top right */}
      <div className="absolute -top-6 -right-6" style={float('9s', '0s', 10, 5)}>
        <svg viewBox="0 0 120 160" className="w-28 h-36 sm:w-36 sm:h-48 lg:w-44 lg:h-56 opacity-[0.10]" fill="none">
          <path d="M22 32 L22 128 C22 142 38 148 60 148 C82 148 98 142 98 128 L98 32 Z" stroke={RED} strokeWidth="3" />
          <ellipse cx="60" cy="32" rx="38" ry="12" stroke={RED} strokeWidth="2.5" />
          <path d="M22 70 L98 70 M22 110 L98 110" stroke={RED} strokeWidth="1.8" />
        </svg>
      </div>

      {/* Tagine — top left */}
      <div className="absolute top-24 -left-8 -rotate-6" style={float('11s', '-3s', 14, 6)}>
        <svg viewBox="0 0 160 160" className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 opacity-[0.10]" fill="none">
          <path d="M42 104 C50 36 110 36 118 104 Z" stroke={RED} strokeWidth="2.8" />
          <circle cx="80" cy="30" r="8" stroke={RED} strokeWidth="2.2" />
          <ellipse cx="80" cy="104" rx="52" ry="12" stroke={RED} strokeWidth="2.6" />
          <path d="M30 104 C30 128 50 138 80 138 C110 138 130 128 130 104" stroke={RED} strokeWidth="2.6" />
        </svg>
      </div>

      {/* Chili — mid right */}
      <div className="absolute top-1/3 -right-2 rotate-12" style={float('7s', '-5s', 10, 8)}>
        <svg viewBox="0 0 100 140" className="w-14 h-20 sm:w-16 sm:h-24 lg:w-20 lg:h-28 opacity-[0.11]" fill="none">
          <path d="M44 28 C66 36 70 64 64 92 C58 118 44 130 34 128 C26 126 30 104 34 84 C38 60 40 38 44 28 Z" stroke={RED} strokeWidth="2.5" />
          <path d="M44 28 C44 12 54 6 64 12" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Olive sprig — mid left */}
      <div className="absolute top-1/2 -left-4 rotate-[12deg]" style={float('13s', '-8s', 8, 4)}>
        <svg viewBox="0 0 130 110" className="w-28 h-24 lg:w-36 lg:h-28 opacity-[0.10]" fill="none">
          <path d="M14 22 C50 30 92 44 120 86" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="58" cy="40" rx="11" ry="14" transform="rotate(28 58 40)" stroke={GREEN} strokeWidth="2" />
          <ellipse cx="90" cy="58" rx="11" ry="14" transform="rotate(32 90 58)" stroke="#3ECFB0" strokeWidth="2" />
          <ellipse cx="112" cy="82" rx="10" ry="13" transform="rotate(38 112 82)" stroke={GREEN} strokeWidth="2" />
        </svg>
      </div>

      {/* Couscous bowl — bottom right */}
      <div className="absolute bottom-16 right-12 -rotate-6" style={float('10s', '-2s', 12, 7)}>
        <svg viewBox="0 0 150 110" className="w-28 h-20 lg:w-36 lg:h-28 opacity-[0.10]" fill="none">
          <path d="M30 56 C36 30 114 30 120 56 Z" stroke={GOLD} strokeWidth="2.4" />
          <ellipse cx="75" cy="56" rx="55" ry="12" stroke={RED} strokeWidth="2.6" />
          <path d="M22 56 C22 86 42 100 75 100 C108 100 128 86 128 56" stroke={RED} strokeWidth="2.6" />
        </svg>
      </div>

      {/* Star (from the logo) — bottom left */}
      <div className="absolute -bottom-2 left-6 rotate-[15deg]" style={float('15s', '-6s', 9, 5)}>
        <svg viewBox="0 0 100 100" className="w-24 h-24 lg:w-32 lg:h-32 opacity-[0.09]" fill="none">
          <path d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z" stroke={RED} strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Small jar — bottom center */}
      <div className="absolute bottom-8 left-1/3 rotate-[6deg]" style={float('8s', '-4s', 11, 6)}>
        <svg viewBox="0 0 100 120" className="w-16 h-20 lg:w-20 lg:h-24 opacity-[0.09]" fill="none">
          <rect x="24" y="34" width="52" height="74" rx="10" stroke={GOLD} strokeWidth="2.4" />
          <rect x="30" y="22" width="40" height="16" rx="5" stroke={GOLD} strokeWidth="2.2" />
          <path d="M24 64 L76 64" stroke={GOLD} strokeWidth="1.6" />
        </svg>
      </div>

      {/* Small chili — upper center */}
      <div className="absolute top-12 left-1/2 rotate-[35deg]" style={float('6s', '-1s', 13, 9)}>
        <svg viewBox="0 0 100 140" className="w-12 h-16 lg:w-14 lg:h-20 opacity-[0.09]" fill="none">
          <path d="M44 28 C66 36 70 64 64 92 C58 118 44 130 34 128 C26 126 30 104 34 84 C38 60 40 38 44 28 Z" stroke={RED} strokeWidth="2.5" />
          <path d="M44 28 C44 12 54 6 64 12" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

    </div>
  );
}
