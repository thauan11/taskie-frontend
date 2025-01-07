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
        pop: {
          '25%': { transform: 'translateX(-10px)' },
          '50%': { transform: 'translateX(10px)' },
          '75%': { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(0px)' },
        },
        opacity: {
          '0%': { opacity: "0" },
          '100%': { opacity: "100" },
        },
        dropdown: {
          '0%': { transform: 'translateY(-99vh)' },
          '100%': { transform: 'translateY(0px)' },
        },
        sideRight: {
          // '0%': { maxWidth: '0px' },
          // '100%': { maxWidth: '100%' },
          '0%': { transform: 'translateX(-100%)', zIndex: '-1' },
          '50%': { transform: 'translateY(0)'  },
          '100%': { zIndex: '0'  },
        }
      },
      animation: {
        pop: 'pop .5s linear',
        opacity: 'opacity .1s linear',
        dropdown: 'dropdown .5s linear',
        sideRight: 'sideRight .5s linear',
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
