import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#64748b",
        line: "#dbe5f0",
        paper: "#ffffff",
        wash: "#f6f9fc",
        sky: "#2563eb",
        aqua: "#0f9f9a",
        coral: "#e05263",
        honey: "#c98212",
      },
      boxShadow: {
        soft: "0 16px 45px rgba(23, 32, 51, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
