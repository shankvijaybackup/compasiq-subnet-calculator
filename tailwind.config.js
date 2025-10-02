/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        compasiq: {
          primary: '#4F46E5',
          secondary: '#06B6D4',
          dark: '#1E293B',
        }
      }
    },
  },
  plugins: [],
}
