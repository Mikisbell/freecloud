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

        // --- 2. CONFIGURACION EDIFICIO ISOMETRICO (MEJORADO) ---
        // \u00c1ngulo isométrico clásico
        const ANGLEX = Math.PI / 6; // 30 grados
        const ANGLEY = Math.PI / 6;
        const COSX = Math.cos(ANGLEX);
        const SINX = Math.sin(ANGLEX);
        const COSY = Math.cos(ANGLEY);
        const SINY = Math.sin(ANGLEY);

        const project = (x: number, y: number, z: number, scale: number, offsetX: number, offsetY: number) => {
            return {
                cx: (x - z) * COSX * scale + offsetX,
                cy: (x + z) * SINY * scale - y * scale + offsetY
            };
        };

        const drawLine = (p1: any, p2: any, isGlowing: boolean = false) => {
            ctx.beginPath();
            ctx.moveTo(p1.cx, p1.cy);
            ctx.lineTo(p2.cx, p2.cy);
            if (isGlowing) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
                ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
                ctx.lineWidth = 1.5;
            } else {
                ctx.shadowBlur = 0;
                ctx.lineWidth = 0.8;
            }
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset
        };

        const drawNode = (p: any, radius: number = 2, isGlowing: boolean = false) => {
            ctx.beginPath();
            ctx.arc(p.cx, p.cy, radius, 0, Math.PI * 2);
            if (isGlowing) {
                ctx.shadowBlur = 12;
                ctx.shadowColor = 'rgba(59, 130, 246, 1)';
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        };

        // Estructura reticular avanzada con Arriostramientos (X-Bracing)
        const drawAdvancedStructure = (x: number, y: number, z: number, w: number, h: number, d: number, scale: number, offX: number, offY: number, frame: number) => {

            const colCount = 4; // Numero de columnas por cara
            const floorCount = 8; // Numero de pisos
            const colW = w / colCount;
            const colD = d / colCount;
            const floorH = h / floorCount;

            // Limite visible simple para optimizar (solo dibujar partes visibles)
            // Redise\u00f1amos para no saturar: solo front derecha y front izquierda

            // 1. DIBUJAR COLUMNAS
            ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
            for (let i = 0; i <= colCount; i++) {
                // Cara derecha
                let pBottomR = project(x + (i * colW), y, z, scale, offX, offY);
                let pTopR = project(x + (i * colW), y + h, z, scale, offX, offY);
                drawLine(pBottomR, pTopR);
                drawNode(pTopR, 1.5);

                // Cara Izquierda
                let pBottomL = project(x, y, z + (i * colD), scale, offX, offY);
                let pTopL = project(x, y + h, z + (i * colD), scale, offX, offY);
                drawLine(pBottomL, pTopL);
                drawNode(pTopL, 1.5);
            }

            // Columna trasera central invisible pero necesaria para techo
            let pTopBack = project(x + w, y + h, z + d, scale, offX, offY);

            // 2. DIBUJAR PISOS (Vigas) y CRUCES (Bracing)
            for (let f = 0; f <= floorCount; f++) {
                let py = y + (f * floorH);

                // Vigas principales perimetrales frontales
                let pFrontCenter = project(x, py, z, scale, offX, offY);
                let pFrontRight = project(x + w, py, z, scale, offX, offY);
                let pFrontLeft = project(x, py, z + d, scale, offX, offY);

                ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
                drawLine(pFrontCenter, pFrontRight);
                drawLine(pFrontCenter, pFrontLeft);

                // Vigas de techo
                if (f === floorCount) {
                    let pBackRight = project(x + w, py, z + d, scale, offX, offY);
                    drawLine(pFrontRight, pBackRight);
                    drawLine(pFrontLeft, pBackRight);
                }

                // X-BRACING (Arriostramientos) en algunos pisos
                if (f < floorCount) {
                    // Alternar cruces para hacer mas estilo ingenieril
                    ctx.strokeStyle = `rgba(6, 182, 212, 0.15)`;
                    let pyNext = y + ((f + 1) * floorH);

                    for (let c = 0; c < colCount; c++) {
                        // Solo en columnas externas para no recargar
                        if (c === 0 || c === colCount - 1 || f % 2 === 0) {
                            // Diagonal cara derecha
                            let br1 = project(x + (c * colW), py, z, scale, offX, offY);
                            let br2 = project(x + ((c + 1) * colW), pyNext, z, scale, offX, offY);
                            let br3 = project(x + ((c + 1) * colW), py, z, scale, offX, offY);
                            let br4 = project(x + (c * colW), pyNext, z, scale, offX, offY);

                            // Efecto de pulso en algunas aspas
                            let isGlowing = (f + c + Math.floor(frame / 60)) % 7 === 0;
                            ctx.strokeStyle = isGlowing ? `rgba(6, 182, 212, 0.6)` : `rgba(255, 255, 255, 0.1)`;

                            drawLine(br1, br2, isGlowing);
                            drawLine(br3, br4, isGlowing);

                            // Diagonal cara izquierda
                            let bl1 = project(x, py, z + (c * colD), scale, offX, offY);
                            let bl2 = project(x, pyNext, z + ((c + 1) * colD), scale, offX, offY);
                            let bl3 = project(x, py, z + ((c + 1) * colD), scale, offX, offY);
                            let bl4 = project(x, pyNext, z + (c * colD), scale, offX, offY);

                            drawLine(bl1, bl2, isGlowing);
                            drawLine(bl3, bl4, isGlowing);
                        }
                    }
                }
            }

            // 3. CORE CENTRAL (N\u00facleo de Ascensores - estructural)
            ctx.strokeStyle = `rgba(59, 130, 246, 0.4)`;
            let coreW = w * 0.3;
            let coreD = d * 0.3;
            let coreX = x + (w / 2) - (coreW / 2);
            let coreZ = z + (d / 2) - (coreD / 2);

            // N\u00facleo sube más alto que el techo
            let coreH = h + 40;

            let c1 = project(coreX, y, coreZ, scale, offX, offY);
            let c2 = project(coreX + coreW, y, coreZ, scale, offX, offY);
            let c3 = project(coreX, y, coreZ + coreD, scale, offX, offY);
            let c4 = project(coreX + coreW, y, coreZ + coreD, scale, offX, offY);

            let ct1 = project(coreX, y + coreH, coreZ, scale, offX, offY);
            let ct2 = project(coreX + coreW, y + coreH, coreZ, scale, offX, offY);
            let ct3 = project(coreX, y + coreH, coreZ + coreD, scale, offX, offY);
            let ct4 = project(coreX + coreW, y + coreH, coreZ + coreD, scale, offX, offY);

            drawLine(c1, ct1); drawLine(c2, ct2); drawLine(c3, ct3); drawLine(c4, ct4);
            drawLine(ct1, ct2); drawLine(ct1, ct3); drawLine(ct4, ct2); drawLine(ct4, ct3);

            // Elemento brillando en la punta del n\u00facleo (Antena/Sensor)
            drawNode(ct4, 3, true);
        };

        let frameCount = 0;

        const animate = () => {
            // 1. Efecto "Estela" oscureciendo frame a frame (Trailing)
            ctx.fillStyle = 'rgba(10, 22, 40, 0.2)'; // Un poco menos de trailing para que el código no se manche tanto
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Lluvia de Codigo (Matrix Rain - MAS LENTO)
            ctx.font = `${fontSize}px monospace`;

            // Controlar la velocidad de actualizacion de la lluvia (cada 6 frames = más elegante y lento)
            if (frameCount % 6 === 0) {
                ctx.fillStyle = 'rgba(6, 182, 212, 0.2)'; // Cyan un poco más apagado en el fondo

                for (let i = 0; i < drops.length; i++) {
                    const char = charset[Math.floor(Math.random() * charset.length)];
                    const xPos = i * fontSize;
                    const yPos = drops[i] * fontSize;

                    // Color aleatorio para destellos
                    if (Math.random() > 0.99) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Blanco brillante a veces
                    } else {
                        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)'; // Cyan oscuro normal
                    }

                    ctx.fillText(char, xPos, yPos);

                    // Reiniciar gotas al llegar abajo suavemente
                    if (yPos > canvas.height && Math.random() > 0.985) {
                        drops[i] = 0;
                    }
                    // Caída más corta
                    drops[i] += 0.8;
                }
            }

            // 3. Dibujar la Estructura BIM
            const hoverOffsetY = Math.sin(frameCount * 0.015) * 10; // Flotación m\u00e1s suave y amplia

            const isMobile = canvas.width < 768;
            const buildingScale = isMobile ? 1.0 : 1.6; // M\u00e1s majestuoso
            const offX = isMobile ? canvas.width / 2 : canvas.width * 0.25;
            const offY = canvas.height * 0.85 + hoverOffsetY;

            // Base rotacional simulada moviendo ligeramte el origen 
            // Dibuja una estructura principal compleja
            // Par\u00e1metros: x, y, z, width, height, depth
            drawAdvancedStructure(0, 0, 0, 140, 360, 140, buildingScale, offX, offY, frameCount);

            // Estructura anexa (Edificio menor)
            drawAdvancedStructure(160, 0, -20, 80, 200, 80, buildingScale, offX, offY, frameCount);

            // Plataforma Base / Terreno
            const s1 = project(-40, 0, -40, buildingScale, offX, offY);
            const s2 = project(300, 0, -40, buildingScale, offX, offY);
            const s3 = project(300, 0, 200, buildingScale, offX, offY);
            const s4 = project(-40, 0, 200, buildingScale, offX, offY);

            ctx.strokeStyle = `rgba(59, 130, 246, 0.15)`;
            drawLine(s1, s2); drawLine(s2, s3); drawLine(s3, s4); drawLine(s4, s1);

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
