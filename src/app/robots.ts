import { MetadataRoute } from 'next';
import { siteConfig } from '@/constants/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/api/', '/checkout/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}