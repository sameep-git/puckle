import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.zinc,
        accent: "var(--ACCENT)",
      },
      fontFamily: {
        display: ["Anton", ...defaultTheme.fontFamily.sans],
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
        emoji: ["Noto Color Emoji", "Rubik", ...defaultTheme.fontFamily.sans],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            a: {
              color: "var(--ACCENT)",
              "&:hover": {
                color: "var(--ACCENT)",
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};