import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad | FreeCloud',
    description: 'Política de privacidad de FreeCloud.pe. Conoce cómo recopilamos, usamos y protegemos tu información personal.',
    robots: { index: true, follow: true },
    alternates: { canonical: 'https://freecloud.pe/politica-de-privacidad' },
};

export default function PoliticaDePrivacidad() {
    return (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">Política de Privacidad</h1>
            <p className="text-sm text-surface-400 mb-10">Última actualización: marzo 2026</p>

            <div className="prose prose-slate max-w-none space-y-8 text-surface-700 leading-relaxed">

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">1. Responsable del tratamiento</h2>
                    <p>
                        <strong>FreeCloud.pe</strong> es responsable del tratamiento de los datos personales recopilados a través de este sitio web. Para contactarnos, usa el formulario en la sección <a href="/sobre-mi#contacto" className="text-fc-blue hover:underline">Sobre Mí</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">2. Datos que recopilamos</h2>
                    <p>Recopilamos los siguientes tipos de datos:</p>
                    <ul className="list-disc list-inside space-y-1 mt-3 pl-2">
                        <li><strong>Datos de newsletter:</strong> nombre y correo electrónico cuando te suscribes voluntariamente.</li>
                        <li><strong>Datos de contacto:</strong> nombre, correo y mensaje cuando usas el formulario de contacto.</li>
                        <li><strong>Datos de navegación:</strong> páginas visitadas, tiempo de sesión (vía Google Analytics, anonimizados).</li>
                        <li><strong>Cookies publicitarias:</strong> gestionadas por Google AdSense para personalizar anuncios.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">3. Finalidad del tratamiento</h2>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Envío de boletín informativo con nuevos artículos y recursos (newsletter).</li>
                        <li>Respuesta a consultas y solicitudes de servicios.</li>
                        <li>Mejora del contenido del sitio mediante análisis de audiencia.</li>
                        <li>Mostrar publicidad relevante a través de Google AdSense.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">4. Base legal</h2>
                    <p>
                        El tratamiento de datos se realiza con base en el <strong>consentimiento explícito</strong> del usuario (newsletter, formulario de contacto) o en el <strong>interés legítimo</strong> para el análisis de audiencia con datos anonimizados.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">5. Cookies</h2>
                    <p>Este sitio utiliza los siguientes tipos de cookies:</p>
                    <ul className="list-disc list-inside space-y-1 mt-3 pl-2">
                        <li><strong>Cookies técnicas:</strong> necesarias para el funcionamiento del sitio (sesión de usuario en el admin).</li>
                        <li><strong>Cookies analíticas:</strong> Google Analytics (datos anonimizados, sin seguimiento de IP).</li>
                        <li><strong>Cookies publicitarias:</strong> Google AdSense para personalización de anuncios.</li>
                    </ul>
                    <p className="mt-3">Puede gestionar sus preferencias de cookies desde la configuración de su navegador o en <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-fc-blue hover:underline">adssettings.google.com</a>.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">6. Compartición de datos</h2>
                    <p>
                        No vendemos ni cedemos sus datos a terceros. Únicamente compartimos datos con:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-3 pl-2">
                        <li><strong>Supabase:</strong> almacenamiento seguro de la base de datos (servidores en EE.UU.).</li>
                        <li><strong>Google:</strong> Analytics y AdSense (según sus propias políticas de privacidad).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">7. Sus derechos</h2>
                    <p>Usted tiene derecho a:</p>
                    <ul className="list-disc list-inside space-y-1 mt-3 pl-2">
                        <li>Acceder a sus datos personales que tengamos almacenados.</li>
                        <li>Rectificar datos inexactos o incompletos.</li>
                        <li>Solicitar la eliminación de sus datos (derecho al olvido).</li>
                        <li>Darse de baja del newsletter en cualquier momento (enlace en cada correo).</li>
                    </ul>
                    <p className="mt-3">Para ejercer estos derechos, contáctenos a través del formulario en <a href="/sobre-mi#contacto" className="text-fc-blue hover:underline">/sobre-mi</a>.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-surface-800 mb-3">8. Seguridad</h2>
                    <p>
                        Implementamos medidas técnicas y organizativas para proteger sus datos: conexiones HTTPS, acceso restringido a la base de datos y políticas de contenido (CSP) para prevenir inyecciones de código.
                    </p>
                </section>

            </div>
        </main>
    );
}
