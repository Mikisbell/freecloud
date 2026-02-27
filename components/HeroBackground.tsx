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
        let frameCount = 0;

        // --- BIM PROPERTIES ---
        const ANGLE_RAD = Math.PI / 6; // 30 grados
        const COS_A = Math.cos(ANGLE_RAD);
        const SIN_A = Math.sin(ANGLE_RAD);

        // Scanner
        let scannerY = -50;
        let scannerSpeed = 1.5;
        const scannerHeightRange = 500; // max building height

        // Labels floting
        const labels: Array<{ x: number, y: number, z: number, text: string, id: number }> = [];

        // Resize handler
        const resize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = 620;
            }
            initLabels();
        };

        const initLabels = () => {
            labels.length = 0;
            // Creamos algunas etiquetas de metadatos estaticas
            const texts = [
                "W30x108", "C-450x450", "SLAB-200",
                "LOAD: 45kN", "PHASE: 03", "BIM 4D",
                "REBAR: 12Ø16", "CLASH: ZERO", "VOL: 3.2m³"
            ];
            // Posiciones aleatorias en la estructura
            for (let i = 0; i < 6; i++) {
                labels.push({
                    x: Math.random() * 200,
                    y: Math.random() * 300,
                    z: Math.random() * 200,
                    text: texts[Math.floor(Math.random() * texts.length)],
                    id: i
                });
            }
        }

        const project = (x: number, y: number, z: number, scale: number, offsetX: number, offsetY: number) => {
            return {
                cx: (x - z) * COS_A * scale + offsetX,
                cy: (x + z) * SIN_A * scale - y * scale + offsetY
            };
        };

        const drawLine = (p1: any, p2: any, color: string, width = 1) => {
            ctx.beginPath();
            ctx.moveTo(p1.cx, p1.cy);
            ctx.lineTo(p2.cx, p2.cy);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
        };

        const drawBimStructure = (scale: number, offX: number, offY: number) => {
            // Parametros de la estructura
            const cols = 5;
            const rows = 4;
            const floors = 6;
            const spanX = 50;
            const spanZ = 50;
            const floorH = 60;

            // 1. DIBUJAR CUADRICULA DE REPLANTEO (GRIDS) EN EL SUELO
            ctx.setLineDash([5, 5]); // Linea punteada para ejes
            const gridColor = 'rgba(255, 255, 255, 0.15)';
            for (let i = 0; i <= cols; i++) {
                let start = project(i * spanX, 0, -20, scale, offX, offY);
                let end = project(i * spanX, 0, (rows * spanZ) + 20, scale, offX, offY);
                drawLine(start, end, gridColor);
            }
            for (let i = 0; i <= rows; i++) {
                let start = project(-20, 0, i * spanZ, scale, offX, offY);
                let end = project((cols * spanX) + 20, 0, i * spanZ, scale, offX, offY);
                drawLine(start, end, gridColor);
            }
            ctx.setLineDash([]); // Reset dash

            // 2. DIBUJAR P\u00d3RTICOS (Columnas y Vigas)
            // Optimizamos dibujando elementos y comprobando c\u00f3mo reaccionan al "Scanner"
            for (let f = 0; f <= floors; f++) {
                let y = f * floorH;
                // Estado del escanner respecto de este piso
                let distToScannerY = Math.abs(scannerY - y);
                let isScannedFloor = distToScannerY < 20;

                for (let c = 0; c <= cols; c++) {
                    for (let r = 0; r <= rows; r++) {
                        let x = c * spanX;
                        let z = r * spanZ;

                        // Columna (hacia arriba)
                        if (f < floors) {
                            let yTop = (f + 1) * floorH;
                            // Si el scanner pasa por la columna
                            let isColScanned = scannerY > y && scannerY < yTop;
                            let colColor = isColScanned ? 'rgba(6, 182, 212, 0.9)' : 'rgba(59, 130, 246, 0.15)';
                            let colWidth = isColScanned ? 2 : 1;

                            let p1 = project(x, y, z, scale, offX, offY);
                            let p2 = project(x, yTop, z, scale, offX, offY);
                            drawLine(p1, p2, colColor, colWidth);

                            // Si est\u00e1 escaneada, dibujar el "Corte" láser en el n\u00facleo
                            if (isColScanned && Math.random() > 0.95) {
                                drawNode(project(x, scannerY, z, scale, offX, offY), 2, 'rgba(6, 182, 212, 1)');
                            }
                        }

                        // Vigas en X
                        if (c < cols) {
                            let beamColor = isScannedFloor ? 'rgba(234, 179, 8, 0.8)' : 'rgba(255, 255, 255, 0.15)'; // Amarillo si est\u00e1 escaneado
                            let beamW = isScannedFloor ? 1.5 : 0.8;
                            let p1 = project(x, y, z, scale, offX, offY);
                            let p2 = project((c + 1) * spanX, y, z, scale, offX, offY);
                            drawLine(p1, p2, beamColor, beamW);
                        }

                        // Vigas en Z
                        if (r < rows) {
                            let beamColor = isScannedFloor ? 'rgba(234, 179, 8, 0.8)' : 'rgba(255, 255, 255, 0.15)';
                            let beamW = isScannedFloor ? 1.5 : 0.8;
                            let p1 = project(x, y, z, scale, offX, offY);
                            let p2 = project(x, y, (r + 1) * spanZ, scale, offX, offY);
                            drawLine(p1, p2, beamColor, beamW);
                        }
                    }
                }
            }

            // 3. ETIQUETAS DE METADATOS BIM (FLOTANTES)
            labels.forEach(lbl => {
                // Animar un poco la posicion Y de la etiqueta
                let lblHoverY = Math.sin((frameCount + lbl.id * 100) * 0.02) * 10;
                let targetPoint = project(lbl.x, lbl.y, lbl.z, scale, offX, offY);
                let uiPoint = project(lbl.x, lbl.y + 70 + lblHoverY, lbl.z, scale, offX, offY);

                // L\u00ednea guía (Lead line)
                ctx.setLineDash([2, 4]);
                drawLine(targetPoint, uiPoint, 'rgba(255,255,255,0.4)', 1);
                ctx.setLineDash([]);

                // Caja de la etiqueta
                ctx.fillStyle = 'rgba(10, 22, 40, 0.85)';
                ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
                ctx.lineWidth = 1;

                let tw = ctx.measureText(lbl.text).width + 16;
                let th = 22;
                let rx = uiPoint.cx - tw / 2;
                let ry = uiPoint.cy - th / 2;

                // Fila de UI
                ctx.beginPath();
                ctx.roundRect(rx, ry, tw, th, 4);
                ctx.fill();
                ctx.stroke();

                // Texto de UI
                ctx.fillStyle = '#fff';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(lbl.text, uiPoint.cx, uiPoint.cy);

                // Punto de uni\u00f3n en la estructura
                drawNode(targetPoint, 3, 'rgba(6, 182, 212, 0.8)');
            });

            // 4. PLANO DE ESCANEO L\u00c1SER (BIM CLASH/LASER SCAN)
            // Simularemos un plano que sube translucido
            ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
            ctx.beginPath();
            let s1 = project(-20, scannerY, -20, scale, offX, offY);
            let s2 = project((cols * spanX) + 20, scannerY, -20, scale, offX, offY);
            let s3 = project((cols * spanX) + 20, scannerY, (rows * spanZ) + 20, scale, offX, offY);
            let s4 = project(-20, scannerY, (rows * spanZ) + 20, scale, offX, offY);
            ctx.moveTo(s1.cx, s1.cy); ctx.lineTo(s2.cx, s2.cy); ctx.lineTo(s3.cx, s3.cy); ctx.lineTo(s4.cx, s4.cy);
            ctx.fill();

            // Bordes del esc\u00e1ner
            drawLine(s1, s2, 'rgba(6, 182, 212, 0.4)', 1);
            drawLine(s2, s3, 'rgba(6, 182, 212, 0.4)', 1);
            drawLine(s3, s4, 'rgba(6, 182, 212, 0.4)', 1);
            drawLine(s4, s1, 'rgba(6, 182, 212, 0.4)', 1);
        };

        const drawNode = (p: any, radius: number, color: string) => {
            ctx.beginPath();
            ctx.arc(p.cx, p.cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        };

        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            // Limpiar lienzo
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Posicion dinamica segun tamano de pantalla
            const isMobile = canvas.width < 768;
            const buildingScale = isMobile ? 0.9 : 1.3;
            const offX = isMobile ? canvas.width / 2 : canvas.width * 0.35; // Desplazar al centro/izq
            // Mover el offset un poco circularmente para dar efecto de "c\u00e1mara dron flotando"
            const camHoverX = Math.cos(frameCount * 0.005) * 20;
            const camHoverY = Math.sin(frameCount * 0.005) * 10;
            const offY = canvas.height * 0.8 + camHoverY;

            // Dibujar modelo BIM
            drawBimStructure(buildingScale, offX + camHoverX, offY);

            // Actualizar l\u00f3gica
            scannerY += scannerSpeed;
            if (scannerY > scannerHeightRange || scannerY < -50) {
                scannerSpeed *= -1; // Sube y baja
                // Aleatorizar etiquetas cuando reinicia
                if (scannerY < 0) initLabels();
            }

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
