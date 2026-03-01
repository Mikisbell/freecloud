import { Metadata } from 'next';
import { Bot, Building2, Code2, ArrowRight, CheckCircle2, MessageSquare, Wrench, HardHat } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Servicios - Consultoría BIM y Desarrollo a Medida',
    description: 'Soluciones B2B donde la ingeniería civil y el código se encuentran. Consultoría BIM, desarrollo de macros, scripts Python y diseño estructural.',
    openGraph: {
        title: 'Servicios de Consultoría BIM y Desarrollo - FreeCloud',
        description: 'Transforma tu flujo de trabajo en ingeniería y construcción. Automatización, Revit API, y Estructuras.',
    }
};

const SERVICES = [
    {
        icon: <Code2 className="w-8 h-8 text-fc-cyan" />,
        title: 'Desarrollo de Software a Medida',
        description: 'Automatizamos los cuellos de botella de tu equipo técnico. Deja que el software haga el trabajo repetitivo.',
        features: [
            'Scripts en Python para Revit API',
            'Rutinas avanzadas en Dynamo BIM',
            'Plantillas Excel inteligentes con Macros VBA',
            'Aplicaciones web para gestión de proyectos'
        ],
        color: 'border-fc-cyan/20 hover:border-fc-cyan/50',
        bgIcon: 'bg-fc-cyan/10'
    },
    {
        icon: <Building2 className="w-8 h-8 text-fc-gold" />,
        title: 'Consultoría e Implementación BIM',
        description: 'Prepara a tu empresa para el mandato BIM Perú 2026. Te guiamos desde el modelado hasta la gestión de la información.',
        features: [
            'Redacción de Planes de Ejecución BIM (PEB)',
            'Estandarización de flujos y plantillas corporativas',
            'Modelado 3D avanzado interdisciplinario (LOD 300-400)',
            'Capacitación de equipos presencial y remota'
        ],
        color: 'border-fc-gold/20 hover:border-fc-gold/50',
        bgIcon: 'bg-fc-gold/10'
    },
    {
        icon: <HardHat className="w-8 h-8 text-fc-blue" />,
        title: 'Ingeniería Estructural',
        description: 'Diseño sismorresistente hiper-optimizado ejecutado por especialistas con experiencia de campo a través de Rivamez.',
        features: [
            'Cálculo y diseño en concreto armado (E.030, E.060)',
            'Desarrollo de expedientes técnicos',
            'Elaboración de planos estructurales de alto nivel',
            'Supervisión y residencia de obra civil'
        ],
        color: 'border-fc-blue/20 hover:border-fc-blue/50',
        bgIcon: 'bg-fc-blue/10'
    }
];

const METHODOLOGY = [
    { step: '01', title: 'Diagnóstico', desc: 'Analizamos profundamente tu flujo actual para detectar dónde la tecnología o la automatización pueden tener el mayor impacto técnico y financiero.' },
    { step: '02', title: 'Propuesta Técnica', desc: 'Presentamos una solución documentada, con tiempos claros, alcance cerrado y un retorno de inversión (ROI) estimado para tu empresa.' },
    { step: '03', title: 'Desarrollo', desc: 'En metodologías ágiles, desarrollamos el script, modelo o consultoría manteniendo feedback constante contigo.' },
    { step: '04', title: 'Implementación', desc: 'Entregamos el producto y capacitamos a tu equipo para asegurar la adopción real de la solución en tu oficina.' }
];

export default function ServiciosPage() {
    return (
        <div className="bg-surface-50 min-h-screen">

            {/* ── HERO SECTION ── */}
            <section className="relative overflow-hidden bg-dataiku-navy border-b-4 border-fc-gold pt-24 pb-32">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fc-cyan/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fc-blue/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-fc-cyan text-sm font-semibold tracking-wide uppercase mb-8">
                        <Wrench className="w-4 h-4" /> B2B Engineering Solutions
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight tracking-tight">
                        Donde la <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-gold to-fc-gold-light">ingeniería dura</span> y el <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-blue">código</span> se encuentran
                    </h1>

                    <p className="text-xl md:text-2xl text-surface-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        Soluciones B2B para estudios de ingeniería y constructoras. Transformamos procesos lentos en automatizaciones rentables y preparamos a tu equipo para el estándar BIM 2026.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#contacto"
                            className="w-full sm:w-auto px-8 py-4 bg-fc-blue text-white rounded-xl font-bold text-lg hover:bg-fc-navy transition-all shadow-lg hover:shadow-fc-blue/25 flex items-center justify-center gap-2 group"
                        >
                            Agendar Diagnóstico Gratuito
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <Link
                            href="/sobre-mi"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center"
                        >
                            Conoce mi perfil
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── SERVICIOS VERTICALES (Cards) ── */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 relative -mt-16 z-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {SERVICES.map((srv, index) => (
                        <div
                            key={srv.title}
                            className={`bg-white rounded-3xl p-8 border ${srv.color} shadow-xl shadow-surface-200/50 flex flex-col transition-transform hover:-translate-y-2 duration-300 animate-in fade-in slide-in-from-bottom-12 delay-${index * 200}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl ${srv.bgIcon} flex items-center justify-center mb-6`}>
                                {srv.icon}
                            </div>
                            <h3 className="text-2xl font-display font-bold text-surface-900 mb-4">{srv.title}</h3>
                            <p className="text-surface-600 mb-8 leading-relaxed flex-1">{srv.description}</p>

                            <ul className="space-y-3">
                                {srv.features.map(feat => (
                                    <li key={feat} className="flex items-start gap-3 text-surface-700">
                                        <CheckCircle2 className="w-5 h-5 text-fc-gold shrink-0 mt-0.5" />
                                        <span className="font-medium text-sm">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── METODOLOGÍA ── */}
            <section className="py-24 bg-surface-100 border-y border-surface-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8">
                        <h2 className="text-3xl md:text-5xl font-display font-black text-surface-900 mb-4">Metodología de Trabajo</h2>
                        <p className="text-lg text-surface-600 max-w-2xl mx-auto">Nuestro proceso asegura que la solución entregada realmente resuelva un problema y sea adoptada por tu equipo.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {METHODOLOGY.map((step, idx) => (
                            <div key={step.step} className="bg-white p-8 rounded-2xl border border-surface-200 relative animate-in fade-in scale-in-95 delay-[300ms]">
                                <div className="text-5xl font-display font-black text-surface-100 absolute top-4 right-4 pointer-events-none select-none">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-bold text-surface-900 mb-3 relative z-10">{step.title}</h3>
                                <p className="text-surface-600 text-sm leading-relaxed relative z-10">{step.desc}</p>
                                {/* Arrow connector for large screens */}
                                {idx < METHODOLOGY.length - 1 && (
                                    <ArrowRight className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-surface-300 z-20" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA & CONTACTO ── */}
            <section id="contacto" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-12 delay-[400ms]">
                <div className="bg-surface-900 rounded-[2.5rem] p-8 md:p-14 shadow-2xl overflow-hidden relative border border-surface-800">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-fc-blue/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        {/* Context Header */}
                        <div>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-fc-cyan mb-6">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4 leading-tight">
                                Empecemos tu próximo proyecto.
                            </h2>
                            <p className="text-surface-400 text-lg mb-8 leading-relaxed">
                                Cuéntame los detalles de lo que tu empresa necesita. Ya sea optimizar un proceso en Revit, modelar un proyecto complejo o un desarrollo a medida.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-surface-300 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-medium text-sm">Disponibilidad para nuevos proyectos B2B</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Reused */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
