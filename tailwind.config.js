// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#39ff14', // Neon green accent
        darkbg: '#1a1a1a', // Dark background
        darkfg: '#0f0f0f', // Dark foreground
      },
      fontFamily: {
        mono: ['"Fira Code", monospace'],
      },
    },
  },
  plugins: [],
}
