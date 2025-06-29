/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#283FB1",
          800: "#2C3E50",
          700: "#34495E",
          600: "#3B5998",
          500: "#3C8DBC",
          400: "#2980B9",
          300: "#3498DB",
          200: "#5DADE2",
          100: "#85C1E9",
          50: "#AED6F1",
        },
        secondary: {
          DEFAULT: "#4D4D4D", // Labels, stroke, etc.
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
      // Letter Sizes
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
        "4xs": "0.375rem",
        "5xs": "0.3125rem",
        "6xs": "0.25rem",
      },
      borderRadius: {
        "2xs": "0.125rem",
        "3xs": "0.0625rem",
      },

    },
  },
  plugins: [],
}