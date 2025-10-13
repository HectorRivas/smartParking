/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",

  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter_400Regular'], // Regular para texto general
        'inter-semibold': ['Inter_600SemiBold'], // Semi-negrita para subtítulos y botones
        'inter-bold': ['Inter_700Bold'], // Negrita para cuerpo y títulos
        'montserrat': ['Montserrat_400Regular'], // Regular para texto general
        'montserrat-semibold': ['Montserrat_600SemiBold'], // Semi-negrita para subtítulos y botones
        'montserrat-bold': ['Montserrat_700Bold'], // Negrita para títulos y encabezados
      },
      colors: {
        'dark-blue': '#073A59',       // Títulos, Texto principal
        'primary-blue': '#3F83BF',    // Etiquetas, Enlaces
        'bright-blue': '#3F8EBF',     // CTA principal
        'light-gray': '#F2F2F2',      // Fondo de componentes/Modal
        'subtle-blue': '#9ABBD9',     // Bordes inactivos
      },
    },
  },
  plugins: [],
};
