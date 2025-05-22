/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      colors: {
        primary: '#FF9B19',         
        accent: '#C1280F',          
        background: '#F4F4F4',      
        neutral: '#FFF4E4',        
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

