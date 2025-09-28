import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Consolas", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        ring: "var(--ring)",
        // Chat specific colors
        chat: {
          bg: "var(--chat-bg)",
          "user-bg": "var(--chat-user-bg)",
          "assistant-bg": "var(--chat-assistant-bg)",
          border: "var(--chat-border)",
          "input-bg": "var(--chat-input-bg)",
          "input-border": "var(--chat-input-border)",
          "sidebar-bg": "var(--chat-sidebar-bg)",
          "sidebar-border": "var(--chat-sidebar-border)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "var(--foreground)",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            h1: {
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: "600",
            },
            h2: {
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: "600",
            },
            h3: {
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: "600",
            },
            code: {
              fontFamily: "var(--font-jetbrains-mono), Consolas, monospace",
              fontSize: "0.875em",
              backgroundColor: "var(--muted)",
              padding: "0.125rem 0.25rem",
              borderRadius: "0.25rem",
            },
            pre: {
              fontFamily: "var(--font-jetbrains-mono), Consolas, monospace",
              backgroundColor: "var(--muted)",
              border: "1px solid var(--border)",
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
