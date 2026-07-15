/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    ...['blue', 'emerald', 'violet', 'amber', 'cyan', 'indigo', 'red', 'slate', 'teal', 'purple'].flatMap(c => [
      `bg-${c}-100`, `dark:bg-${c}-900/30`, `text-${c}-600`, `bg-${c}-500`,
    ]),
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a'
        },
      }
    }
  },
  plugins: [],
}
