# Mr. Picasso Juice — Claude Context

Premium artisanal juice store for **Tunis, Tunisia**.

## Commands

```bash
npm run dev      # Start dev server → http://localhost:3000
npm run build    # Production build
npx tsc --noEmit # TypeScript check (run before reporting done)
```

## Stack
- **Next.js 15** App Router (Server + Client components)
- **React 19** — no class components except ErrorBoundary
- **Framer Motion 12** — animations, springs, variants
- **next-intl 3** — i18n, FR default / EN secondary
- **Tailwind CSS 3** — utility-first, custom tokens in `tailwind.config.ts`
- **NO WebGL / Three.js** — removed for performance

## Project structure
```
src/
  app/[locale]/      → layout.tsx (fonts + cursor + fruit bg + CartProvider) + page.tsx
  components/
    CartContext.tsx  → useReducer cart state + CartProvider + useCart hook (localStorage)
    CartDrawer.tsx   → slide-out cart panel (items, qty, form, WhatsApp CTA)
    Navbar.tsx       → cart icon + badge (opens drawer)
    JuiceMenu.tsx    → + button wired to addItem (always visible on mobile)
    PicassoPalette.tsx → Order button wired to addItem + openCart
    ...all other UI components
  i18n/              → routing.ts + request.ts
  navigation.ts      → createNavigation exports
  middleware.ts      → locale detection
messages/            → fr.json (default) + en.json
```

## Design tokens (Tailwind)
| Class | Hex | Use |
|---|---|---|
| `bg-coral` / `text-coral` | `#FF5A1F` | Primary CTA |
| `bg-sunny` | `#FFD34E` | Grand Cup accent |
| `bg-teal` | `#3ECFB0` | Petit Cup accent |
| `bg-lime` | `#7ED95A` | Nature accent |
| `bg-cream` | `#FFFBF5` | Page background |
| `text-warm` / `bg-warm` | `#1A0A00` | Body text, footer |
| `font-playfair` | Playfair Display | Headings |
| `font-inter` | Inter | Body |

## Key patterns

### Always run tsc before finishing
```bash
npx tsc --noEmit
```

### Trig hydration fix (CRITICAL)
Never use `Math.cos/sin` inside JSX render — always pre-compute at **module level**:
```ts
const LINES = [0,60,120].map(a => {
  const r = (a * Math.PI) / 180;
  return { x: Math.round(Math.cos(r) * 10) / 10 };
});
```
Prevents server/client float mismatch in SVG attributes.

### FM12 + React 19 ref pattern
Put `ref` on plain `<div>`, NOT on `<motion.div>`:
```tsx
<div ref={anchorRef} className="...positioning...">
  <motion.div style={{ x, y }}>...</motion.div>
</div>
```

### Adding new sections
1. Create component in `src/components/`
2. Add strings to `messages/fr.json` AND `messages/en.json`
3. Import in `src/app/[locale]/page.tsx`
4. Use responsive padding: `py-16 lg:py-28 px-4 sm:px-6`

### i18n locale switching
```tsx
import { useRouter, usePathname } from '@/navigation';
router.push(pathname, { locale: 'en' });
```

## Responsive rules
- Mobile first: `py-16 lg:py-28`, `px-4 sm:px-6`
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-N`
- Hero right column: `hidden lg:block` — mobile fruit row uses `lg:hidden`
- Navbar CTA: `hidden sm:flex` on mobile

## Cart

### CartItem shape
```ts
{ id, name, format, price: number, qty, color, fruits?: string[] }
```

### Adding items from a new component
```tsx
import { useCart } from './CartContext';
const { addItem, openCart } = useCart();
addItem({ id: 'unique-id', name, format: 'Label · size', price: 7.5, color: '#hex' });
```

### Cart item IDs
- Menu items: `${formatId}-${itemName}` e.g. `"bouteille-Orange Soleil"`
- Palette items: `palette-${sortedFruitIds.join('-')}` e.g. `"palette-lime-mango"`
- Same id → qty increments instead of duplicate entry

### Mobile + button visibility
Menu `+` buttons use `opacity-100 sm:opacity-0 group-hover:opacity-100` — always visible on mobile, hover-only on desktop.

### iOS input zoom fix
Use `text-base sm:text-sm` on all `<input>` inside CartDrawer to prevent iOS Safari zoom (16px min).

## Prices (TND)
- Bouteille 1L: 12–14 TND
- Grand Cup 500ml: 7–7.5 TND
- Petit Cup 250ml: 4.5–5 TND
- Palette personnalisée: 7.5 TND (constant `PALETTE_PRICE` in `PicassoPalette.tsx`)

## Before going live
- [ ] Replace WhatsApp number in `WhatsAppButton.tsx` (`PHONE = '21600000000'`)
- [ ] Replace WhatsApp number in `CartDrawer.tsx` (`WHATSAPP_NUMBER = '21600000000'`)
- [ ] Replace address, phone, email, social links in `Footer.tsx`
- [ ] Add real Instagram/Facebook/TikTok URLs
