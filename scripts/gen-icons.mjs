// Generates PWA PNG icons (no external deps — pure Node zlib + Buffer).
// Renders a purple gradient square with a white Masmoudi "M" monogram.
// Run: node scripts/gen-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');
mkdirSync(PUBLIC, { recursive: true });

// ---- CRC32 + PNG chunk writer ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  // 10,11,12 = compression, filter, interlace = 0
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ---- geometry helpers (normalized 0..1 coords) ----
const lerp = (a, b, t) => a + (b - a) * t;
function mixColor(t) {
  // deep purple #5546C4 -> Masmoudi purple #6C5CE7
  return [
    Math.round(lerp(85, 108, t)),
    Math.round(lerp(70, 92, t)),
    Math.round(lerp(196, 231, t)),
  ];
}
// distance from a point to a line segment (for drawing thick M strokes)
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}
// Masmoudi "M" monogram strokes (normalized 0..1)
const M_SEGS = [
  [0.30, 0.72, 0.30, 0.30],
  [0.30, 0.30, 0.50, 0.56],
  [0.50, 0.56, 0.70, 0.30],
  [0.70, 0.30, 0.70, 0.72],
];
// white shape = within stroke half-width of any M segment
function inShape(x, y) {
  const hw = 0.058;
  for (const s of M_SEGS) if (distSeg(x, y, s[0], s[1], s[2], s[3]) <= hw) return true;
  return false;
}

function render(size, { pad = 0 } = {}) {
  const SS = 2; // supersample for anti-aliasing
  const W = size, H = size;
  const out = Buffer.alloc(W * H * 4);
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const fx = (px + (sx + 0.5) / SS) / W;
          const fy = (py + (sy + 0.5) / SS) / H;
          // background gradient (diagonal)
          const t = Math.min(1, Math.max(0, (fx + fy) / 2));
          const [br, bg, bb] = mixColor(t);
          // map shape coords with optional padding (maskable safe zone)
          const sxn = pad ? (fx - pad) / (1 - 2 * pad) : fx;
          const syn = pad ? (fy - pad) / (1 - 2 * pad) : fy;
          let cr = br, cg = bg, cb = bb;
          if (sxn >= 0 && sxn <= 1 && syn >= 0 && syn <= 1 && inShape(sxn, syn)) {
            cr = 255; cg = 255; cb = 255;
          }
          r += cr; g += cg; b += cb; a += 255;
        }
      }
      const n = SS * SS;
      const i = (py * W + px) * 4;
      out[i] = Math.round(r / n);
      out[i + 1] = Math.round(g / n);
      out[i + 2] = Math.round(b / n);
      out[i + 3] = Math.round(a / n);
    }
  }
  return encodePNG(W, H, out);
}

const targets = [
  ['icon-192.png', 192, {}],
  ['icon-512.png', 512, {}],
  ['icon-maskable-512.png', 512, { pad: 0.12 }],
  ['apple-touch-icon.png', 180, {}],
  ['favicon-32.png', 32, {}],
];
for (const [name, size, opts] of targets) {
  const png = render(size, opts);
  writeFileSync(join(PUBLIC, name), png);
  console.log(`✓ ${name} (${size}px, ${png.length} bytes)`);
}
console.log('Done.');
