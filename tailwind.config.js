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
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        subtle: "rgb(var(--subtle-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "#f8e33f",
          hover: "#e6d038",
          foreground: "#0a0a0a",
          /* Accent as a *text* colour. Raw #f8e33f is 1.31:1 on white, so the
             light theme swaps in a dark gold; dark keeps the brand yellow. */
          text: "rgb(var(--accent-text) / <alpha-value>)",
        },
      },
      screens: {
        sm: "550px",
        md: "950px",
        lg: "1128px",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)", "var(--font-sans)"],
      },
      /* Editorial type scale. Every step pairs a size with the line-height and
         tracking it was drawn for, so `text-heading` is the whole decision and
         nothing downstream has to re-tune it. Tracking is a flat -0.02em: the
         optical correction stays proportional as the size grows. */
      fontSize: {
        caption: ["12px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "body-sm": ["14px", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        body: ["16px", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
        subheading: ["18px", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "heading-sm": ["24px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        heading: ["30px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        display: ["70px", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-xl": ["88px", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
      },
      /* Three radii, no more. Cards and standalone media are 20px, fields and
         nested elements are 8px, anything self-contained and interactive is a
         pill. Intermediate values (12px, 16px) are deliberately absent — they
         are what makes a UI read as unresolved. */
      borderRadius: {
        tight: "8px",
        card: "20px",
        pill: "100px",
      },
      /* Names here must not match a colour key: Tailwind also derives
         `shadow-*` utilities from the palette, and the colour plugin wins,
         which silently turns the shadow into a flat opaque swatch. `subtle`
         collided with the `subtle` text colour for exactly that reason. */
      boxShadow: {
        /* Floating surfaces — menus, popovers, hovered cards. */
        floating: "rgba(0, 0, 0, 0.08) 0px 10px 15px 0px",
        /* Resting elevation. The inset top highlight is what reads as a
           physical edge rather than a drop shadow. */
        lift: "rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px, rgba(255, 255, 255, 0.45) 0px 0.5px 0px 0px inset",
      },
      maxWidth: {
        "8xl": "86rem",
        page: "1200px",
      },
      spacing: {
        section: "80px",
        "section-lg": "100px",
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
