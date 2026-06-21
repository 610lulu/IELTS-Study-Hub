import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        muted: "#77736d",
        line: "#e4dfd8",
        paper: "#fbfaf7",
        wash: "#f2efea",
        coal: "#1f2328",
        cream: "#f7f3ec",
        sky: "#5f7698",
        aqua: "#7f9a86",
        coral: "#ec5d3d",
        honey: "#f5c73c",
      },
      boxShadow: {
        soft: "0 22px 55px rgba(31, 35, 40, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
