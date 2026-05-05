import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://y2lnatan.site/sitemap.xml', // NANTI GANTI DENGAN DOMAIN BARU ANDA
  };
}