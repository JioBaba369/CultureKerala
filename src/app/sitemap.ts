
import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { siteConfig } from '@/config/site';

const collectionsToMap = ['events', 'communities', 'businesses', 'deals', 'movies'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/explore`, lastModified: new Date() },
    { url: `${siteConfig.url}/events`, lastModified: new Date() },
    { url: `${siteConfig.url}/communities`, lastModified: new Date() },
    { url: `${siteConfig.url}/businesses`, lastModified: new Date() },
    { url: `${siteConfig.url}/deals`, lastModified: new Date() },
    { url: `${siteConfig.url}/movies`, lastModified: new Date() },
    { url: `${siteConfig.url}/about`, lastModified: new Date() },
    { url: `${siteConfig.url}/contact`, lastModified: new Date() },
    { url: `${siteConfig.url}/perks`, lastModified: new Date() },
  ];

  const dynamicRoutes = await Promise.all(
    collectionsToMap.map(async (collectionName) => {
      const q = query(collection(db, collectionName), where('status', 'in', ['published', 'now_showing', 'active']));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const slug = data.slug || doc.id;
        return {
          url: `${siteConfig.url}/${collectionName}/${slug}`,
          lastModified: data.updatedAt?.toDate() || new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      });
    })
  );

  return [...staticRoutes, ...dynamicRoutes.flat()];
}
