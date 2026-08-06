/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Palette "Faucon Indigo" — identique à mobile/src/constants/colors.ts,
      // pour que le dashboard admin et l'app mobile soient visuellement
      // la même marque. Ne pas dupliquer les valeurs ailleurs : si la
      // palette change un jour, les deux fichiers doivent être mis à jour
      // ensemble.
      colors: {
        primary: {
          50: '#EEF0F7', 100: '#D9DDEE', 200: '#B3BADD', 300: '#8690C4',
          400: '#5F6BA8', 500: '#45518C', 600: '#363F70', 700: '#2A3159',
          800: '#1F2544', 900: '#161A33',
          DEFAULT: '#363F70',
        },
        accent: {
          50: '#FFF6EC', 100: '#FFE7C7', 200: '#FFD08F', 300: '#FDB35C',
          400: '#F2884D', 500: '#E8842A', 600: '#C96A1C', 700: '#A85618',
          text: '#9E4F1C',
          DEFAULT: '#F2884D',
        },
        neutral: {
          0: '#FAF9F7', 50: '#F3F1EE', 100: '#E8E5E0', 200: '#D7D2CA',
          300: '#B8B2A8', 500: '#857E72', 600: '#6B6558', 700: '#4A473F',
          900: '#211F1B',
        },
        success: { DEFAULT: '#2E9E6B', strong: '#1F7A50', tint: '#E7F5EE' },
        warning: { DEFAULT: '#E3A72E', strong: '#8A5E10', tint: '#FBF0DC' },
        danger:  { DEFAULT: '#D64545', strong: '#B23434', tint: '#FBEAEA' },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}