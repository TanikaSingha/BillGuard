/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
      primary: "#1E40AF",   // Deep blue
      secondary: "#F59E0B", // Warm orange
      background: "#F9FAFB",
    },
    fontFamily: {
        montserrat: ["Montserrat"],       // Regular
        montserratBold: ["Montserrat-Bold"], // Bold
      },
    },
  },
  plugins: [],
}

