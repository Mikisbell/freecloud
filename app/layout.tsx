import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk, JetBrains_Mono, Montserrat, Rajdhani } from 'next/font/google';
import { generateSiteMetadata, generateWebsiteSchema } from '@/lib/seo';
import LayoutShell from '@/components/LayoutShell';
import AdSenseLoader from '@/components/AdSenseLoader';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import './globals.css';

const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: false,
});

const fontBody = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: false,
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
  preload: false, // Solo se usa en bloques de código — no bloquea FCP
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FC Brand Fonts — Extraidas del logo oficial FreeCloud
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Montserrat Black (900) — coincide con "FREECLOUD" del logo
const fontBrand = Montserrat({
  subsets: ['latin'],
  variable: '--font-brand',
  display: 'swap',
  weight: ['700', '800', '900'], // Solo pesos realmente usados (Black/Bold)
  preload: false, // Brand font — defer para no bloquear FCP
});

// Rajdhani SemiBold — coincide con "NUNCA PARES DE CONSTRUIR." del logo
const fontSlogan = Rajdhani({
  subsets: ['latin'],
  variable: '--font-slogan',
  display: 'swap',
  weight: ['600', '700'], // Solo SemiBold y Bold
  preload: false, // Solo en hero badge — defer para no bloquear FCP
});

export const metadata: Metadata = generateSiteMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth" className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} ${fontBrand.variable} ${fontSlogan.variable}`}>
      <body suppressHydrationWarning className="font-body antialiased min-h-screen flex flex-col">
        <LayoutShell>
          {children}
        </LayoutShell>
        {adsenseId && <AdSenseLoader clientId={adsenseId} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }}
        />
        <Analytics mode="auto" />
        <SpeedInsights sampleRate={0.3} />
      </body>
    </html>
  );
}
