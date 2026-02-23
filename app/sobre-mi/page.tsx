import { Metadata } from 'next';
import { Building2, Code, GraduationCap, Award, MapPin, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Mí - Miguel Angel Rivera Ospina',
  description: 'Ingeniero Civil y de Sistemas con más de 8 años de experiencia en construcción, BIM y desarrollo de software. Fundador de FreeCloud y Rivamez.',
};

const SKILLS = [
  { name: 'Autodesk Revit', level: 90 },
  { name: 'Robot Structural', level: 85 },
  { name: 'Python + Revit API', level: 85 },
  { name: 'Dynamo', level: 80 },
  { name: 'TypeScript / Next.js', level: 90 },
  { name: 'Excel Avanzado', level: 95 },
  { name: 'Civil 3D', level: 75 },
  { name: 'ETABS / SAP2000', level: 70 },
];

const STATS = [
  { number: '150+', label: 'Proyectos completados' },
  { number: '8+', label: 'Años de experiencia' },
  { number: '2', label: 'Empresas fundadas' },
  { number: '2', label: 'Ingenierías (Civil + Sistemas)' },
];

export default function SobreMiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="w-32 h-32 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white text-4xl font-display font-bold shadow-xl shadow-brand-500/20 flex-shrink-0">
          MR
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-2">
            Miguel Angel Rivera Ospina
          </h1>
          <p className="text-lg text-surface-500 mb-3">
            Ingeniero Civil &amp; Ingeniero de Sistemas
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-surface-400">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Huancayo, Perú</span>
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> FreeCloud &amp; Rivamez</span>
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> 150+ proyectos</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-brand-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-brand-700">{stat.number}</p>
            <p className="text-xs text-brand-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bio */}
      <div className="prose-blog mb-12">
        <h2>Mi historia</h2>
        <p>
          Soy una mezcla poco común: ingeniero civil e ingeniero de sistemas. Esa combinación
          me permite ver la construcción desde dos perspectivas que normalmente no se cruzan —
          la del calculista que entiende la norma E.030 y la del programador que puede automatizar
          un flujo de trabajo en Revit con Python.
        </p>
        <p>
          Fundé <strong>FreeCloud</strong> hace más de 8 años en Huancayo. Lo que empezó como
          una empresa de desarrollo de software evolucionó naturalmente hacia la intersección
          de tecnología y construcción. Hoy, con más de 150 proyectos completados, FreeCloud
          combina desarrollo de software, implementación BIM y consultoría tecnológica.
        </p>
        <p>
          Con <strong>Rivamez</strong> me dedico al lado más físico: construcción, arquitectura
          e ingeniería. Esa experiencia de obra es la que me permite hablar de BIM con conocimiento
          de campo, no solo de escritorio.
        </p>

        <h2>¿Por qué este blog?</h2>
        <p>
          Perú está en un momento crítico. La obligatoriedad de BIM desde agosto 2026 va a
          transformar cómo trabajamos los ingenieros. Pero hay una brecha enorme de capacitación,
          especialmente fuera de Lima.
        </p>
        <p>
          Este blog existe para cerrar esa brecha. Aquí comparto tutoriales, herramientas y
          recursos que hubiera querido tener cuando empecé con BIM. Todo en español, con
          ejemplos reales de proyectos peruanos y normativa local.
        </p>

        <h2>¿Qué encontrarás aquí?</h2>
        <p>
          Tutoriales prácticos de Revit, Robot Structural, Dynamo y Python aplicado a BIM.
          Plantillas Excel de diseño sísmico y metrados. Programas para HP Prime. Web apps
          gratuitas como la calculadora sísmica E.030. Y análisis actualizado de la normativa
          BIM peruana.
        </p>
      </div>

      {/* Skills */}
      <div className="mb-12">
        <h2 className="text-xl font-display font-bold text-surface-900 mb-6">Habilidades</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {SKILLS.map(skill => (
            <div key={skill.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-surface-700">{skill.name}</span>
                <span className="text-surface-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-1000"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-surface-900 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-display font-bold text-white mb-2">
          ¿Trabajamos juntos?
        </h2>
        <p className="text-surface-400 text-sm mb-6 max-w-md mx-auto">
          Consultoría BIM, desarrollo de herramientas a medida o capacitación para tu equipo.
        </p>
        <a
          href="mailto:contacto@freecloud.pe"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-500 transition-colors"
        >
          Contactar →
        </a>
      </div>
    </div>
  );
}
