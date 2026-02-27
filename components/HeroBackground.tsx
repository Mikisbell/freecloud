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

        // --- MATRIX RAIN PROPERTIES ---
        const charset = '0110101BIMREVITETABSDATA101010';
        const fontSize = 14;
        let columns = 0;
        const drops: number[] = [];

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
            initMatrix();
        };

        const initLabels = () => {
            labels.length = 0;
            const texts = [
                "W30x108", "C-450x450", "SLAB-200",
                "LOAD: 45kN", "PHASE: 03", "BIM 4D",
                "REBAR: 12Ø16", "CLASH: ZERO", "VOL: 3.2m\u00b3"
            ];
            // Posiciones aleatorias en la estructura central
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

        const initMatrix = () => {
            columns = Math.ceil(canvas.width / fontSize);
            while (drops.length < columns) drops.push(Math.random() * -100);
            while (drops.length > columns) drops.pop();
        };

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
            const cols = 5;
            const rows = 4;
            const floors = 6;
            const spanX = 50;
            const spanZ = 50;
            const floorH = 60;

            // 1. CUADRICULA DE REPLANTEO
            ctx.setLineDash([5, 5]);
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
            ctx.setLineDash([]); // Reset

            // 2. PORTICOS (Columnas y Vigas interactuando con Scanner)
            for (let f = 0; f <= floors; f++) {
                let y = f * floorH;
                let distToScannerY = Math.abs(scannerY - y);
                let isScannedFloor = distToScannerY < 20;

                for (let c = 0; c <= cols; c++) {
                    for (let r = 0; r <= rows; r++) {
                        let x = c * spanX;
                        let z = r * spanZ;

                        // Columna
                        if (f < floors) {
                            let yTop = (f + 1) * floorH;
                            let isColScanned = scannerY > y && scannerY < yTop;
                            let colColor = isColScanned ? 'rgba(6, 182, 212, 0.9)' : 'rgba(59, 130, 246, 0.2)';
                            let colWidth = isColScanned ? 2 : 1;

                            let p1 = project(x, y, z, scale, offX, offY);
                            let p2 = project(x, yTop, z, scale, offX, offY);
                            drawLine(p1, p2, colColor, colWidth);

                            if (isColScanned && Math.random() > 0.95) {
                                drawNode(project(x, scannerY, z, scale, offX, offY), 2, 'rgba(6, 182, 212, 1)');
                            }
                        }

                        // Vigas X
                        if (c < cols) {
                            let beamColor = isScannedFloor ? 'rgba(234, 179, 8, 0.8)' : 'rgba(255, 255, 255, 0.2)';
                            let beamW = isScannedFloor ? 1.5 : 0.8;
                            let p1 = project(x, y, z, scale, offX, offY);
                            let p2 = project((c + 1) * spanX, y, z, scale, offX, offY);
                            drawLine(p1, p2, beamColor, beamW);
                        }

                        // Vigas Z
                        if (r < rows) {
                            let beamColor = isScannedFloor ? 'rgba(234, 179, 8, 0.8)' : 'rgba(255, 255, 255, 0.2)';
                            let beamW = isScannedFloor ? 1.5 : 0.8;
                            let p1 = project(x, y, z, scale, offX, offY);
                            let p2 = project(x, y, (r + 1) * spanZ, scale, offX, offY);
                            drawLine(p1, p2, beamColor, beamW);
                        }
                    }
                }
            }

            // 3. ETIQUETAS BIM
            labels.forEach(lbl => {
                let lblHoverY = Math.sin((frameCount + lbl.id * 100) * 0.02) * 10;
                let targetPoint = project(lbl.x, lbl.y, lbl.z, scale, offX, offY);
                let uiPoint = project(lbl.x, lbl.y + 70 + lblHoverY, lbl.z, scale, offX, offY);

                ctx.setLineDash([2, 4]);
                drawLine(targetPoint, uiPoint, 'rgba(255,255,255,0.4)', 1);
                ctx.setLineDash([]);

                ctx.fillStyle = 'rgba(10, 22, 40, 0.85)';
                ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
                ctx.lineWidth = 1;

                let tw = ctx.measureText(lbl.text).width + 16;
                let th = 22;
                let rx = uiPoint.cx - tw / 2;
                let ry = uiPoint.cy - th / 2;

                ctx.beginPath();
                ctx.roundRect(rx, ry, tw, th, 4);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(lbl.text, uiPoint.cx, uiPoint.cy);

                drawNode(targetPoint, 3, 'rgba(6, 182, 212, 0.8)');
            });

            // 4. PLANO LÁSER TRANSLÚCIDO
            ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
            ctx.beginPath();
            let s1 = project(-20, scannerY, -20, scale, offX, offY);
            let s2 = project((cols * spanX) + 20, scannerY, -20, scale, offX, offY);
            let s3 = project((cols * spanX) + 20, scannerY, (rows * spanZ) + 20, scale, offX, offY);
            let s4 = project(-20, scannerY, (rows * spanZ) + 20, scale, offX, offY);
            ctx.moveTo(s1.cx, s1.cy); ctx.lineTo(s2.cx, s2.cy); ctx.lineTo(s3.cx, s3.cy); ctx.lineTo(s4.cx, s4.cy);
            ctx.fill();

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

        const drawMatrixRain = () => {
            // Reducir la actualizacion para que la lluvia sea elegante y lenta
            if (frameCount % 4 === 0) {
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    // Solo dibujar en los laterales o el fondo remoto (evitar centro fuerte)
                    const char = charset[Math.floor(Math.random() * charset.length)];
                    const xPos = i * fontSize;
                    const yPos = drops[i] * fontSize;

                    // Opacidad muuuuy tenue para que no estorbe (0.08 a 0.15)
                    if (Math.random() > 0.98) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Destello suave
                    } else {
                        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)'; // Base oscura Cyan
                    }

                    ctx.fillText(char, xPos, yPos);

                    // Reiniciar capa base
                    if (yPos > canvas.height && Math.random() > 0.985) {
                        drops[i] = 0;
                    }
                    drops[i] += 1; // Velocidad bajita
                }
            }
        }

        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            // 1. CAPA DE FONDO / EFECTO ESTELA (Aplica fading a BIM y Matrix)
            ctx.fillStyle = 'rgba(10, 22, 40, 0.25)'; // Hero #0a1628 Base
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. DIBUJAR MATRIX RAIN (Se dibuja antes, al fondo del Z-index)
            drawMatrixRain();

            // 3. CAPA BIM FOREGROUND (Con posiciones flotantes variables)
            const isMobile = canvas.width < 768;
            const buildingScale = isMobile ? 0.9 : 1.3;
            const offX = isMobile ? canvas.width / 2 : canvas.width * 0.35;

            const camHoverX = Math.cos(frameCount * 0.005) * 20;
            const camHoverY = Math.sin(frameCount * 0.005) * 10;
            const offY = canvas.height * 0.8 + camHoverY;

            // Dibujar estructura BIM que sobresaldr\u00e1 sobre la Matrix
            drawBimStructure(buildingScale, offX + camHoverX, offY);

            // 4. L\u00d3GICA DEL ESC\u00c1NER
            scannerY += scannerSpeed;
            if (scannerY > scannerHeightRange || scannerY < -50) {
                scannerSpeed *= -1;
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
