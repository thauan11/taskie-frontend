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
        }
      },
      animation: {
        pop: 'pop .5s linear',
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
