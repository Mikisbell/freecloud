export interface Product {
    slug: string;
    tag: string;
    tagColor: string;
    tagBg: string;
    title: string;
    price: string;
    priceDisplay: string;
    desc: string;
    href: string;
    isGumroad: boolean;
    cover?: string;
}

/**
 * Single source of truth for all digital products.
 * Used in: Homepage, /recursos, JSON-LD schemas, CLAUDE.md reference.
 * All prices in PEN (Peruvian Soles) — target market is Peru.
 */
export const PRODUCTS: Product[] = [
    {
        slug: 'excel-e030',
        tag: 'Excel',
        tagColor: 'bg-green-100 text-green-800',
        tagBg: '#16a34a',
        title: 'Plantilla Diseno Sismico E.030',
        price: 'S/25',
        priceDisplay: 'S/25',
        desc: 'Cortante basal, distribucion por pisos y derivas. Formulas automaticas segun norma vigente.',
        href: 'https://freecloud.gumroad.com/l/excel-diseno-sismico-e030',
        isGumroad: true,
        cover: '/recursos/sismica_cover.png',
    },
    {
        slug: 'excel-metrados',
        tag: 'Excel',
        tagColor: 'bg-green-100 text-green-800',
        tagBg: '#16a34a',
        title: 'Plantilla Metrados de Obra',
        price: 'S/20',
        priceDisplay: 'S/20',
        desc: 'Concreto, acero y encofrado con formulas automaticas por elemento estructural.',
        href: 'https://freecloud.gumroad.com/l/plantilla-metrados',
        isGumroad: true,
        cover: '/recursos/metrados_cover.png',
    },
    {
        slug: 'hp-prime-hardy-cross',
        tag: 'HP Prime',
        tagColor: 'bg-blue-100 text-blue-800',
        tagBg: '#1d4ed8',
        title: 'Hardy Cross -- Analisis Estructural',
        price: 'S/35',
        priceDisplay: 'S/35',
        desc: 'Programa completo para analisis de porticos. Codigo listo para copiar a tu calculadora.',
        href: 'https://freecloud.gumroad.com/l/hp-prime-hardy-cross',
        isGumroad: true,
        cover: '/recursos/hp_prime_cover.png',
    },
    {
        slug: 'python-revit-scripts',
        tag: 'Python',
        tagColor: 'bg-yellow-100 text-yellow-800',
        tagBg: '#ca8a04',
        title: 'Scripts Python para Revit API',
        price: 'S/50',
        priceDisplay: 'S/50',
        desc: 'Automatiza tareas repetitivas en Revit. Scripts listos para pyRevit y Dynamo.',
        href: 'https://freecloud.gumroad.com/l/revit-scripts-python',
        isGumroad: true,
        cover: '/recursos/python_revit_cover.png',
    },
    {
        slug: 'familias-revit',
        tag: 'Revit',
        tagColor: 'bg-indigo-100 text-indigo-800',
        tagBg: '#4f46e5',
        title: 'Familias Revit Estructural',
        price: 'S/40',
        priceDisplay: 'S/40',
        desc: 'Familias parametricas para columnas, vigas y cimentaciones peruanas.',
        href: 'https://freecloud.gumroad.com/l/familias-revit-estructural',
        isGumroad: true,
        cover: '/recursos/familias_revit_cover.png',
    },
    {
        slug: 'plantilla-peb',
        tag: 'BIM',
        tagColor: 'bg-cyan-100 text-cyan-800',
        tagBg: '#0891b2',
        title: 'Plantilla Plan de Ejecucion BIM (PEB)',
        price: 'S/60',
        priceDisplay: 'S/60',
        desc: 'Plantilla profesional del PEB para licitaciones publicas bajo Ley 32069.',
        href: 'https://freecloud.gumroad.com/l/plantilla-peb-bim',
        isGumroad: true,
        cover: '/recursos/peb_bim_cover.png',
    },
];

/** Get first N products (for homepage preview) */
export function getHomepageProducts(limit = 3): Product[] {
    return PRODUCTS.slice(0, limit);
}
