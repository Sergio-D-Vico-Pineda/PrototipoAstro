import defaultTheme from 'tailwindcss/defaultTheme'
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js}',
		'./public/js/*.js'
	],
	theme: {
		extend: {
			fontFamily: {
				'ubuntu': ['Ubuntu', defaultTheme.fontFamily.sans]
			}
		},
	},
	plugins: [],
}
