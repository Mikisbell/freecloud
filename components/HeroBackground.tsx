'use client';

import { useEffect, useRef } from 'react';

export default function HeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // Resize handler
        const resize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = 620;
            }
            initMatrix();
        };

        // --- 1. CONFIGURACION DE LA LLUVIA MATRIX ---
        const charset = '0110101BIMREVITETABSDATA101010';
        const fontSize = 14;
        let columns = 0;
        const drops: number[] = [];

        const initMatrix = () => {
            columns = Math.ceil(canvas.width / fontSize);
            while (drops.length < columns) drops.push(Math.random() * -100);
            while (drops.length > columns) drops.pop();
        };

        window.addEventListener('resize', resize);
        resize();

        // --- 2. CONFIGURACION EDIFICIO ISOMETRICO ---
        const ANGLE = Math.PI / 6; // 30 grados
        const COS = Math.cos(ANGLE);
        const SIN = Math.sin(ANGLE);

        const project = (x: number, y: number, z: number, scale: number, offsetX: number, offsetY: number) => {
            return {
                cx: (x - z) * COS * scale + offsetX,
                cy: (x + z) * SIN * scale - y * scale + offsetY
            };
        };

        const drawLine = (p1: any, p2: any) => {
            ctx.beginPath();
            ctx.moveTo(p1.cx, p1.cy);
            ctx.lineTo(p2.cx, p2.cy);
            ctx.stroke();
        };

        const drawIsoBox = (x: number, y: number, z: number, w: number, h: number, d: number, scale: number, offX: number, offY: number) => {
            const p1 = project(x, y, z, scale, offX, offY);
            const p2 = project(x + w, y, z, scale, offX, offY);
            const p3 = project(x + w, y, z + d, scale, offX, offY);
            const p4 = project(x, y, z + d, scale, offX, offY);

            const p5 = project(x, y + h, z, scale, offX, offY);
            const p6 = project(x + w, y + h, z, scale, offX, offY);
            const p7 = project(x + w, y + h, z + d, scale, offX, offY);
            const p8 = project(x, y + h, z + d, scale, offX, offY);

            // Suelo
            drawLine(p1, p2); drawLine(p2, p3); drawLine(p3, p4); drawLine(p4, p1);
            // Techo
            drawLine(p5, p6); drawLine(p6, p7); drawLine(p7, p8); drawLine(p8, p5);
            // Columnas
            drawLine(p1, p5); drawLine(p2, p6); drawLine(p3, p7); drawLine(p4, p8);

            // Pisos intermedios / Losas
            const pisoAlto = 30;
            const numPisos = Math.floor(h / pisoAlto);
            for (let i = 1; i < numPisos; i++) {
                const py = y + i * pisoAlto;
                const fp1 = project(x, py, z, scale, offX, offY);
                const fp2 = project(x + w, py, z, scale, offX, offY);
                const fp3 = project(x + w, py, z + d, scale, offX, offY);
                const fp4 = project(x, py, z + d, scale, offX, offY);

                // Lineas de balcon/pisos que cruzan la cara visible frontal
                drawLine(fp1, fp2); // Cara der
                drawLine(fp1, fp4); // Cara izq
            }

            // Lineas verticales (ventanas/placas) - Cara Derecha
            const colW = 20;
            const numColsW = Math.floor(w / colW);
            for (let i = 1; i < numColsW; i++) {
                const px = x + i * colW;
                drawLine(project(px, y, z, scale, offX, offY), project(px, y + h, z, scale, offX, offY));
            }

            // Lineas verticales (ventanas/placas) - Cara Izquierda
            const numColsD = Math.floor(d / colW);
            for (let i = 1; i < numColsD; i++) {
                const pz = z + i * colW;
                drawLine(project(x, y, pz, scale, offX, offY), project(x, y + h, pz, scale, offX, offY));
            }
        };

        let frameCount = 0;

        const animate = () => {
            // 1. Efecto "Estela" oscureciendo frame a frame (Trailing)
            ctx.fillStyle = 'rgba(10, 22, 40, 0.15)'; // Color base del Hero #0a1628
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Lluvia de Codigo (Matrix Rain)
            ctx.font = `${fontSize}px monospace`;

            // Controlar la velocidad de actualizacion de la lluvia (cada 3 frames)
            if (frameCount % 3 === 0) {
                ctx.fillStyle = 'rgba(6, 182, 212, 0.25)'; // Cyan oscuro

                for (let i = 0; i < drops.length; i++) {
                    const char = charset[Math.floor(Math.random() * charset.length)];
                    const xPos = i * fontSize;
                    const yPos = drops[i] * fontSize;

                    // Color aleatorio para destellos (BIM/REVIT brillan mas)
                    if (Math.random() > 0.98) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Blanco brillante a veces
                    } else {
                        ctx.fillStyle = 'rgba(6, 182, 212, 0.25)'; // Cyan oscuro normal
                    }

                    ctx.fillText(char, xPos, yPos);

                    // Reiniciar gotas al llegar abajo (con random para no reiniciarse en lote)
                    if (yPos > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }

            // 3. Dibujar el Edificio Wireframe 
            // Animamos ligeramente arriba y abajo para darle vida (Hover)
            const hoverOffsetY = Math.sin(frameCount * 0.01) * 8;

            // Posición dinamica segun tamano de pantalla
            const isMobile = canvas.width < 768;
            const buildingScale = isMobile ? 0.8 : 1.3; // Mas grande en PC
            const offX = isMobile ? canvas.width / 2 : canvas.width * 0.2; // A la izquierda en PC, centro en mobile
            const offY = canvas.height * 0.8 + hoverOffsetY;

            // Estilo de lineas arquitectonicas
            ctx.strokeStyle = `rgba(255, 255, 255, ${isMobile ? 0.2 : 0.35})`;
            ctx.lineWidth = 1;

            // Componentes Estructurales del Edificio IsoBox 
            // (X=fondoDer, Y=alto, Z=fondoIzq, Width=anchoX, Height=altoY, Depth=anchoZ)

            // Podio / Base 
            drawIsoBox(-30, 0, -30, 240, 30, 240, buildingScale, offX, offY);

            // Bloque Principal Central
            drawIsoBox(30, 30, 30, 100, 300, 100, buildingScale, offX, offY);

            // Bloque Secundario Izquierdo (Mas bajo pero volado hacia Z)
            drawIsoBox(0, 30, 130, 60, 200, 60, buildingScale, offX, offY);

            // Bloque Secundario Derecho
            drawIsoBox(130, 30, 0, 60, 150, 60, buildingScale, offX, offY);

            // Alero / Azotea
            drawIsoBox(25, 330, 25, 110, 15, 110, buildingScale, offX, offY);

            frameCount++;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
}
