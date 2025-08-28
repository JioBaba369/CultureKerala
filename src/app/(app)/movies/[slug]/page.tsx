
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Movie, Item } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

async function getMovieBySlug(slug: string): Promise<Movie | null> {
  if (!slug) return null;
  const ref = collection(db, 'movies');
  const q = query(ref, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();

  return {
    id: docSnap.id,
    title: data.title || 'Untitled Movie',
    slug: data.slug || '',
    overview: data.overview || '',
    posterURL: data.posterURL || '',
    backdropURL: data.backdropURL || '',
    releaseDate: data.releaseDate,
    genres: data.genres || [],
    languages: data.languages || [],
    cast: data.cast || [],
    crew: data.crew || [],
    status: data.status || 'upcoming',
    screenings: data.screenings || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as Movie;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    return {};
  }

  const ogImage = movie.posterURL || siteConfig.ogImage;
  const description = movie.overview || `Find out more about the movie ${movie.title} on ${siteConfig.name}.`;

  return {
    title: movie.title,
    description,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: movie.title,
      description,
      type: 'article',
      url: `${siteConfig.url}/movies/${movie.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: movie.title,
      description,
      images: [ogImage],
      creator: '@culturekerala',
    },
  };
}


export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }
  
   const item: Item = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    description: movie.overview,
    category: "Movie",
    location: movie.screenings?.[0]?.city || 'TBD',
    image: movie.posterURL || 'https://picsum.photos/1200/600',
  };

  return <ItemDetailPage item={item} />;
}

// This function generates the static paths for all movies at build time
export async function generateStaticParams() {
  try {
    const ref = collection(db, 'movies');
    const snapshot = await getDocs(ref);
    
    return snapshot.docs.map(doc => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for movies:", error);
    return [];
  }
}

// Revalidate data at most every 60 seconds
export const revalidate = 60;
