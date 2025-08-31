
import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { siteConfig } from '@/config/site';

const collectionsToMap = ['events', 'communities', 'businesses', 'deals', 'movies', 'classifieds'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteConfig.url}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteConfig.url}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteConfig.url}/communities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteConfig.url}/businesses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteConfig.url}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteConfig.url}/movies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteConfig.url}/classifieds`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteConfig.url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/perks`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteConfig.url}/kerala`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/learn`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteConfig.url}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  try {
    const dynamicRoutes = await Promise.all(
      collectionsToMap.map(async (collectionName) => {
        const q = query(collection(db, collectionName), where('status', 'in', ['published', 'now_showing', 'active']));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          // Ensure slug exists and is a string, fallback to doc.id
          const slug = typeof data.slug === 'string' && data.slug ? data.slug : doc.id;
  
          return {
            url: `${siteConfig.url}/${collectionName}/${slug}`,
            lastModified: data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          };
        });
      })
    );
    return [...staticRoutes, ...dynamicRoutes.flat()];
  } catch (error) {
    console.error("Could not generate dynamic sitemap.", error);
    return staticRoutes;
  }
}
