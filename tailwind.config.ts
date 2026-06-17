import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map to CSS custom properties from design tokens
        "bg-page": "var(--bg-page)",
        "bg-page-alt": "var(--bg-page-alt)",
        "surface-card": "var(--surface-card)",
        "surface-raised": "var(--surface-raised)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-press": "var(--accent-press)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        "status-available-bg": "var(--status-available-bg)",
        "status-available-fg": "var(--status-available-fg)",
        "status-sold-bg": "var(--status-sold-bg)",
        "status-sold-fg": "var(--status-sold-fg)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "var(--container-max)",
        narrow: "var(--container-narrow)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
      borderRadius: {
        none: "0",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        float: "var(--shadow-float)",
        "glow-gold": "var(--glow-gold)",
      },
    },
  },
  plugins: [],
};

export default config;
