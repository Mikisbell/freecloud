import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

const FOOTER_LINKS = {
  'Contenido': [
    { label: 'Blog', href: '/blog' },
    { label: 'Tutoriales Revit', href: '/blog?cat=revit' },
    { label: 'BIM Perú', href: '/blog?cat=bim-peru' },
    { label: 'Python + BIM', href: '/blog?cat=python' }
  ],
  'Empresa': [
    { label: 'Servicios', href: '/servicios' },
    { label: 'Recursos', href: '/recursos' },
    { label: 'Sobre Mí', href: '/sobre-mi' },
    { label: 'Contacto', href: '/sobre-mi#contacto' }
  ],
  'Legal': [
    { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
    { label: 'Términos de Uso', href: '/terminos-de-uso' }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Col 1 - Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/logo.png"
                alt="FreeCloud"
                width={160}
                height={40}
                className="brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm mt-3 leading-relaxed text-gray-400">
              BIM, ingeniería civil y tecnología para profesionales en Perú.
            </p>
          </div>

          {/* Cols dinámicas */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-400">
          &copy; 2026 FreeCloud · Huancayo, Perú
        </div>
      </div>
    </footer>
  );
}
