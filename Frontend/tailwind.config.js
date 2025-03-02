/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        updown: {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(10px)" },
        },
      },
      animation: {
        updown: "updown 3s ease-in-out infinite", // Slow, infinite animation
        bounce: "bounce 1.2s infinite ease-in-out", // Bouncing animation
      },
      select: {
        option: {
          hover: "#0d9488",
        },
      },
      screens: {
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
};
