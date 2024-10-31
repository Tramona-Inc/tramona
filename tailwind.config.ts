/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      magazine: ["FiraSansExtraCondensed-ExtraBold", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1850px",
      },
    },
    extend: {
      fontSize: {
        "8xl": "4.6rem",
        fontFamily: {
          mulish: ["Mulish", "sans-serif"],
        },
      },
      maxWidth: {
        "8xl": "90rem", // 1440px
      },
      spacing: {
        "screen-minus-header-n-footer": "var(--screen-minus-header-n-footer)",
        "screen-minus-header": "var(--screen-minus-header)",
        "header-height": "var(--header-height)",
        "footer-height": "var(--footer-height)",
        "searchbar-height": "var(--searchbar-height)",
        "mobile-header-height": "var(--mobile-header-height)",
        "screen-minus-header-n-footer-n-searchbar":
          "var(--screen-minus-header-n-footer-n-searchbar)",
      },
      colors: {
        gold: "#FACF26",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        primaryGreen: {
          DEFAULT: "hsl(var(--primary-green))",
          background: "hsl(var(--primary-green-background))",
          hover: "hsl(var(--primary-green-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderWidth: {
        custom: "2px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        text: "text 5s ease infinite",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      },
      backgroundImage: {
        "reserved-pattern":
          "repeating-linear-gradient(135deg, red, red 1px, transparent 1px, transparent 4px)",
        "reserved-pattern-2":
          "repeating-linear-gradient(135deg, hsl(var(--primary-green)), hsl(var(--primary-green)) 1px, transparent 1px, transparent 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("tailwind-scrollbar-hide"),
  ],
};
