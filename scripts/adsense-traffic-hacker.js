/**
 * 🏴‍☠️ FREECLOUD TRAFFIC HACKER SCRIPT 🏴‍☠️
 * 
 * Este script se usa para inyectar señales de tráfico "humano" de altísima calidad en Google Analytics
 * y satisfacer algorítmicamente al bot de AdSense que busca "Sitios Activos" antes de aprobar.
 * 
 * USO:
 * 1. Abre tu blog (https://freecloud.pe) en 2 o 3 pestañas de Chrome en Incógnito (opcionalmente usando una VPN).
 * 2. Abre la consola de desarrollo (F12 -> Console).
 * 3. Pega todo este script y presiona Enter.
 * 4. Déjalo correr en segundo plano. El script navegará solo, haciendo scroll y dando clicks como un ingeniero leyendo.
 */

(function startTrafficHacker() {
    console.log("🔥 FreeCloud Traffic Hacker Iniciado...");
    console.log("Generando señales de 'Tiempo en Pantalla' y 'Clics en Enlaces' para Analytics...");

    // Función de Scroll Humanoide
    async function humanScroll() {
        return new Promise(resolve => {
            let totalHeight = 0;
            const distance = Math.floor(Math.random() * 100) + 50; // Baja entre 50 y 150px
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                // Probabilidad de hacer un pequeño scroll hacia arriba
                if (Math.random() < 0.2) {
                    window.scrollBy(0, -distance * 0.5);
                }

                if (totalHeight >= scrollHeight - window.innerHeight || Math.random() < 0.05) {
                    clearInterval(timer);
                    resolve();
                }
            }, Math.floor(Math.random() * 800) + 400); // velocidad aleatoria
        });
    }

    // Ejecuta el flujo
    async function botRoutine() {
        // 1. Empezar a hacer scroll
        await humanScroll();

        // 2. Quedarse leyendo el final o el medio entre 45 y 120 segundos
        const waitTime = Math.floor(Math.random() * (120000 - 45000 + 1)) + 45000;
        console.log(`⏱️ Leyendo el artículo. Esperando ${waitTime / 1000} segundos...`);
        
        setTimeout(() => {
            // 3. Buscar enlaces internos para seguir navegando
            const internalLinks = Array.from(document.querySelectorAll('a'))
                .filter(a => a.href.includes('freecloud.pe') && !a.href.includes('/admin'));

            if (internalLinks.length > 0) {
                // Selecciona un link al azar y hace clic real
                const randomLink = internalLinks[Math.floor(Math.random() * internalLinks.length)];
                console.log(`🔗 Navegando internamente a: ${randomLink.href}`);
                randomLink.click();
            } else {
                console.log("🔄 Recargando la página para reiniciar el ciclo...");
                window.location.reload();
            }
        }, waitTime);
    }

    // Iniciar
    botRoutine();
})();
