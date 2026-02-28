const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Directorio de salida
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'blog');
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper para ajustar texto en el canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
        // Math para centrar verticalmente basado en Y base
        context.fillText(lines[i], x, y + (i * lineHeight));
    }

    return lines.length * lineHeight; // height
}

async function generateCovers() {
    console.log('Obteniendo posts de Supabase...');
    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
      id, title, slug, excerpt,
      categories:category_id (name, color, emoji)
    `);

    if (error) {
        console.error('Error fetching posts:', error);
        return;
    }

    console.log(`Encontrados ${posts.length} posts. Generando imágenes...`);

    for (const post of posts) {
        const width = 1200;
        const height = 630;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const cat = post.categories || { name: 'Blog', color: '#3b82f6', emoji: '📝' };
        const baseColor = cat.color || '#3b82f6';

        // 1. Fondo (Gradient Radial Profundo)
        ctx.fillStyle = '#0a1628'; // Navy
        ctx.fillRect(0, 0, width, height);

        const grd = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 800);
        // Darken el baseColor un poco para el grandient
        ctx.globalAlpha = 0.4;
        grd.addColorStop(0, baseColor);
        grd.addColorStop(1, 'rgba(10, 22, 40, 0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1.0;

        // 2. Grilla Isometrica (Efecto BIM/Ingenieria sutil)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = -width; i < width * 2; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + height, height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i, height);
            ctx.lineTo(i + height, 0);
            ctx.stroke();
        }

        // 3. Decoración Top-Left Badge (Categoria)
        const badgePadX = 30;
        const badgePadY = 15;
        ctx.font = 'bold 24px sans-serif';
        const badgeText = `${cat.emoji}  ${cat.name.toUpperCase()}`;
        const badgeWidth = ctx.measureText(badgeText).width + (badgePadX * 2);

        // Glow/sombra badge
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = 20;
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.roundRect(80, 80, badgeWidth, 60, 30);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        ctx.fillStyle = '#ffffff';
        ctx.fillText(badgeText, 80 + badgePadX, 80 + 38);

        // 4. Titulo del Post
        ctx.fillStyle = '#ffffff';
        // Clean escape chrs length check
        if (post.title.length > 55) {
            ctx.font = 'bold 72px sans-serif';
        } else {
            ctx.font = 'bold 84px sans-serif';
        }

        // Sombra sutil texto
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 4;

        const totalTextH = wrapText(ctx, post.title, 80, 280, 1040, post.title.length > 55 ? 85 : 95);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 5. Autor / Branding bottom
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '30px sans-serif';
        ctx.fillText('FreeCloud.pe — Impacto BIM y TI', 80, height - 80);

        // 6. Icono Gigante Transparente en background derecho
        ctx.globalAlpha = 0.15;
        ctx.font = '400px sans-serif';
        ctx.fillStyle = baseColor;
        ctx.fillText(cat.emoji, width - 450, height - 100);
        ctx.globalAlpha = 1.0;

        // Guardar FS
        const imgName = `${post.slug}-feature.jpg`; // PNG pesa demasiado, como es simple JPG sirve y va más rápido
        const filePath = path.join(OUT_DIR, imgName);

        // Necesitas stream de jpeg en Canvas 2.x
        const out = fs.createWriteStream(filePath);
        const stream = canvas.createJPEGStream({
            quality: 0.9,
            chromaSubsampling: false
        });

        await new Promise((resolve, reject) => {
            stream.pipe(out);
            out.on('finish', () => {
                console.log(`Generado: ${imgName}`);
                resolve();
            });
            out.on('error', reject);
        });

        // Acualizar Supabase
        const dbImgPath = `/images/blog/${imgName}`;
        const { error: upErr } = await supabase.from('posts')
            .update({ featured_image: dbImgPath })
            .eq('id', post.id);

        if (upErr) console.error('Error actualizando:', post.slug, upErr.message);
    }

    console.log('¡Todas las portadas generadas y DB actualizada!');
}

generateCovers();
