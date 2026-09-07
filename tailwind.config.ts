import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fundo: quase-preto azulado, não preto puro
        base: {
          DEFAULT: "#0B0D12",
          raised: "#12151C",
          line: "#20242E",
        },
        ink: {
          DEFAULT: "#E7E9EE",
          dim: "#8A8F9C",
          faint: "#5C616D",
        },
        // Âmbar de tela de radar — o único acento vivo do produto
        signal: {
          DEFAULT: "#FFB020",
          soft: "#FFB02022",
        },
        // Cores fixas de confiança da notícia (não decorativas — carregam significado)
        conf: {
          official: "#3ED598",
          multi: "#4C9AFF",
          probable: "#E8C23A",
          rumor: "#E8813A",
          leak: "#B478F0",
          unverified: "#5C616D",
        },
      },
      fontFamily: {
        // Sem fetch remoto no build: pilha de sistema, com o display puxando
        // para a família mais geométrica/técnica disponível em cada SO.
        display: [
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "ui-sans-serif",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        sweep: {
          "0%": { transform: "rotate(0deg)", opacity: "0.9" },
          "100%": { transform: "rotate(360deg)", opacity: "0.9" },
        },
        pulse_dot: {
          "0%, 100%": { boxShadow: "0 0 0 0 currentColor" },
          "50%": { boxShadow: "0 0 0 4px transparent" },
        },
      },
      animation: {
        sweep: "sweep 3.2s linear infinite",
        pulse_dot: "pulse_dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
