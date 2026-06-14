/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        elaw: {
          primary: 'var(--elaw-primary)',
          'primary-hover': 'var(--elaw-primary-hover)',
          accent: 'var(--elaw-accent)',
          background: 'var(--elaw-background)',
          'chat-bg': 'var(--elaw-chat-bg)',
          'user-bubble': 'var(--elaw-user-bubble)',
          'agent-bubble': 'var(--elaw-agent-bubble)',
          'text-primary': 'var(--elaw-text-primary)',
          'text-secondary': 'var(--elaw-text-secondary)',
          system: 'var(--elaw-system)',
          danger: 'var(--elaw-danger)',
          success: 'var(--elaw-success)',
          'code-bg': 'var(--elaw-code-bg)',
          border: 'var(--elaw-border)',
          'glass-bg': 'var(--elaw-glass-bg)',
          'glass-border': 'var(--elaw-glass-border)',
          'glass-highlight': 'var(--elaw-glass-highlight)',
          'panel-bg': 'var(--elaw-panel-bg)',
          'subtle-border': 'var(--elaw-subtle-border)',
          'status-online': 'var(--elaw-status-online)',
          'status-busy': 'var(--elaw-status-busy)',
          'status-offline': 'var(--elaw-status-offline)',
        },
      },
      fontFamily: {
        sans: ['var(--elaw-font-body)', 'sans-serif'],
        mono: ['var(--elaw-font-code)', 'monospace'],
      },
    },
  },
  plugins: [],
}
