import type { Config } from "tailwindcss";

/**
 * Base theme for the ShopCo storefront — a minimalist black / white / gray
 * fashion brand palette. Consumed by Tailwind v4 via the `@config` directive in
 * `app/globals.css`; the same tokens are mirrored in that file's `@theme` block.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black brand ink, used for primary buttons, headings, etc.
        primary: {
          DEFAULT: "#1A1A1A",
          50: "#F7F7F7",
          100: "#F0F0F0",
          200: "#E4E4E4",
          300: "#D1D1D1",
          400: "#A0A0A0",
          500: "#737373",
          600: "#525252",
          700: "#383838",
          800: "#262626",
          900: "#1A1A1A",
          950: "#0D0D0D",
        },
        // Page background.
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        // Neutral surface tones for cards, inputs and section backgrounds.
        surface: {
          DEFAULT: "#F5F5F5", // gray-100
          muted: "#E5E5E5", // gray-200
        },
        border: "#E5E5E5",
      },
      borderRadius: {
        // Pill-shaped controls (buttons, chips, pagination).
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
