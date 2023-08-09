/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        fadeInFrames: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeInFrames 0.3s ease-out forwards',
      },
      fontFamily: {
        emoji: ['Noto Emoji', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        talisTheme: {
          primary: '#a991f7',
          secondary: '#f6d860',
          accent: '#37cdbe',
          neutral: '#3d4451',
          'base-100': '#ffffff',
          info: '#3b08bd',
          warning: '#f58e07',
          error: '#f74848',
        },
      },
      'synthwave',
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
