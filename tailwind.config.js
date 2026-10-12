const palette = require('./src/theme/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind only generates classes it finds in these files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Adds classes like bg-primary, text-ink, border-border, bg-dangerSoft.
      colors: palette,
      // Plus Jakarta Sans, one family per weight (React Native can't pick a
      // weight from a single custom font). Use these instead of font-bold etc.
      fontFamily: {
        sans: ['PlusJakartaSans_500Medium'],
        sansSemi: ['PlusJakartaSans_600SemiBold'],
        sansBold: ['PlusJakartaSans_700Bold'],
        sansXBold: ['PlusJakartaSans_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
