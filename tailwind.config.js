/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Palette "Tech Falcon" v3 — identique à mobile/src/theme/colors.ts
      // (marine profond → bleu électrique → cyan lumineux, or en accent rare),
      // pour que le dashboard admin et l'app mobile soient visuellement la
      // même marque. Ne pas dupliquer les valeurs ailleurs : si la palette
      // change un jour, les deux fichiers doivent être mis à jour ensemble.
      colors: {
        primary: {
          50: '#EAF1FF', 100: '#CFE0FF', 200: '#9FC2FF', 300: '#6AA0FF',
          400: '#3B7DFF', 500: '#1A63FF', 600: '#0057FF', 700: '#0044CC',
          800: '#002D72', 900: '#001A44',
          DEFAULT: '#0057FF',
        },
        accent: {
          50: '#E6FBFF', 100: '#B8F3FF', 200: '#7FE8FF', 300: '#45DBFF',
          400: '#00C2FF', 500: '#00A8DE', 600: '#0089B8', 700: '#00688C',
          text: '#00688C',
          DEFAULT: '#00C2FF',
        },
        // Or — accent CTA / éléments premium, usage rare et intentionnel
        // (même règle que côté mobile : jamais en décoratif au même titre
        // que primary/accent).
        gold: {
          50: '#FFF6E5', 100: '#FFE7B8', 200: '#FFD680', 300: '#FFC24D',
          400: '#FFB000', 500: '#FF8A00', 600: '#E67300', 700: '#B85B00',
          text: '#7A3D00',
          DEFAULT: '#FFB000',
        },
        neutral: {
          0: '#F5F8FC', 50: '#EDF2FA', 100: '#E1E8F2', 200: '#C9D3E3',
          300: '#A8B4C9', 500: '#74839C', 600: '#5A6980', 700: '#3D4A61',
          900: '#0B1526',
        },
        success: { DEFAULT: '#22C55E', strong: '#15803D', tint: '#E7F9EE' },
        warning: { DEFAULT: '#F59E0B', strong: '#B45309', tint: '#FFF3DC' },
        danger:  { DEFAULT: '#EF4444', strong: '#B91C1C', tint: '#FDEAEA' },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}
