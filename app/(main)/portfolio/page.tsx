import { Metadata } from 'next';
import { Building2, Code, ArrowRight, MapPin, Calendar, CheckCircle2, TrendingUp, Clock, Layers } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Portfolio - Proyectos y Casos de Estudio',
  description: 'Proyectos reales de consultoría BIM, diseño estructural y desarrollo de software. Casos de estudio con datos reales de proyectos en Perú.',
};

const PROJECTS = [
  {
    title: 'Edificio Multifamiliar 6 Pisos — Breña, Lima',
    category: 'Coordinación BIM',
    year: 'Septiembre 2024',
    location: 'Breña, Lima',
    description: 'Coordinación del modelo estructural de un edificio multifamiliar de 6 pisos. El modelo arquitectónico venía de Revit 2024. Mi trabajo: extraer la estructura, analizarla en ETABS 21, y devolver los resultados al modelo coordinado.',
    challenge: 'El primer intento de exportación fue un desastre: columnas con secciones incorrectas (50x50 en vez de 40x60), niveles desplazados 15cm, y muros de corte importados como "generic models" sin propiedades estructurales.',
    solution: 'Después de 3 intentos, encontré el flujo correcto usando CSiXRevit en vez de IFC. IFC pierde las propiedades estructurales. CSiXRevit las mantiene.',
    result: 'Modelo estructural completo analizado y coordinado en 2 semanas. 48 columnas, 120 vigas, 4 muros de corte. 0 conflictos detectados en la revisión final de Navisworks.',
    tools: ['Revit 2024', 'ETABS 21', 'CSiXRevit', 'Navisworks'],
    icon: <Building2 className="w-6 h-6 text-fc-blue" />,
  },
  {
    title: 'Casa 3 Pisos — El Tambo, Huancayo',
    category: 'Diseño Estructural',
    year: 'Noviembre 2024',
    location: 'El Tambo, Huancayo',
    description: 'Diseño completo de la cimentación y estructura de una vivienda de 3 pisos en zona sísmica 3. Incluye estudio de suelos de GeoPerú SAC con capacidad portante de 2.2 kg/cm² a 1.50m de profundidad.',
    challenge: 'Durante la construcción, detecté que el maestro de obra estaba poniendo estribos a 25cm en vez de los 15cm calculados. Si no lo hubiera detectado, la zapata habría fallado por punzonamiento bajo carga sísmica.',
    solution: 'Rediseñé la zapata a 1.80x1.80x0.50m con f\'c=210 kg/cm² y acero fy=4200 kg/cm². Supervisión directa en obra para verificar el armado correcto del acero.',
    result: 'Estructura completada sin observaciones. Zapata funcionando correctamente. Costo total de cimentación: S/ 8,500 (incluyendo materiales y mano de obra).',
    tools: ['ETABS', 'AutoCAD', 'Excel (memoria de cálculo)'],
    icon: <Building2 className="w-6 h-6 text-fc-gold" />,
  },
  {
    title: 'Edificio Oficinas 5 Pisos — San Isidro, Lima',
    category: 'Revisión Estructural',
    year: 'Marzo 2025',
    location: 'San Isidro, Lima',
    description: 'Revisión del modelo ETABS de un edificio de oficinas. El ingeniero anterior había configurado el espectro sísmico con R=10 (sistema dual) cuando la estructura solo tenía pórticos en una dirección.',
    challenge: 'El error inflaba las derivas un 30%. El edificio parecía más flexible de lo que era, y se estaba sobredimensionando el acero en un 15%. Eso son ~S/ 28,000 de acero extra innecesario.',
    solution: 'Corrección del espectro sísmico a R=7 según Tabla 11 de la E.030. Re-cálculo completo de derivas y redimensionamiento de elementos estructurales.',
    result: 'Ahorro de S/ 28,000 en acero. Derivas dentro del límite de 0.007 de la E.030. Memoria de cálculo corregida y aprobada por la municipalidad.',
    tools: ['ETABS 21', 'Norma E.030', 'Revit 2024'],
    icon: <Building2 className="w-6 h-6 text-fc-navy" />,
  },
  {
    title: 'Automatización de Metrados — Topografía Tarma',
    category: 'Desarrollo de Software',
    year: '2023',
    location: 'Tarma, Junín',
    description: 'Empresa de topografía necesitaba procesar datos de 240 puntos topográficos de un terreno de 5,000 m² en formato CSV. Filtrar, ordenar y calcular volúmenes de corte y relleno.',
    challenge: 'En Excel, el proceso completo tomaba un día completo de trabajo manual: filtrar datos, ordenar por coordenadas, calcular áreas, interpolar cotas, y finalmente calcular volúmenes.',
    solution: 'Script de Python de 40 líneas con Pandas y NumPy. Lee el CSV, filtra puntos por coordenadas, calcula volúmenes de corte y relleno por método de secciones, y genera reporte en Excel.',
    result: 'De 1 día de trabajo manual a 2 segundos de procesamiento. El script se reutilizó en 6 proyectos posteriores, ahorrando ~6 días de trabajo en total.',
    tools: ['Python', 'Pandas', 'NumPy', 'OpenPyXL'],
    icon: <Code className="w-6 h-6 text-fc-cyan" />,
  },
  {
    title: 'Plataforma freecloud.pe — Blog Técnico BIM',
    category: 'Desarrollo Web + Contenido',
    year: '2024-2026',
    location: 'Remoto, Huancayo',
    description: 'Creación y mantenimiento del blog técnico freecloud.pe con +43 artículos sobre BIM, ingeniería civil y tecnología para profesionales en Perú y Latinoamérica.',
    challenge: 'Crear contenido técnico que sea realmente útil (no genérico), con datos de proyectos reales, y que posicione en Google para búsquedas relacionadas con BIM y normativa peruana.',
    solution: 'Artículos basados en experiencias reales de proyectos: números específicos, errores encontrados, soluciones aplicadas. Contenido humanizado con anécdotas y opiniones honestas.',
    result: '+43 artículos publicados. 338+ clics orgánicos desde Google. 58 páginas indexadas. Recursos digitales (plantillas Excel, scripts) con ventas en Gumroad.',
    tools: ['Next.js 16', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
    icon: <Code className="w-6 h-6 text-fc-blue" />,
  },
  {
    title: 'Renombrado Masivo de Vistas — Hospital 4 Pisos, Huancayo',
    category: 'Automatización BIM',
    year: '2024',
    location: 'Huancayo, Junín',
    description: 'Modelo de hospital de 4 pisos con 87 vistas que necesitaban ser renombradas según nomenclatura ISO 19650. Manualmente, un practicante hubiera tardado 2-3 horas.',
    challenge: 'Las vistas tenían nombres inconsistentes: "Level 1", "nivel 1 ", "NIVEL 1", "Nivel 1 - copia". Todas debían seguir el formato "PLANTA-N01".',
    solution: 'Script de Dynamo con 8 nodos: Categories → All Elements of Category → Element.Name → String.Replace → Element.SetName. Tiempo de desarrollo: 15 minutos.',
    result: '87 vistas renombradas en 2 segundos. El script se guardó en la biblioteca de la oficina y se reutilizó en 4 proyectos posteriores.',
    tools: ['Dynamo', 'Revit 2024'],
    icon: <Code className="w-6 h-6 text-fc-gold" />,
  },
];

const EXPERTISE = [
  { icon: <Building2 className="w-5 h-5" />, title: 'Coordinación BIM', description: 'Modelado, análisis y coordinación de proyectos BIM en Revit + ETABS' },
  { icon: <Code className="w-5 h-5" />, title: 'Automatización', description: 'Scripts en Python, Dynamo y pyRevit para optimizar flujos de trabajo' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Consultoría Estructural', description: 'Diseño y revisión de estructuras según normas E.030, E.050, E.060' },
  { icon: <Layers className="w-5 h-5" />, title: 'Capacitación', description: 'Formación de equipos en BIM, Revit, Dynamo y herramientas de productividad' },
];

export default function PortfolioPage() {
  return (
    <>
      {/* ── HERO ESTANDARIZADO 2026 ── */}
      <PageHeader
        badge="PORTFOLIO"
        badgeEmoji="📂"
        title={<>Proyectos Reales, <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light block md:inline">Resultados Medibles</span></>}
        description="Casos de estudio con datos reales de proyectos de consultoría BIM, diseño estructural y desarrollo de software en Perú."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── EXPERTISE SECTION ── */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPERTISE.map((item) => (
              <div key={item.title} className="bg-white border border-surface-200 rounded-2xl p-6 hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-fc-blue/10 rounded-xl flex items-center justify-center text-fc-blue mb-4 group-hover:bg-fc-blue group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section className="py-12">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900">Casos de Estudio</h2>
            <div className="h-px bg-surface-200 flex-1" />
          </div>

          <div className="space-y-12">
            {PROJECTS.map((project, i) => (
              <article
                key={i}
                className="bg-white border border-surface-200 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-surface-100 bg-surface-50/50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-fc-blue/10 rounded-xl flex items-center justify-center shrink-0">
                        {project.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-fc-blue/10 text-fc-blue text-xs font-semibold rounded-full">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-display font-bold text-surface-900">{project.title}</h3>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-1 text-sm text-surface-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {project.location}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {project.year}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-surface-700 uppercase tracking-wider mb-2">Proyecto</h4>
                    <p className="text-surface-600 leading-relaxed">{project.description}</p>
                  </div>

                  {/* Challenge */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-2">⚠️ Desafío</h4>
                    <p className="text-red-800 leading-relaxed text-sm">{project.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="bg-fc-blue/5 border border-fc-blue/10 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-fc-navy uppercase tracking-wider mb-2">✅ Solución</h4>
                    <p className="text-fc-navy-deep leading-relaxed text-sm">{project.solution}</p>
                  </div>

                  {/* Result */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">📊 Resultado</h4>
                    <p className="text-emerald-800 leading-relaxed text-sm">{project.result}</p>
                  </div>

                  {/* Tools */}
                  <div>
                    <h4 className="text-sm font-semibold text-surface-700 uppercase tracking-wider mb-3">Herramientas</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map(tool => (
                        <span key={tool} className="px-3 py-1.5 bg-surface-100 border border-surface-200 rounded-lg text-sm font-medium text-surface-700">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 mb-12">
          <div className="bg-surface-900 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative text-center">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
              <div className="w-96 h-96 bg-fc-blue/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 tracking-tight">
                ¿Tienes un proyecto similar?
              </h2>
              <p className="text-surface-300 text-lg max-w-2xl mx-auto mb-8">
                Estos son solo algunos de los proyectos en los que he trabajado. Si necesitas consultoría BIM, 
                diseño estructural o automatización de procesos, hablemos.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sobre-mi#contacto"
                  className="flex items-center gap-2 bg-fc-blue hover:bg-fc-navy text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-fc-blue/30"
                >
                  Solicitar Cotización
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/servicios"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors border border-white/20"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
