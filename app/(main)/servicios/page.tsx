import { Metadata } from 'next';
import {
    ArrowRight,
    Code2,
    Building2,
    Calculator,
    CheckCircle2,
    Workflow,
    Search,
    Hammer
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Servicios de Consultoría BIM y Desarrollo Tecnológico | FreeCloud',
    description: 'Especialistas en Modelado BIM (LOD 400), desarrollo de scripts Python/API a medida, y cálculo estructural sismorresistente para empresas en Perú.',
};

const TRUST_SIGNALS = [
    '✓ Metodología Ágil',
    '✓ Entregas 100% Documentadas',
    '✓ Cumplimiento Normativo (E.030)',
    '✓ Soporte Post-Despliegue',
];

const SERVICES = [
    {
        id: 'desarrollo',
        icon: <Code2 className="w-8 h-8 text-fc-cyan" />,
        title: 'Desarrollo Tech & Automatización',
        desc: 'Transformamos flujos de trabajo lentos en procesos automáticos con código a medida. Ahorra cientos de horas hombre por proyecto.',
        features: [
            'Scripts en Python para Revit',
            'Desarrollo de APIs e Integraciones',
            'Macros Avanzadas en Excel (VBA)',
            'Web Apps Internas'
        ],
        bgClass: 'bg-surface-50 border-fc-cyan/20'
    },
    {
        id: 'bim',
        icon: <Building2 className="w-8 h-8 text-fc-blue" />,
        title: 'Consultoría y Modelado BIM',
        desc: 'Implementación BIM real para obras de ingeniería civil. Modelos precisos que previenen interferencias antes de llegar a campo.',
        features: [
            'Modelado LOD 300 - LOD 400',
            'Detección de Interferencias (Navisworks)',
            'Extracción Cuantitativa (Metrados)',
            'Implementación de BEP'
        ],
        bgClass: 'bg-surface-50 border-fc-blue/20'
    },
    {
        id: 'estructuras',
        icon: <Calculator className="w-8 h-8 text-fc-gold" />,
        title: 'Ingeniería Estructural',
        desc: 'Diseño analítico y detallado de edificaciones seguras y eficientes, optimizando materiales bajo normativas vigentes.',
        features: [
            'Cálculo Sismorresistente (E.030)',
            'Expedientes Técnicos',
            'Evaluación Estructural',
            'Cimentaciones Complejas'
        ],
        bgClass: 'bg-surface-50 border-fc-gold/20'
    }
];

const PROCESS_STEPS = [
    {
        num: '01',
        title: 'Auditoría Inicial',
        desc: 'Analizamos tus flujos de trabajo o planos actuales sin compromiso para identificar cuellos de botella.',
        icon: <Search className="w-6 h-6 text-fc-cyan" />
    },
    {
        num: '02',
        title: 'Desarrollo & Modelado',
        desc: 'Ejecutamos el código o estructuramos el modelo BIM con reportes semanales de avance continuo.',
        icon: <Hammer className="w-6 h-6 text-fc-blue" />
    },
    {
        num: '03',
        title: 'Entrega & Capacitación',
        desc: 'Te entregamos el producto final junto con manuales, código fuente y talleres de capacitación a tu equipo.',
        icon: <CheckCircle2 className="w-6 h-6 text-fc-cyan" />
    }
];

export default function ServiciosPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'FreeCloud Consultoría BIM y Desarrollo',
        image: 'https://freecloud.pe/logo.png',
        description: 'Especialistas en Modelado BIM (LOD 400), desarrollo de scripts Python/API a medida, y cálculo estructural sismorresistente para empresas en Perú.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lima',
            addressCountry: 'PE'
        },
        url: 'https://freecloud.pe/servicios'
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* ── HERO ESTANDARIZADO 2026 ── */}
            <PageHeader
                badge="Servicios B2B"
                title={<>Aceleramos tu ingeniería con <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light block md:inline">Código y BIM</span></>}
                description="Soluciones tecnológicas a medida para empresas constructoras y estudios de diseño que necesitan escalar sus operaciones sin multiplicar sus costos."
            />

            {/* CONTENEDOR GLOBAL TIPO BLOG */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* ── ACCIONES Y TRUST SIGNALS (Intro) ── */}
                <section className="py-12 border-b border-surface-200">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-1">
                        <a
                            href="#contacto"
                            className="w-full sm:w-auto px-8 py-4 bg-fc-cyan text-fc-navy font-bold rounded-lg hover:bg-white hover:shadow-lg hover:shadow-fc-cyan/20 transition-all duration-300 text-lg flex items-center justify-center gap-2 group"
                        >
                            Agendar Reunión Técnica
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="#metodologia"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-surface-300 text-surface-700 font-semibold rounded-lg hover:bg-surface-50 transition-all duration-300 text-lg flex items-center justify-center gap-2"
                        >
                            Ver Metodología
                            <Workflow className="w-5 h-5 opacity-70" />
                        </a>
                    </div>

                    {/* Trust signals */}
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-10 mt-10 border-t border-surface-100 animate-slide-up stagger-2">
                        <span className="text-sm text-surface-500 font-semibold uppercase tracking-widest w-full md:w-auto mb-2 md:mb-0">Nuestro Estándar:</span>
                        {TRUST_SIGNALS.map((signal, idx) => (
                            <span key={idx} className="text-sm font-medium text-surface-600 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-fc-cyan" />
                                {signal.replace('✓ ', '')}
                            </span>
                        ))}
                    </div>
                </section>

                {/* ── SERVICIOS CORE GRID ── */}
                <section className="py-12 md:py-16 relative" id="servicios">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900 mb-4">
                            ¿Cómo podemos ayudarte?
                        </h2>
                        <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                            No hacemos plantillas genéricas. Nos metemos al barro de tus procesos para construir herramientas que realmente multipliquen tus márgenes.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {SERVICES.map((service, i) => (
                            <div
                                key={service.id}
                                className={`dataiku-card p-8 flex flex-col hover:shadow-xl transition-shadow duration-300 ${service.bgClass} border-t-4`}
                                style={{ animationDelay: `${i * 150}ms` }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-display font-bold text-surface-900 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-surface-600 mb-8 leading-relaxed flex-1">
                                    {service.desc}
                                </p>
                                <ul className="space-y-3 mt-auto">
                                    {service.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-3 text-surface-700 font-medium">
                                            <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── METODOLOGÍA (TIMELINE) ── */}
                <section className="py-16 border-t border-surface-100" id="metodologia">
                    <div className="text-center mb-12">
                        <span className="text-fc-blue font-bold tracking-wider text-sm uppercase mb-2 block">El Proceso</span>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900 mb-4">
                            Transparencia desde el día 1
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                        {/* Línea conectora desktop */}
                        <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-surface-100 -z-10" />

                        {PROCESS_STEPS.map((step, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-surface-50 border-4 border-white shadow-lg flex items-center justify-center mb-6 relative z-10">
                                    {step.icon}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-fc-navy text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                        {step.num}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-surface-900 mb-3">{step.title}</h3>
                                <p className="text-surface-600 leading-relaxed max-w-xs">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FORMULARIO DE CONTACTO INTEGRADO ── */}
                <section className="py-16 border-t border-surface-100 mb-12" id="contacto">
                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="bg-dataiku-navy text-white rounded-2xl shadow-2xl p-8 md:p-12 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-fc-blue/20 rounded-full blur-[100px] pointer-events-none" />

                            <div className="text-center mb-10 relative z-10">
                                <h2 className="text-2xl md:text-3xl font-display font-black mb-4">
                                    Empecemos tu proyecto
                                </h2>
                                <p className="text-surface-300 text-lg max-w-xl mx-auto">
                                    Cuéntame los detalles técnicos de tu necesidad y te responderé en menos de 24 horas con una propuesta o para agendar una call.
                                </p>
                            </div>

                            <form
                                action="https://formspree.io/f/mqkolgve"
                                method="POST"
                                className="space-y-6 relative z-10"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-surface-300 mb-2">Nombre o Empresa</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full bg-surface-800/50 border border-surface-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fc-cyan transition-all"
                                            placeholder="Ingenieros SAC"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-surface-300 mb-2">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full bg-surface-800/50 border border-surface-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fc-cyan transition-all"
                                            placeholder="contacto@empresa.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="service" className="block text-sm font-semibold text-surface-300 mb-2">Servicio de Interés</label>
                                    <select
                                        id="service"
                                        name="service"
                                        className="w-full bg-surface-800/50 border border-surface-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fc-cyan transition-all appearance-none"
                                    >
                                        <option value="desarrollo">Desarrollo Tech & Automatización</option>
                                        <option value="bim">Consultoría y Modelado BIM</option>
                                        <option value="estructuras">Ingeniería Estructural</option>
                                        <option value="otro">Otro / Consulta General</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-surface-300 mb-2">Detalles del Proyecto</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        required
                                        className="w-full bg-surface-800/50 border border-surface-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fc-cyan transition-all resize-y"
                                        placeholder="Describe brevemente tus requerimientos o el problema a resolver..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-fc-cyan text-fc-navy font-bold text-lg rounded-lg px-8 py-4 hover:bg-white hover:shadow-lg hover:shadow-fc-cyan/20 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Enviar Solicitud
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
