import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cs: {
          orange: '#F0A500',
          dark: '#0F1923',
          card: '#1A2332',
          border: '#2A3A4A',
          muted: '#8899AA',
        },
      },
    },
  },
  plugins: [],
}

export default config
