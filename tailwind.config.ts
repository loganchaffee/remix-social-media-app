import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
    },

    animation: {
      fadeIn: "fadeIn .250s ease-in-out",
    },

    keyframes: {
      fadeIn: {
        from: { opacity: "0" },
        to: { opacity: "1" },
      },
    },
  },
  plugins: [],
} satisfies Config;
