export default {
  content: ['./src/**/*.{astro,jsx,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0C',
        surface: '#121314',
        text: '#E7E2DB',
        muted: '#9E968C',
        outline: '#2A2A2C',
        cta: '#E43C2F',
        'cta-hover': '#D2362A',
        link: '#2F6F74',
        'link-hover': '#24545A',
        bone: '#E7E2DB',
        gunmetal: '#0B0B0C',
        charcoal: '#121314'
      },
      fontFamily: {
        /* Core families */
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Coldiac', 'Playfair Display', 'ui-serif', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['Playfair Display', 'serif'],
        accent: ['Bebas Neue', 'system-ui', 'sans-serif'],
        /* Optional decorative utilities */
        coldiac: ['Coldiac', 'serif'],
        neon: ['Neon City', 'sans-serif'],
        graffiti: ['Street Writing', 'sans-serif'],
        graffitiEx: ['Street Writing Extrude', 'sans-serif']
      }
    }
  },
  plugins: []
};
