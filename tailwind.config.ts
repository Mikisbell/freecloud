import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				brand: {
					'50': '#eef7ff',
					'100': '#d9edff',
					'200': '#bce0ff',
					'300': '#8ecdff',
					'400': '#59b0ff',
					'500': '#338dff',
					'600': '#1a6df5',
					'700': '#1357e1',
					'800': '#1647b6',
					'900': '#183f8f',
					'950': '#132857'
				},
				teal: {
					'50': '#edfcfb',
					'100': '#d2f7f5',
					'200': '#a9efec',
					'300': '#72e2de',
					'400': '#3dcdc9',
					'500': '#2ab1ac', // Dataiku Teal
					'600': '#228f8c',
					'700': '#1d7371',
					'800': '#1c5b5a',
					'900': '#1b4c4b',
					'950': '#0a2e2e'
				},
				dataiku: {
					navy: '#1B2031',
					teal: '#2AB1AC',
					hover_teal: '#4DC9C3',
					background: '#F4F6F9',
					border: '#E2E8F0'
				},

				// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
				// FC — FreeCloud Brand Design Tokens
				// Extraídos del logo oficial FreeCloud
				// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
				fc: {
					// Familia Azul (Nube principal)
					'cyan': '#29ABE2',  // Nube mid-tone — Primario vibrante
					'cyan-light': '#00D4FF',  // Nube highlight — Acentos brillantes
					'blue': '#0078C8',  // Nube sombra (píxel real del logo)
					'navy': '#003F8A',  // Nube base — Textos, fondos oscuros
					'navy-deep': '#00265A',  // Sombra extrema — Headers dark

					// Familia Dorado (Edificios del logo — píxeles reales)
					'gold': '#C87800',  // Dorado real del logo (edificios)
					'gold-dark': '#A86400',  // Hover oscuro
					'gold-light': '#E09600',  // Highlight ámbar cálido
					'gold-muted': '#B88040',  // Tono apagado

					// Neutros de marca
					'white': '#FFFFFF',
					'surface': '#F5F7FA',  // Fondo general suave
					'border': '#D6E4F0',  // Bordes sutiles azulados
					'text': '#0C2340',  // Texto primario ultra-oscuro
					'text-muted': '#4A6285',  // Texto secundario azulado

					// Semánticos / estados
					'success': '#1A8F5E',  // Éxito (verde neutro)
					'warning': '#D4940A',  // Warning == gold (coherente)
					'error': '#C0392B',  // Error rojo
				},
				accent: {
					'50': '#fff7ed',
					'100': '#ffeed4',
					'200': '#ffd9a8',
					'300': '#ffbd71',
					'400': '#ff9633',
					'500': '#ff7a0d',
					'600': '#f06006',
					'700': '#c74807',
					'800': '#9e390e',
					'900': '#7f310f',
					'950': '#451605',
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				surface: {
					'50': '#f8fafc',
					'100': '#f1f5f9',
					'200': '#e2e8f0',
					'300': '#cbd5e1',
					'400': '#94a3b8',
					'500': '#64748b',
					'600': '#475569',
					'700': '#334155',
					'800': '#1e293b',
					'900': '#0f172a',
					'950': '#020617'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				// Sistema actual
				display: [
					'var(--font-display)',
					'system-ui',
					'sans-serif'
				],
				body: [
					'var(--font-body)',
					'system-ui',
					'sans-serif'
				],
				mono: [
					'var(--font-mono)',
					'monospace'
				],
				// FC Brand Fonts — Logo oficial FreeCloud
				brand: [
					'var(--font-brand)', // Montserrat Black — "FREECLOUD"
					'system-ui',
					'sans-serif'
				],
				slogan: [
					'var(--font-slogan)', // Rajdhani — "NUNCA PARES DE CONSTRUIR."
					'system-ui',
					'sans-serif'
				],
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '72ch',
						color: 'var(--tw-prose-body)',
						a: {
							color: '#2ab1ac',
							textDecoration: 'underline',
							textUnderlineOffset: '3px',
							'&:hover': {
								color: '#1d7371'
							}
						},
						'code::before': {
							content: '"'
						},
						'code::after': {
							content: '"'
						},
						code: {
							backgroundColor: '#f1f5f9',
							padding: '0.2em 0.4em',
							borderRadius: '0.25rem',
							fontSize: '0.875em',
							fontWeight: '500'
						}
					}
				}
			},
			animation: {
				'fade-in': 'fadeIn 0.6s ease-out forwards',
				'slide-up': 'slideUp 0.6s ease-out forwards',
				'slide-in-right': 'slideInRight 0.4s ease-out forwards',
				'reveal-up': 'revealUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'reveal-left': 'revealLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'reveal-scale': 'revealScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				float: 'float 6s ease-in-out infinite',
				'gradient-shift': 'gradientShift 8s ease infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				slideUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				slideInRight: {
					'0%': {
						opacity: '0',
						transform: 'translateX(-10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				revealUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(40px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				revealLeft: {
					'0%': {
						opacity: '0',
						transform: 'translateX(-40px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				revealScale: {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-12px)'
					}
				},
				gradientShift: {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				}
			},
			boxShadow: {
				'dataiku': '0 2px 4px rgba(27, 32, 49, 0.05)',
				'dataiku-hover': '0 15px 35px -5px rgba(27, 32, 49, 0.15), 0 5px 15px -5px rgba(27, 32, 49, 0.1)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
