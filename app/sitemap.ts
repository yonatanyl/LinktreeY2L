import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'y2lnatan.site', // NANTI GANTI DENGAN DOMAIN BARU ANDA JIKA SUDAH BELI
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
  ];
}