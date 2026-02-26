/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
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
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Content-Security-Policy compatible con Google AdSense
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + Google AdSense / Analytics / Fonts + Vercel
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.vercel-insights.com https://vitals.vercel-insights.com",
              // Estilos: self + inline (necesario para MDX/Tailwind) + Google Fonts + KaTeX
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fuentes
              "font-src 'self' https://fonts.gstatic.com",
              // Imágenes: self + supabase + youtube + google + data URIs
              "img-src 'self' data: blob: https://*.supabase.co https://img.youtube.com https://www.google.com https://www.gstatic.com https://pagead2.googlesyndication.com https://*.googleusercontent.com https://adservice.google.com",
              // Frames: solo YouTube y Google AdSense
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
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
