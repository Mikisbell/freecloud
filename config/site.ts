export const siteConfig = {
    name: 'FreeCloud',
    description: 'BIM, ingeniería civil y tecnología. Tutoriales, herramientas y recursos para ingenieros en Perú y Latinoamérica.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://freecloud.pe',
    author: 'Miguel Rivera Ospina',
    authorTitle: 'Ingeniero Civil y Desarrollador BIM',
    links: {
        youtube: 'https://www.youtube.com/@mikisbell',
        linkedin: 'https://www.linkedin.com/in/mikisbell/',
        facebook: 'https://www.facebook.com/freecloud.pe',
        github: '', // Add if needed
    },
    contact: {
        email: 'admin@freecloud.pe',
        location: 'Huancayo, Perú',
    },
    megaMenuFeaturedPost: {
        slug: 'bim-obligatorio-peru-2026',
        url: '/blog/bim-obligatorio-peru-2026',
    }
};

export type SiteConfig = typeof siteConfig;
