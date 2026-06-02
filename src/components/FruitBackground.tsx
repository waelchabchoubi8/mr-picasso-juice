// Static decorative fruit illustrations with gentle CSS float animations.
// No JS, no event listeners — pure CSS keyframes on each fruit.

const r1 = (n: number) => Math.round(n * 10) / 10;

const BIG_ORANGE   = [0,60,120,180,240,300].map(a=>{const rad=(a*Math.PI)/180;return{x1:r1(80+24*Math.cos(rad)),y1:r1(80+24*Math.sin(rad)),x2:r1(80+72*Math.cos(rad)),y2:r1(80+72*Math.sin(rad))};});
const SMALL_ORANGE = [30,90,150,210,270,330].map(a=>{const rad=(a*Math.PI)/180;return{x1:r1(60+18*Math.cos(rad)),y1:r1(60+18*Math.sin(rad)),x2:r1(60+52*Math.cos(rad)),y2:r1(60+52*Math.sin(rad))};});
const HALF_LEMON   = [-60,-20,20,60].map(a=>{const rad=(a*Math.PI)/180;return{x1:r1(70+18*Math.cos(rad)),y1:r1(70+18*Math.sin(rad)),x2:r1(70+52*Math.cos(rad)),y2:r1(70+52*Math.sin(rad))};});
const TINY_ORANGE  = [0,72,144,216,288].map(a=>{const rad=(a*Math.PI)/180;return{x1:r1(40+12*Math.cos(rad)),y1:r1(40+12*Math.sin(rad)),x2:r1(40+34*Math.cos(rad)),y2:r1(40+34*Math.sin(rad))};});

// Each fruit gets a unique animation config for organic movement
const float = (dur: string, delay: string, dy = 12, rot = 4) =>
  ({
    animation: `fruitFloat ${dur} ease-in-out infinite ${delay}`,
    '--dy': `${dy}px`,
    '--rot': `${rot}deg`,
  } as React.CSSProperties);

export function FruitBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>

      <div className="absolute -top-8 -right-8" style={float('9s','0s',10,5)}>
        <svg viewBox="0 0 160 160" className="w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56 opacity-[0.12]" fill="none">
          <circle cx="80" cy="80" r="72" stroke="#6C5CE7" strokeWidth="3"/>
          <circle cx="80" cy="80" r="24" stroke="#6C5CE7" strokeWidth="2"/>
          {BIG_ORANGE.map((l,i)=><line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#6C5CE7" strokeWidth="1.5"/>)}
        </svg>
      </div>

      <div className="absolute top-24 -left-6 -rotate-12" style={float('11s','-3s',14,6)}>
        <svg viewBox="0 0 140 100" className="w-24 h-16 sm:w-32 sm:h-22 lg:w-40 lg:h-28 opacity-[0.11]" fill="none">
          <ellipse cx="70" cy="50" rx="60" ry="38" stroke="#FFD34E" strokeWidth="2.5"/>
          <path d="M10 50 Q70 20 130 50 Q70 80 10 50Z" stroke="#FFD34E" strokeWidth="1.5"/>
          <circle cx="70" cy="50" r="12" stroke="#FFD34E" strokeWidth="1.5"/>
          <path d="M70 12 Q85 2 88 12" stroke="#FFD34E" strokeWidth="2" strokeLinecap="round"/>
          <path d="M70 88 Q55 98 52 88" stroke="#FFD34E" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="absolute top-1/3 -right-4 rotate-12" style={float('7s','-5s',10,8)}>
        <svg viewBox="0 0 100 120" className="w-16 h-20 sm:w-20 sm:h-26 lg:w-28 lg:h-36 opacity-[0.11]" fill="none">
          <path d="M50 110 C20 85 8 60 12 38 C16 18 34 10 50 18 C66 10 84 18 88 38 C92 60 80 85 50 110Z" stroke="#6C5CE7" strokeWidth="2"/>
          {[[38,45],[55,38],[48,60],[62,58],[38,68],[55,72]].map(([x,y],i)=>(
            <ellipse key={i} cx={x} cy={y} rx="2.5" ry="3" stroke="#6C5CE7" strokeWidth="1.2"/>
          ))}
          <path d="M50 18 C45 5 30 2 28 12" stroke="#7ED95A" strokeWidth="2" strokeLinecap="round"/>
          <path d="M50 18 C52 3 65 0 68 10"  stroke="#7ED95A" strokeWidth="2" strokeLinecap="round"/>
          <path d="M50 18 L50 8"              stroke="#7ED95A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="absolute top-1/2 -left-4 rotate-[20deg]" style={float('13s','-8s',8,4)}>
        <svg viewBox="0 0 120 120" className="w-32 h-32 opacity-[0.10]" fill="none">
          <circle cx="60" cy="60" r="52" stroke="#FF8C42" strokeWidth="2.5"/>
          <circle cx="60" cy="60" r="18" stroke="#FF8C42" strokeWidth="1.5"/>
          {SMALL_ORANGE.map((l,i)=><line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#FF8C42" strokeWidth="1.2"/>)}
        </svg>
      </div>

      <div className="absolute bottom-16 right-12 -rotate-[25deg]" style={float('10s','-2s',12,7)}>
        <svg viewBox="0 0 110 150" className="w-28 h-40 opacity-[0.11]" fill="none">
          <path d="M55 8 C80 8 100 35 100 65 C100 100 80 135 55 142 C30 135 10 100 10 65 C10 35 30 8 55 8Z" stroke="#FFD34E" strokeWidth="2.5"/>
          <path d="M55 8 C65 30 68 60 60 90 C55 110 50 130 55 142" stroke="#FFD34E" strokeWidth="1.5"/>
          <path d="M30 30 C45 40 60 38 80 32" stroke="#FFD34E" strokeWidth="1.2"/>
          <path d="M18 65 C35 70 65 70 92 65"  stroke="#FFD34E" strokeWidth="1.2"/>
          <path d="M22 95 C38 98 68 98 88 95"  stroke="#FFD34E" strokeWidth="1.2"/>
          <path d="M55 2 Q62 -6 68 2" stroke="#7ED95A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="absolute -bottom-4 -left-4 rotate-[15deg]" style={float('15s','-6s',9,5)}>
        <svg viewBox="0 0 120 100" className="w-36 h-28 opacity-[0.11]" fill="none">
          <path d="M20 80 C10 40 40 10 70 20 C60 50 30 60 20 80Z" stroke="#7ED95A" strokeWidth="2"/>
          <path d="M20 80 C25 55 50 40 70 20"  stroke="#7ED95A" strokeWidth="1.5"/>
          <path d="M60 75 C55 40 80 12 105 25 C90 55 65 62 60 75Z" stroke="#7ED95A" strokeWidth="2"/>
          <path d="M60 75 C68 52 88 38 105 25"  stroke="#7ED95A" strokeWidth="1.5"/>
          <path d="M20 80 Q40 90 60 75" stroke="#7ED95A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="absolute bottom-8 left-1/3 rotate-[8deg]" style={float('8s','-4s',11,6)}>
        <svg viewBox="0 0 140 80" className="w-32 h-20 opacity-[0.10]" fill="none">
          <path d="M10 70 C10 30 40 8 70 8 C100 8 130 30 130 70Z" stroke="#FFD34E" strokeWidth="2.5"/>
          <line x1="10" y1="70" x2="130" y2="70" stroke="#FFD34E" strokeWidth="2"/>
          <circle cx="70" cy="70" r="18" stroke="#FFD34E" strokeWidth="1.5"/>
          {HALF_LEMON.map((l,i)=><line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#FFD34E" strokeWidth="1"/>)}
        </svg>
      </div>

      <div className="absolute top-12 left-1/2 rotate-[35deg]" style={float('6s','-1s',13,9)}>
        <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-[0.10]" fill="none">
          <circle cx="40" cy="40" r="34" stroke="#6C5CE7" strokeWidth="2"/>
          <circle cx="40" cy="40" r="12" stroke="#6C5CE7" strokeWidth="1.5"/>
          {TINY_ORANGE.map((l,i)=><line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#6C5CE7" strokeWidth="1.2"/>)}
        </svg>
      </div>

    </div>
  );
}
