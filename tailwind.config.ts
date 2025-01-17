import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "var(--main-color)",
      },
      keyframes: {
        loading: {
          '0%': { backgroundPosition: '0 25%,100% 25%,0 75%,100% 75%' },
          '5%': { backgroundPosition: '0 25%,100% 25%,0 75%,100% 75%' },
          '33%': { backgroundPosition: '0 50%,100% 0,0 100%,100% 50%' },
          '66%': { backgroundPosition: '0 50%,0 0,100% 100%,100% 50%'},
          '95%': { backgroundPosition: '0 75%,0 25%,100% 75%,100% 25%' },
          '100%': { backgroundPosition: '0 75%,0 25%,100% 75%,100% 25%' }
        },
        shake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translate(5px)' },
          '50%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
          '100%': { transform: 'translateX(0)' }
        },
        opacity: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        sideContentOpen: {
          '0%': { transform: 'translateX(100%)', opacity: '0.5' },
          '50%': { transform: 'translateX(50%)', opacity: '1' },
          '100%': { transform: 'translateX(0%)' },
        },
        sideContentClose: {
          '0%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(50%)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        changeIconOpen: {
          '0%': { maxHeight: '0%', opacity: '0' },
          '50%': { maxHeight: '50%', opacity: '1' },
          '100%': { maxHeight: '100%' },
        },
        changeIconClose: {
          '0%': { maxHeight: '100%', opacity: '1' },
          '50%': { maxHeight: '50%', opacity: '0' },
          '100%': { maxHeight: '0%' },
        },
        sideBarOpen: {
          '0%': { transform: 'translateX(-92%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        sideBarClose: {
          '0%': { transform: 'translateX(0)', opacity:'1' },
          '100%': { transform: 'translateX(-92%)', opacity:'0' }
        },
      },
      animation: {
        loading: 'loading 1s infinite linear',
        shake: 'shake 1s',
        opacity: 'opacity 500ms linear',
        sideContentOpen: 'sideContentOpen 500ms linear forwards',
        sideContentClose: 'sideContentClose 500ms linear forwards',
        changeIconOpen: 'changeIconOpen 500ms linear forwards',
        changeIconClose: 'changeIconClose 500ms linear forwards',
        sideBarOpen: 'sideBarOpen 500ms linear forwards',
        sideBarClose: 'sideBarClose 500ms linear forwards',
      },
      fontFamily: {
        noto: ["Noto", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        'xxs': ['0.5rem', '0.75rem'],
      },
      height: {
        'full-nav': 'calc(100vh - 3.10rem)',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
