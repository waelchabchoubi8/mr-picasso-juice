import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        // `coral` keeps its name (used widely as bg-coral/text-coral) but its
        // value is now Masmoudi purple — re-skins the whole site at once.
        coral:    '#6C5CE7',  // Masmoudi purple (primary)
        grape:    '#5546C4',  // deep purple (depth)
        lilac:    '#A99BF5',  // light purple
        sunny:    '#FFD34E',  // gold accent (royal purple + gold)
        pistache: '#9CCC65',  // pistachio green (the "pistache" range)
        teal:     '#3ECFB0',
        lime:     '#7ED95A',
        peach:    '#FFB085',
        cream:    '#FFFBF5',
        sand:     '#FFF0D9',
        warm:     '#1A0A00',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
