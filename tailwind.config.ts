import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chineseRed: "#C62828",
        springGold: "#FFD700"
      },
      fontFamily: {
        display: ["'Noto Serif SC'", "'STKaiti'", "serif"],
        body: ["'PingFang SC'", "'Microsoft YaHei'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 12px 24px rgba(120, 17, 17, 0.16)"
      },
      keyframes: {
        countdownPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" }
        },
        snowFall: {
          "0%": { transform: "translateY(-10vh)", opacity: "0" },
          "20%": { opacity: "0.8" },
          "100%": { transform: "translateY(110vh)", opacity: "0" }
        }
      },
      animation: {
        countdownPulse: "countdownPulse 1s ease-in-out infinite",
        snowFall: "snowFall 8s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
