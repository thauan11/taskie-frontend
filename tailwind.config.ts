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
      boxShadow: {
        login: 'rgba(0, 0, 0, 0.1) 0px 0px 28px',
        loginLight: 'rgba(255, 255, 255, 0.1) 0px 0px 28px',
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
        open: {
          '0%': { transform: 'translateX(-92%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        close: {
          '0%': { transform: 'translateX(0)', opacity:'1' },
          '100%': { transform: 'translateX(-92%)', opacity:'0' }
        },
        opacityOpen: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        opacityClose: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        popUpOpen: {
          '0%': { opacity: '0', transform: 'scale(0.5) translate(-50%,-50%)' },
          '100%': { opacity: '1', transform: 'scale(1) translate(-50%,-50%)' }
        },
        popUpClose: {
          '0%': { opacity: '1', transform: 'scale(1) translate(-50%,-50%)' },
          '100%': { opacity: '0', transform: 'scale(0.5) translate(-50%,-50%)' }
        },
      },
      animation: {
        loading: 'loading 1s infinite linear',
        shake: 'shake 1s',
        open: 'open 1s forwards',
        close: 'close 1s forwards',
        opacityOpen: 'opacityOpen 1s forwards',
        opacityClose: 'opacityClose 0.5s forwards',
        popUpOpen: 'popUpOpen 0.5s forwards',
        popUpClose: 'popUpClose 0.5s forwards',
      },
      fontFamily: {
        noto: ["Noto", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        'xxs': ['0.5rem', '0.75rem'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
