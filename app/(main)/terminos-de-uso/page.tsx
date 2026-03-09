import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Términos de Uso | FreeCloud',
    description: 'Términos y condiciones de uso de FreeCloud.pe. Conoce las reglas que rigen el uso de nuestros contenidos, herramientas y servicios.',
    robots: { index: true, follow: true },
    alternates: { canonical: 'https://freecloud.pe/terminos-de-uso' },
};

export default function TerminosDeUso() {
    return (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">Términos de Uso</h1>
            <p className="text-sm text-surface-400 mb-10">Última actualización: marzo 2026</p>

            <div className="prose prose-slate max-w-none space-y-8 text-surface-700 leading-relaxed">

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">1. Aceptación de los términos</h2>
                    <p>
                        Al acceder y utilizar <strong>FreeCloud.pe</strong> ("el Sitio"), usted acepta estar sujeto a estos Términos de Uso. Si no está de acuerdo con alguno de estos términos, le pedimos que no utilice el Sitio.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">2. Uso del contenido</h2>
                    <p>
                        Todo el contenido publicado en FreeCloud.pe — artículos, tutoriales, plantillas, scripts y recursos — está protegido por derechos de autor. Queda permitido:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-3 pl-2">
                        <li>Leer y compartir los artículos con fines educativos, citando la fuente.</li>
                        <li>Descargar plantillas y recursos para uso personal o profesional propio.</li>
                        <li>Adaptar los scripts para proyectos propios.</li>
                    </ul>
                    <p className="mt-3">Queda <strong>prohibido</strong> redistribuir, vender o publicar nuestro contenido como propio sin autorización expresa.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">3. Exactitud de la información</h2>
                    <p>
                        FreeCloud.pe publica contenido técnico con la mayor precisión posible. Sin embargo, la normativa técnica (E.030, E.060, Ley 32069, etc.) puede actualizarse. El usuario es responsable de verificar la vigencia de las normas aplicables a su proyecto.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">4. Productos y servicios de terceros</h2>
                    <p>
                        Algunos artículos incluyen enlaces de afiliados o recomendaciones de productos de terceros (Gumroad, Autodesk, etc.). FreeCloud.pe no se hace responsable por la calidad, disponibilidad o políticas de dichos terceros.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">5. Publicidad (Google AdSense)</h2>
                    <p>
                        Este sitio utiliza Google AdSense para mostrar publicidad. Google puede utilizar cookies para mostrar anuncios basados en sus intereses. Puede gestionar sus preferencias de publicidad en <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-fc-blue hover:underline">adssettings.google.com</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">6. Limitación de responsabilidad</h2>
                    <p>
                        FreeCloud.pe no será responsable por daños directos, indirectos o consecuentes derivados del uso del contenido publicado. El usuario aplica los conocimientos bajo su propio riesgo y responsabilidad profesional.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">7. Modificaciones</h2>
                    <p>
                        Nos reservamos el derecho de actualizar estos términos en cualquier momento. La fecha de "última actualización" al inicio de esta página indica cuándo entraron en vigor los cambios más recientes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">8. Contacto</h2>
                    <p>
                        Para consultas sobre estos términos, escríbenos a través del formulario en la página <a href="/sobre-mi#contacto" className="text-fc-blue hover:underline">Sobre Mí</a>.
                    </p>
                </section>

            </div>
        </main>
    );
}
