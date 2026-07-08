import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050509",
        graphite: "#111116",
        graphite2: "#1A1A22",
        violet: "#7C3AED",
        royal: "#4F46E5",
        gold: "#D7B46A",
        ember: "#F59E0B",
        frost: "#F8FAFC",
        mist: "#A6A8B5",
        emerald: "#34D399"
      },
      boxShadow: {
        premium: "0 18px 70px rgba(0,0,0,.42)",
        glow: "0 0 30px rgba(124,58,237,.24)"
      },
      borderRadius: {
        premium: "8px"
      }
    }
  },
  plugins: []
};

export default config;
