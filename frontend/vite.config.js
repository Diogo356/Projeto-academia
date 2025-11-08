/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          primary: '#1e40af',    // Azul profissional
          secondary: '#0f766e',  // Verde corporativo
          accent: '#dc2626',     // Vermelho para ações
          neutral: '#374151',    // Cinza neutro
          light: '#f8fafc'       // Fundo claro
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        corporate: {
          "primary": "#1e40af",
          "secondary": "#0f766e", 
          "accent": "#dc2626",
          "neutral": "#374151",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
}