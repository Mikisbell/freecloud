import Link from 'next/link';
import { Code, Youtube, Mail, MapPin } from 'lucide-react';
import Newsletter from './Newsletter';
import { siteConfig } from '@/config/site';

const FOOTER_LINKS = {
  'Contenido': [
    { label: 'Blog', href: '/blog' },
    { label: 'Tutoriales Revit', href: '/blog?cat=revit' },
    { label: 'BIM Perú', href: '/blog?cat=bim-peru' },
    { label: 'Python + BIM', href: '/blog?cat=python' },
    { label: 'Análisis Estructural', href: '/blog?cat=analisis-estructural' },
  ],
  'Recursos': [
    { label: 'Plantillas Excel', href: '/recursos?type=excel' },
    { label: 'Scripts Python', href: '/recursos?type=python' },
    { label: 'Programas HP Prime', href: '/recursos?type=hp-prime' },
    { label: 'Familias Revit', href: '/recursos?type=revit' },
    { label: 'Web Apps', href: '/apps' },
  ],
  'Empresa': [
    { label: 'Sobre Mí', href: '/sobre-mi' },
    { label: 'Rivamez Constructora', href: 'https://rivamez.com', external: true },
    { label: 'Contacto', href: '/sobre-mi#contacto' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300 mt-20">
      {/* Newsletter band */}
      <div className="bg-gradient-to-r from-fc-navy to-fc-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-display font-bold text-white mb-1">
                Únete a +500 ingenieros
              </h3>
              <p className="text-fc-cyan/80 text-sm">
                Recibe tutoriales BIM, plantillas gratuitas y noticias de normativa cada semana.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <Newsletter variant="inline" />
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-fc-cyan to-fc-navy rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-surface-400 mb-4">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3">
              <a href={siteConfig.links.youtube} target="_blank" rel="noopener" className="w-9 h-9 bg-surface-800 hover:bg-fc-navy rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} target="_blank" rel="noopener" className="w-9 h-9 bg-surface-800 hover:bg-fc-navy rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-400 hover:text-fc-cyan transition-colors"
                      {...('external' in link && link.external ? { target: '_blank', rel: 'noopener' } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-surface-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-surface-500">
            <MapPin className="w-3 h-3" />
            <span>{siteConfig.contact.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
