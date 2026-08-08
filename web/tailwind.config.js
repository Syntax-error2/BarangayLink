/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue 500
          dark: '#2563EB',    // Blue 600
          light: '#EFF6FF',   // Blue 50
        },
        secondary: {
          DEFAULT: '#0EA5E9', // Sky 500
          dark: '#0284C7',
          light: '#F0F9FF',
        },
        accent: {
          DEFAULT: '#6366F1', // Indigo 500
          dark: '#4F46E5',    // Indigo 600
          light: '#EEF2FF',   // Indigo 50
        },
        background: '#F8FAFC', // Slate 50
        surface: '#FFFFFF',
        text: {
          primary: '#0F172A',   // Slate 900
          secondary: '#64748B', // Slate 500
          muted: '#94A3B8',     // Slate 400
        },
        border: '#E2E8F0',      // Slate 200
        success: { DEFAULT: '#10B981', light: '#ECFDF5' }, // Emerald
        warning: { DEFAULT: '#F59E0B', light: '#FFFBEB' }, // Amber
        danger: { DEFAULT: '#EF4444', light: '#FEF2F2' },  // Red
        info: { DEFAULT: '#3B82F6', light: '#EFF6FF' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
