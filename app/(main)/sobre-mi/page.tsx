import { Metadata } from 'next';
import { Building2, Code, GraduationCap, MapPin, Briefcase, Linkedin, Github, Youtube, Download, ExternalLink } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Mí - Miguel Angel Rivera Ospina',
  description: 'Ingeniero Civil y de Sistemas con más de 8 años de experiencia en construcción, BIM y desarrollo de software. Fundador de FreeCloud y Rivamez.',
};

const SKILL_CATEGORIES = [
  {
    title: 'BIM & Ingeniería',
    icon: <Building2 className="w-5 h-5 text-fc-gold" />,
    skills: ['Autodesk Revit', 'Robot Structural', 'Civil 3D', 'ETABS', 'SAP2000']
  },
  {
    title: 'Desarrollo & Automatización',
    icon: <Code className="w-5 h-5 text-fc-blue" />,
    skills: ['Python + Revit API', 'Dynamo', 'TypeScript', 'Next.js', 'Excel Avanzado', 'Bases de Datos']
  }
];

const STATS = [
  { number: '150+', label: 'Proyectos completados' },
  { number: '8+', label: 'Años de experiencia' },
  { number: '2', label: 'Empresas fundadas' },
  { number: '2', label: 'Ingenierías (Civil + Sist)' },
];

const TIMELINE = [
  {
    year: 'Presente',
    title: 'CEO & Fundador',
    company: 'FreeCloud & Rivamez',
    description: 'Liderando la intersección entre ingeniería civil y tecnología. Consultoría BIM, desarrollo a medida y ejecución de proyectos físicos reales en Perú.'
  },
  {
    year: 'Hace +8 años',
    title: 'Inicios en Tecnología',
    company: 'FreeCloud',
    description: 'Fundación de FreeCloud como empresa de desarrollo de software, que luego evolucionó naturalmente para integrar el mundo de la construcción.'
  }
];

export default function SobreMiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Miguel Angel Rivera Ospina',
    jobTitle: 'Ingeniero Civil e Ingeniero de Sistemas',
    url: 'https://freecloud.pe/sobre-mi',
    image: 'https://freecloud.pe/me.png',
    sameAs: [
      'https://www.linkedin.com/in/miguel-angel-rivera-ospina',
      'https://youtube.com/@FreeCloud'
    ],
    worksFor: [
      {
        '@type': 'Organization',
        name: 'FreeCloud'
      },
      {
        '@type': 'Organization',
        name: 'Rivamez'
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Schema para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 overflow-hidden">

        {/* Header - Animate in */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-2xl shadow-fc-blue/20 flex-shrink-0 border-4 border-white dark:border-surface-800 relative z-10 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-fc-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img src="/me.png" alt="Miguel Angel Rivera Ospina" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-surface-900 mb-3 tracking-tight">
              Miguel Angel Rivera Ospina
            </h1>
            <p className="text-xl text-surface-600 mb-6 font-medium">
              Ingeniero Civil &amp; Ingeniero de Sistemas
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-surface-500 mb-8">
              <span className="flex items-center gap-1.5 bg-surface-100 px-3 py-1 rounded-full"><MapPin className="w-4 h-4 text-fc-blue" /> Huancayo, Perú</span>
              <span className="flex items-center gap-1.5 bg-surface-100 px-3 py-1 rounded-full"><Building2 className="w-4 h-4 text-fc-gold" /> FreeCloud &amp; Rivamez</span>
              <span className="flex items-center gap-1.5 bg-surface-100 px-3 py-1 rounded-full"><GraduationCap className="w-4 h-4 text-fc-blue" /> Doble Ingeniería</span>
            </div>

            {/* Redes y CTA */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link href="#" className="flex items-center gap-2 bg-fc-blue hover:bg-fc-navy text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-fc-blue/30">
                <Download className="w-4 h-4" />
                Descargar CV
              </Link>
              <div className="flex items-center gap-3 ml-2">
                <a href="#" className="p-2.5 text-surface-400 hover:text-[#0A66C2] hover:bg-surface-100 rounded-lg transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="p-2.5 text-surface-400 hover:text-[#FF0000] hover:bg-surface-100 rounded-lg transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="p-2.5 text-surface-400 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors" aria-label="GitHub">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats - Staggered fade in */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="bg-surface-50 border border-surface-200 rounded-2xl p-6 text-center hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-fc-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-4xl font-display font-bold text-fc-navy-deep relative z-10">{stat.number}</p>
              <p className="text-sm text-surface-500 font-medium mt-1 relative z-10">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bio / Timeline */}
        <div className="mb-20 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-display font-bold text-surface-900">Mi Trayectoria</h2>
            <div className="h-px bg-surface-200 flex-1" />
          </div>

          <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
            <div className="prose-blog text-surface-600">
              <p className="text-lg leading-relaxed">
                Soy una mezcla poco común: <strong>ingeniero civil e ingeniero de sistemas.</strong> Esa combinación
                me permite ver la construcción desde dos perspectivas que normalmente no se cruzan —
                la del calculista que entiende la norma E.030 y la del programador que puede automatizar
                un flujo de trabajo en Revit con Python.
              </p>
              <p className="text-lg leading-relaxed">
                Perú está en un momento crítico. La obligatoriedad de BIM desde agosto 2026 va a
                transformar cómo trabajamos. Este espacio existe para cerrar esa brecha compartiendo tutoriales,
                herramientas y recursos reales, bajo la normativa peruana.
              </p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-fc-blue/20 before:via-surface-200 before:to-transparent">
              {TIMELINE.map((item, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="hidden md:block md:w-1/2" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-surface-50 bg-fc-blue text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-4 md:ml-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] ml-12 md:ml-0 p-5 rounded-2xl bg-surface-50 border border-surface-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-surface-900 text-lg">{item.title}</h3>
                      <span className="text-xs font-mono font-medium text-fc-blue bg-fc-blue/10 px-2 py-1 rounded-md">{item.year}</span>
                    </div>
                    <div className="text-sm font-medium text-surface-500 mb-3 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> {item.company}
                    </div>
                    <p className="text-surface-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-display font-bold text-surface-900">Stack Tecnológico</h2>
            <div className="h-px bg-surface-200 flex-1" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {SKILL_CATEGORIES.map(category => (
              <div key={category.title} className="bg-surface-50/50 p-6 rounded-3xl border border-surface-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-surface-100">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-surface-900 text-lg">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-white border border-surface-200 rounded-xl text-sm font-medium text-surface-700 shadow-sm hover:border-fc-blue/30 hover:text-fc-blue transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA / Contact */}
        <div id="contacto" className="bg-surface-900 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
            <div className="w-96 h-96 bg-fc-blue/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">
                ¿Trabajamos juntos?
              </h2>
              <p className="text-surface-300 text-lg max-w-xl">
                Consultoría BIM, desarrollo de herramientas a medida o capacitación para tu equipo. Hablemos sobre tu próximo proyecto.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
