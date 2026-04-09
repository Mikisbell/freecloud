import { Metadata } from 'next';
import { Building2, Code, GraduationCap, MapPin, Briefcase, Download, ExternalLink, Award, Users, CheckCircle2 } from 'lucide-react';
import { Linkedin, Github, Youtube } from '@/components/icons/BrandIcons';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Sobre Mí - Miguel Angel Rivera Ospina',
  description: 'Ingeniero Civil y de Sistemas con más de 8 años de experiencia en construcción, BIM y desarrollo de software. Fundador de FreeCloud y Rivamez.',
};

const SKILL_CATEGORIES = [
  {
    title: 'BIM & Modelado Estructural',
    icon: <Building2 className="w-5 h-5 text-fc-gold" />,
    skills: ['Autodesk Revit 2024-2025', 'Robot Structural Analysis', 'Civil 3D', 'ETABS v21', 'SAP2000', 'Navisworks Manage']
  },
  {
    title: 'Desarrollo & Automatización',
    icon: <Code className="w-5 h-5 text-fc-blue" />,
    skills: ['Python + Revit API', 'Dynamo', 'TypeScript', 'Next.js', 'Supabase', 'Excel Avanzado (VBA)']
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
    year: '2024 - Presente',
    title: 'Consultoría BIM y Desarrollo de Software',
    company: 'FreeCloud & Rivamez',
    description: 'Consultoría BIM para empresas de construcción en Junín y Lima. Desarrollo de herramientas de automatización con Python y Revit API. Lanzamiento de la plataforma educativa freecloud.pe con +40 artículos técnicos.'
  },
  {
    year: '2022 - 2023',
    title: 'Coordinador BIM - Proyectos Multifamiliares',
    company: 'Proyectos en Lima Metropolitana',
    description: 'Coordinación de modelos BIM para edificios de 5-8 pisos en Breña, San Isidro y Surco. Modelado estructural en Revit + ETABS, clash detection en Navisworks, y gestión de CDE en BIM 360.'
  },
  {
    year: '2020 - 2021',
    title: 'Ingeniero Estructural',
    company: 'Consultora de Ingeniería, Huancayo',
    description: 'Diseño estructural de viviendas y edificaciones comerciales en la sierra central. Cálculo de cimentaciones, pórticos y muros de corte según normas E.030, E.050 y E.060.'
  },
  {
    year: '2016 - 2019',
    title: 'Dibujante y Modelador CAD',
    company: 'Oficina de Ingeniería, Huancayo',
    description: 'Inicio de carrera dibujando planos estructurales en AutoCAD. Evolución hacia modelado 3D y primeros contactos con Revit. Base que me permitió entender la transición de CAD a BIM desde la práctica.'
  }
];

const CERTIFICATIONS = [
  { name: 'Autodesk Certified Professional: Revit for Structural Design', year: '2023' },
  { name: 'Dynamo BIM Fundamentals', institution: 'Autodesk University', year: '2022' },
  { name: 'Python for Engineers', institution: 'Coursera', year: '2021' },
  { name: 'Ingeniería Civil', institution: 'Universidad Nacional del Centro del Perú (UNCP)', year: 'Graduado' },
  { name: 'Ingeniería de Sistemas', institution: 'Universidad Peruana Los Andes', year: 'Graduado' },
];

export default function SobreMiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Miguel Angel Rivera Ospina',
    jobTitle: 'Ingeniero Civil e Ingeniero de Sistemas',
    description: 'Consultor BIM, desarrollador de software y creador de contenido técnico para ingenieros civiles en Perú y Latinoamérica.',
    url: 'https://freecloud.pe/sobre-mi',
    image: 'https://freecloud.pe/me.png',
    sameAs: [
      'https://www.linkedin.com/in/mikisbell/',
      'https://www.youtube.com/@mikisbell',
      'https://github.com/mikisbell'
    ],
    worksFor: [
      { '@type': 'Organization', name: 'FreeCloud' },
      { '@type': 'Organization', name: 'Rivamez' }
    ],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Universidad Nacional del Centro del Perú' },
      { '@type': 'CollegeOrUniversity', name: 'Universidad Peruana Los Andes' }
    ],
    knowsAbout: ['BIM', 'Revit', 'Structural Engineering', 'Python', 'ETABS', 'AutoCAD', 'Civil Engineering', 'Peru Building Codes'],
    worksLocation: {
      '@type': 'Place',
      name: 'Huancayo, Junín, Perú'
    }
  };

  return (
    <>
      {/* JSON-LD Schema para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ESTANDARIZADO 2026 ── */}
      <PageHeader
        badge="Sobre Mí"
        title={<>Miguel Angel <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light block md:inline">Rivera Ospina</span></>}
        description="Ingeniero Civil & Ingeniero de Sistemas — Consultor BIM, Desarrollador y Creador de Contenido Técnico"
      />

      {/* CONTENEDOR GLOBAL TIPO BLOG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── PERFIL Y REDES (Top Section) ── */}
        <section className="py-10 border-b border-surface-100">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 border-4 border-white bg-surface-50 mx-auto">
              <img src="/me.png" alt="Miguel Angel Rivera Ospina" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-center text-center gap-4">
               <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-surface-600">
                <span className="flex items-center gap-1.5 bg-surface-100 border border-surface-200 px-3 py-1 rounded-full"><MapPin className="w-4 h-4 text-fc-cyan" /> Huancayo, Perú</span>
                <span className="flex items-center gap-1.5 bg-surface-100 border border-surface-200 px-3 py-1 rounded-full"><Building2 className="w-4 h-4 text-fc-gold" /> FreeCloud &amp; Rivamez</span>
                <span className="flex items-center gap-1.5 bg-surface-100 border border-surface-200 px-3 py-1 rounded-full"><GraduationCap className="w-4 h-4 text-fc-blue" /> Doble Ingeniería</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                <Link href="#contacto" className="flex items-center gap-2 bg-fc-blue hover:bg-fc-navy text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-fc-blue/30 border border-fc-blue/50">
                  Contactar
                </Link>
                <div className="flex items-center gap-3">
                  <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 text-surface-400 bg-surface-50 hover:text-fc-blue hover:bg-surface-100 rounded-lg transition-colors border border-surface-200">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 text-surface-400 bg-surface-50 hover:text-fc-blue hover:bg-surface-100 rounded-lg transition-colors border border-surface-200">
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="p-2.5 text-surface-400 bg-surface-50 hover:text-fc-blue hover:bg-surface-100 rounded-lg transition-colors border border-surface-200">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-3xl mx-auto">

          {/* Stats - Staggered fade in */}
          <section className="py-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="bg-surface-50 border border-surface-200 rounded-2xl p-6 text-center hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-fc-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-4xl font-display font-bold text-fc-navy-deep relative z-10">{stat.number}</p>
                  <p className="text-sm text-surface-500 font-medium mt-1 relative z-10">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bio / Timeline */}
          <section className="py-12 border-t border-surface-100 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900">Mi Trayectoria</h2>
              <div className="h-px bg-surface-200 flex-1" />
            </div>

            <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-start">
              <div className="prose-blog text-surface-600">
                <p className="text-lg leading-relaxed">
                  Soy una mezcla poco común: <strong>ingeniero civil e ingeniero de sistemas.</strong> Esa combinación
                  me permite ver la construcción desde dos perspectivas que normalmente no se cruzan —
                  la del calculista que entiende la norma E.030 y la del programador que puede automatizar
                  un flujo de trabajo en Revit con Python.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Empecé mi carrera en 2016 dibujando planos en AutoCAD para una oficina de ingeniería en Huancayo. 
                  Con el tiempo, pasé al modelado 3D, luego a la coordinación BIM, y finalmente al desarrollo 
                  de software para automatizar todo el proceso. Hoy combino consultoría BIM con desarrollo 
                  de herramientas y creación de contenido educativo para ingenieros en Perú y Latinoamérica.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Perú está en un momento crítico. La obligatoriedad de BIM desde agosto 2026 (Ley 32069) va a
                  transformar cómo trabajamos. Este espacio existe para cerrar esa brecha: tutoriales con datos reales 
                  de proyectos que he ejecutado, herramientas que uso en mi trabajo diario, y opiniones honestas 
                  sobre qué funciona y qué no en la práctica.
                </p>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-fc-blue/20 before:via-surface-200 before:to-transparent">
                {TIMELINE.map((item, index) => (
                  <div key={index} className="relative flex items-center group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-surface-50 bg-fc-blue text-white shadow shrink-0 absolute left-0 -ml-4 z-10">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="w-full ml-10 p-5 rounded-2xl bg-surface-50 border border-surface-100 shadow-sm hover:shadow-md transition-shadow">
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
          </section>

          {/* Certifications & Education */}
          <section className="py-12 border-t border-surface-100">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900">Formación y Certificaciones</h2>
              <div className="h-px bg-surface-200 flex-1" />
            </div>

            <div className="space-y-4">
              {CERTIFICATIONS.map((cert, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl border border-surface-200">
                  <Award className="w-5 h-5 text-fc-gold shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-surface-900">{cert.name}</p>
                    {cert.institution && <p className="text-sm text-surface-500">{cert.institution}</p>}
                  </div>
                  <span className="text-sm text-surface-400 font-mono">{cert.year}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Grid */}
          <section className="py-12 border-t border-surface-100 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900">Stack Tecnológico</h2>
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
          </section>

          {/* CTA / Contact */}
          <section id="contacto" className="py-16 mb-12">
            <div className="bg-surface-900 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                <div className="w-96 h-96 bg-fc-blue/20 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 tracking-tight">
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
          </section>

        </div>
      </div>
    </>
  );
}
