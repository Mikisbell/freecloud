/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  compress: true,
  poweredByHeader: false,
  // Elimina console.* en producción (pueden causar forced reflow si leen DOM)
  compiler: {
    removeConsole: { exclude: ['error', 'warn'] },
  },
  // Tree-shaking de paquetes de iconos — solo importa los íconos que se usan
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // ▶ 2026 Best Practice: inline CSS elimina el request render-blocking de Tailwind
    // Tailwind genera CSS compacto ~15KB — inlinear es net positive para FCP/LCP.
    // Trade-off: no caching de CSS, pero con PPR el HTML ya no se cachea por usuario.
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      // Cache largo para assets estáticos de Next.js — resuelve auditoría Lighthouse
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache moderado para imágenes del sitio
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // X-XSS-Protection eliminado — deprecated en 2025/2026, causa errores en consola (Lighthouse "Usa API obsoletas")
          // Los CSP modernos con script-src son la solución recomendada (OWASP 2024+)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // COOP: resuelve diagnóstico de Lighthouse. allow-popups porque AdSense abre ventanas emergentes
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          // Content-Security-Policy compatible con Google AdSense
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + Google AdSense / Analytics / Fonts + Vercel
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.vercel-insights.com https://vitals.vercel-insights.com https://*.adtrafficquality.google",
              // Estilos: self + inline (necesario para MDX/Tailwind) + Google Fonts + KaTeX
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fuentes
              "font-src 'self' https://fonts.gstatic.com",
              // Imágenes: self + supabase + youtube + google + data URIs
              "img-src 'self' data: blob: https://*.supabase.co https://img.youtube.com https://www.google.com https://www.gstatic.com https://pagead2.googlesyndication.com https://*.googleusercontent.com https://adservice.google.com https://*.adtrafficquality.google",
              // Frames: solo YouTube y Google AdSense
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://*.adtrafficquality.google",
              // Conexiones: self + supabase + google + vercel analytics
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://vitals.vercel-insights.com https://pagead2.googlesyndication.com https://adservice.google.com https://ep1.adtrafficquality.google",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
