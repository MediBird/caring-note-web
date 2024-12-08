/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      fontSize: {
        h0: ["3.75rem", "4.125rem"], // 60pt / Line height 66pt
        h1: ["3rem", "3.25rem"], // 48pt / Line height 52pt
        h2: ["2.25rem", "2.75rem"], // 36pt / Line height 44pt
        h3: ["1.75rem", "2.125rem"], // 28pt / Line height 34pt
        subtitle1: ["1.5rem", "1.875rem"], // 24pt / Line height 30pt
        subtitle2: ["1.25rem", "1.625rem"], // 20pt / Line height 26pt
        body1: ["1rem", "1.5rem"], // 16pt / Line height 24pt
        body2: ["0.875rem", "1.25rem"], // 14pt / Line height 20pt
        caption1: ["0.75rem", "0.875rem"], // 12pt / Line height 14pt
        caption2: ["0.625rem", "0.75rem"], // 10pt / Line height 12pt
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      colors: {
        blue: {
          100: "#CCE0FF",
          200: "#D5E9FF",
          500: "#2888F6",
          600: "#0076E0",
          700: "#005EB4",
        },
        primary: {
          5: "#F5F7FF",
          10: "#CCE0FF",
          20: "#D5E9FF",
          30: "#A8D1FF",
          40: "#77B6FF",
          50: "#2888F6", // Main Primary
          60: "#0076E0",
          70: "#005EB4", // Primary Variant
          80: "#00468A",
          90: "#003062",
          100: "#001B3C",
        },
        secondary: {
          5: "#FFF9F0",
          10: "#FFEFD3",
          20: "#FFDF9B",
          30: "#FFCA44", // Main Secondary
          40: "#FFBD14",
          50: "#FF9F00",
          60: "#C78F00",
          70: "#996E00",
          80: "#705000",
          90: "#473300",
          100: "#332500",
        },
        error: {
          5: "#FFF5F5",
          10: "#FFEDEA",
          20: "#FFDAD6",
          30: "#FFB4AB",
          40: "#FF897D",
          50: "#FF5449", // Main Error
          60: "#DB3A33",
          70: "#B81F1E",
          80: "#93000A",
          90: "#690005",
          100: "#410002",
        },
        grayscale: {
          3: "#F6F7F9",
          5: "#EFF1F4",
          10: "#E0E2E6",
          20: "#C3C6CB",
          30: "#A8AAAF",
          40: "#909193",
          50: "#808080", // Main Grayscale
          60: "#767779",
          70: "#464748",
          80: "#303031",
          90: "#303031",
          100: "#121212", // Black
        },
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
