import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'amplitude': ['amplitude', 'amplitude-fallback', 'Arial', 'sans-serif'],
				'cormorant': ['var(--font-cormorant)', 'Cormorant', 'serif'],
				'playfair': ['var(--font-playfair)', 'Playfair Display', 'serif'],
			},
			fontStretch: {
				'extra-condensed': 'extra-condensed',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				/*
				 * Fade puro: mexe só em opacity. O `animate-in` do
				 * tailwindcss-animate reescreve `transform` no keyframe, o que
				 * anula a centralização de um elemento posicionado com
				 * -translate-x-1/2 -translate-y-1/2 e produz um slide diagonal.
				 */
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'toast-in': {
					from: { transform: 'translateX(1rem)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' }
				},
				'drawer-in': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' }
				},
				'drawer-out': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(100%)' }
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'fade-in': 'fade-in 200ms ease-out',
				'fade-out': 'fade-out 150ms ease-in',
				'toast-in': 'toast-in 250ms cubic-bezier(0.32, 0.72, 0.4, 1)',
				'drawer-in': 'drawer-in 300ms cubic-bezier(0.32, 0.72, 0, 1)',
				'drawer-out': 'drawer-out 200ms ease-in',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
