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
        indeterminate: {
          '0%': { left: '-50%', width: '30%' },
          '40%': { left: '25%', width: '50%' },
          '100%': { left: '100%', width: '30%' },
        },
        fadeInFrames: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        indeterminate: 'indeterminate 2s infinite linear',
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
      'dark',
      'synthwave',
      {
        cyberpunk: {
          primary: '#8A2BE2',
          secondary: '#FF4500',
          accent: '#00FF00',
          neutral: '#181818',
          'base-100': '#272727',
          info: '#1E90FF',
          success: '#32CD32',
          warning: '#FFD700',
          error: '#FF0000',
        },
      },
      {
        shadowrun: {
          primary: '#990066',
          secondary: '#00ffff',
          accent: '#fceb7b',
          neutral: '#ffffff',
          'base-100': '#1d181c',
          info: '#1E90FF',
          success: '#32CD32',
          warning: '#FFD700',
          error: '#FF0000',
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
