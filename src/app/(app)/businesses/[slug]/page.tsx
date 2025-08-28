
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ItemDetailPage } from "@/components/item-detail-page";
import { notFound } from "next/navigation";
import type { Business, Item } from "@/types";
import type { Metadata, ResolvingMetadata } from "next";
import { siteConfig } from "@/config/site";

// ---- Fetch single business by slug ----
async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (!slug) return null;
  const ref = collection(db, "businesses");
  const q = query(ref, where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();

  // Safely construct the object
  return {
    id: docSnap.id,
    slug: data.slug || '',
    displayName: data.displayName || 'Unnamed Business',
    description: data.description || '',
    category: data.category || 'other',
    locations: data.locations || [],
    cities: data.cities || [],
    isOnline: data.isOnline || false,
    contact: data.contact || {},
    images: data.images || [],
    logoURL: data.logoURL || '',
    status: data.status || 'draft',
    verified: data.verified || false,
    ownerId: data.ownerId || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

// ---- SEO Metadata ----
export async function generateMetadata(
  { params }: { params: { slug: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug);

  if (!business) return {};

  const ogImage = business.images?.[0] || siteConfig.ogImage;
  const description =
    business.description ||
    `Explore ${business.displayName} on ${siteConfig.name}.`;

  return {
    title: business.displayName,
    description,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: business.displayName,
      description,
      type: "article",
      url: `${siteConfig.url}/businesses/${business.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: business.displayName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: business.displayName,
      description,
      images: [ogImage],
      creator: "@culturekerala",
    },
  };
}

// ---- Page Component ----
export default async function BusinessDetailPage({ params }: { params: { slug: string } }) {
  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }

  const relatedItemsQuery = query(
    collection(db, "deals"),
    where("businessId", "==", business.id),
    where("status", "==", "published"),
    limit(3)
  );

  const item: Item = {
    id: business.id,
    slug: business.slug,
    title: business.displayName,
    description: business.description || "No description available.",
    category: "Business",
    location: business.isOnline
      ? "Online"
      : business.locations?.[0]?.address || "Location TBD",
    image: business.images?.[0] || "https://picsum.photos/1200/600",
    contact: business.contact,
  };

  return <ItemDetailPage item={item} relatedItemsQuery={relatedItemsQuery} />;
}

// ---- Static paths for SSG ----
export async function generateStaticParams() {
  try {
    const ref = collection(db, "businesses");
    const snapshot = await getDocs(ref);

    return snapshot.docs.map((docSnap) => ({
      slug: docSnap.data().slug as string,
    }));
  } catch (error) {
    console.error("Failed to generate static params for businesses:", error);
    return [];
  }
}

// ISR: Revalidate every 60s
export const revalidate = 60;
