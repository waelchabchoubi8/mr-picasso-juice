# AIT Juice

Premium artisanal juice store — Tunis, Tunisia.

## Stack

| Package | Version | Role |
|---|---|---|
| Next.js | 15.5.18 | App Router, SSG |
| React | 19.2.6 | UI |
| Framer Motion | 12.40.0 | Animations, spring physics |
| next-intl | 3.26.5 | FR/EN i18n |
| Tailwind CSS | 3.4.17 | Styling |

> **No WebGL / Three.js** — fully removed. All visuals are CSS + SVG + Framer Motion.

---

## Project Structure

```
src/
├── middleware.ts
├── navigation.ts                → next-intl navigation helpers
├── i18n/
│   ├── routing.ts               → defineRouting(['fr','en'], default: 'fr')
│   └── request.ts               → getRequestConfig
├── app/
│   ├── globals.css              → Tailwind + keyframes (fruitFloat, morphBlob, marquee)
│   └── [locale]/
│       ├── layout.tsx           → Root layout: fonts + CustomCursor + FruitBackground
│       └── page.tsx             → Full page assembly
└── components/
    ├── AboutSection.tsx         → Story, stats grid, 3 value cards (id="about")
    ├── CustomCursor.tsx         → Coral dot cursor, stiffness:900 (desktop only)
    ├── Footer.tsx               → Dark footer: brand, nav, hours, contact, socials
    ├── FruitBackground.tsx      → 8 SVG fruit illustrations, CSS float, responsive sizes
    ├── HeroSection.tsx          → Hero: desktop fruit scene + mobile fruit row
    ├── JuiceMenu.tsx            → Catalogue tabs: Bouteille 1L / Grand Cup / Petit Cup
    ├── LoadingScreen.tsx        → Juice-pour glass loader (every visit, curtain exit)
    ├── MarqueeTicker.tsx        → Pure CSS scrolling text ticker
    ├── Navbar.tsx               → Glassmorphism navbar + magnetic CTA + FR/EN toggle
    ├── PageWrapper.tsx          → AnimatePresence wrapper for LoadingScreen
    ├── PicassoPalette.tsx       → Fruit mixer + animated SVG bottle fill
    ├── Testimonials.tsx         → 4 customer review cards with star ratings
    ├── WhatsAppButton.tsx       → Fixed WhatsApp CTA button (bottom-right)
    └── ui/
        └── morphic-background.tsx  → CSS blob BG (available, not mounted)

messages/
├── fr.json                      → French strings (default)
└── en.json                      → English strings
```

---

## Page Order

```
Navbar (fixed)
├── HeroSection          → Floating fruits (desktop: 7-fruit scene / mobile: 4-fruit row)
├── MarqueeTicker        → "Pressé à la minute · 100% Naturel · Tunis · ..."
├── JuiceMenu            → Catalogue: Bouteille 1L / Grand Cup / Petit Cup + TND prices
├── Testimonials         → 4 customer reviews
├── PicassoPalette       → Pick up to 3 fruits → animated bottle fills
├── AboutSection         → Story, 4 stats, 3 value cards
└── Footer               → Address · Hours · Contact · Socials · WhatsApp CTA
WhatsAppButton (fixed)
```

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `coral` | `#FF5A1F` | Primary CTA, Bouteille accent |
| `sunny` | `#FFD34E` | Grand Cup accent, stars |
| `teal` | `#3ECFB0` | Petit Cup accent |
| `lime` | `#7ED95A` | Fresh/nature accent |
| `cream` | `#FFFBF5` | Page background |
| `warm` | `#1A0A00` | Body text, footer bg |
| `font-playfair` | Playfair Display | Headings (editorial) |
| `font-inter` | Inter | Body text |

---

## Prices (TND)

| Format | Range |
|---|---|
| Bouteille 1L | 12.000 – 14.000 TND |
| Grand Cup 500ml | 7.000 – 7.500 TND |
| Petit Cup 250ml | 4.500 – 5.000 TND |

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `< 640px` (mobile) | Single column, reduced padding, fruit row in hero, Order Now hidden in navbar |
| `640–1024px` (tablet) | 2-column grids, medium spacing |
| `> 1024px` (desktop) | Full layout, desktop fruit scene in hero |

---

## ⚠️ Before Launch — Replace Placeholders

| File | Placeholder | Replace with |
|---|---|---|
| `WhatsAppButton.tsx` | `PHONE = '21600000000'` | Real WhatsApp number |
| `Footer.tsx` | `Votre adresse, Tunis` | Real store address |
| `Footer.tsx` | `+216 00 000 000` | Real phone number |
| `Footer.tsx` | `contact@aitjuice.tn` | Real email |
| `Footer.tsx` | Social `href="#"` | Real Instagram/Facebook/TikTok URLs |

---

## Key Technical Notes

### Trig Hydration Fix
All `Math.cos/sin` pre-computed at **module level** with `Math.round(n * 10) / 10`.
Prevents server/client floating-point string mismatches.

### FruitBackground
Pure CSS `@keyframes fruitFloat`. Zero JS. Each fruit has unique `duration`, `delay`, `--dy`, `--rot`.
Mouse dodge was removed — `fixed + overflow-hidden` clipped the movement.

### LoadingScreen
Shows on **every visit**. Glass fills coral→yellow over 2.4s. Curtain wipe exit.

### Custom Cursor
`stiffness:900, damping:60` — instant. Hidden on touch via `matchMedia('pointer:coarse')`.

---

## i18n
Default: **FR**. Toggle in navbar. Routes: `/fr/*` and `/en/*`.

## Getting Started

```bash
npm install
npm run dev      # → http://localhost:3000
npm run build
```
