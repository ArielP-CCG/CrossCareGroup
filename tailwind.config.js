/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./**/*.{html,js}",
        "!./node_modules/**"
    ],
    theme: {
        extend: {
            colors: {
                'ccg-navy': '#003B5C',
                'ccg-teal': '#0096A1',
                'ccg-gold': '#FFAB40',
                'ccg-neutral': '#F5F5F5',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 20px 40px -5px rgba(0, 59, 92, 0.1)',
            }
        },
    },
    plugins: [],
}
