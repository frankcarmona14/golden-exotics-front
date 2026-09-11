/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#f8e33f",
          hover: "#e6d038",
          foreground: "#0a0a0a",
        },
      },
      screens: {
        sm: "550px",
        md: "950px",
        lg: "1128px",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      maxWidth: {
        "8xl": "86rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        slider: {
          "0%": { transform: "translateX(0)" },
          "100%": {
            transform: "translateX(calc(-100% / var(--slider-total-clones)))",
          },
        },
        "dot-pulse": {
          "0%,100%": {
            transform: "Scale(1)",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1.25)",
            opacity: 0.3,
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        slider: "slider 56s linear infinite",
        "dot-pulse": "dot-pulse 1s infinite ease-in-out",
        shimmer: "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
