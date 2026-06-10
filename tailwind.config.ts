import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B0F14",
        surface: "#111827",
        card: "#1F2937",
        border: "#2D3748",
        "text-primary": "#E5E7EB",
        "text-muted": "#9CA3AF",
        accent: "#F59E0B",
        "accent-alt": "#3B82F6",
        "status-pending": "#FBBF24",
        "status-confirmed": "#60A5FA",
        "status-processing": "#A78BFA",
        "status-delivered": "#34D399",
        "status-cancelled": "#EF4444",
      },
      boxShadow: {
        "accent-glow": "0 0 15px rgba(245, 158, 11, 0.3)",
        "accent-alt-glow": "0 0 15px rgba(59, 130, 246, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
