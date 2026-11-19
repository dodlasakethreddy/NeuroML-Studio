/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          main: '#0B1020',
          sidebar: '#10172A',
          card: '#151E32',
          surface: '#1A243D',
          border: '#27334A',
          borderLight: '#324260',
          hover: '#1E2942',
        },
        accent: {
          purple: '#8B5CF6',
          purpleHover: '#7C3AED',
          blue: '#3B82F6',
          blueHover: '#2563EB',
          cyan: '#06B6D4',
          green: '#22C55E',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        content: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.35)',
        'glow-green': '0 0 25px -5px rgba(34, 197, 94, 0.35)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.12) 50%, rgba(11, 16, 32, 0.95) 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(21, 30, 50, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
