import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
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
				},
				// Qwell specific colors - using hyphen notation
				'qwell-primary': 'hsl(var(--qwell-primary))',
				'qwell-primary-light': 'hsl(var(--qwell-primary-light))',
				'qwell-secondary': 'hsl(var(--qwell-secondary))',
				'qwell-accent': 'hsl(var(--qwell-accent))',
				'qwell-success': 'hsl(var(--qwell-success))',
				'qwell-warning': 'hsl(var(--qwell-warning))',
				// Nexora colors for backward compatibility  
				'nexora-primary': 'hsl(var(--nexora-primary))',
				'nexora-primary-light': 'hsl(var(--nexora-primary-light))',
				'nexora-secondary': 'hsl(var(--nexora-secondary))',
				'nexora-accent': 'hsl(var(--nexora-accent))',
				'nexora-success': 'hsl(var(--nexora-success))',
				'nexora-warning': 'hsl(var(--nexora-warning))',
				// Chat colors
				'chat-bubble-user': 'hsl(var(--chat-bubble-user))',
				'chat-bubble-ai': 'hsl(var(--chat-bubble-ai))',
				'chat-input-bg': 'hsl(var(--chat-input-bg))',
				// Status colors
				'status-online': 'hsl(var(--status-online))',
				'status-offline': 'hsl(var(--status-offline))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
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
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeInUp 0.4s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'float': 'float 2s ease-in-out infinite',
				'shimmer': 'shimmer 1.5s infinite',
				'pulse-glow': 'pulseGlow 2s infinite',
				'text-reveal': 'textReveal 0.3s ease-out',
				'bounce-smooth': 'smoothBounce 1.4s infinite ease-in-out'
			},
			boxShadow: {
				'nexora': '0 4px 16px hsl(var(--nexora-primary) / 0.15), 0 2px 8px hsl(var(--foreground) / 0.08)',
				'nexora-lg': '0 12px 40px hsl(var(--nexora-primary) / 0.2), 0 4px 16px hsl(var(--foreground) / 0.12)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
