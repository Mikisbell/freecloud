import GithubSlugger from 'github-slugger';

export interface ToCItem {
    id: string;
    text: string;
    level: number;
}

/**
 * Extrae los títulos (## y ###) de un texto Markdown y les asigna el mismo ID
 * que generaría rehype-slug, usando github-slugger.
 * Ignora los títulos dentro de bloques de código.
 */
export function extractHeadings(markdown: string): ToCItem[] {
    if (!markdown) return [];

    const slugger = new GithubSlugger();
    const headings: ToCItem[] = [];

    // Limpiar bloques de código primero para que no extraiga comentarios estilo markdown
    const textWithoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, '');

    // Expresión regular para capturar ## y ###
    // Soporta espacios opcionales al inicio, luego 2 o 3 hashtags, espacio, y el texto
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;

    let match;
    while ((match = headingRegex.exec(textWithoutCodeBlocks)) !== null) {
        const level = match[1].length; // 2 o 3
        const text = match[2].trim();

        // Evitar match vacíos o componentes HTML inyectados accidentalmente
        if (text && !text.startsWith('<')) {
            const id = slugger.slug(text);
            headings.push({ id, text, level });
        }
    }

    return headings;
}
