
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Movie, Item } from '@/types';

type Props = {
    params: {
        slug: string;
    };
};

async function getMovieBySlug(slug: string): Promise<Item | null> {
  const ref = collection(db, 'movies');
  const q = query(ref, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const movieData = doc.data() as Movie;

  return {
    id: doc.id,
    slug: movieData.slug,
    title: movieData.title,
    description: movieData.overview,
    category: "Movie",
    location: movieData.screenings?.[0]?.city || 'TBD',
    image: movieData.posterURL || 'https://placehold.co/1200x600.png',
  } as Item;
}


export default async function MovieDetailPage({ params }: Props) {
  const item = await getMovieBySlug(params.slug);

  if (!item) {
    notFound();
  }

  return <ItemDetailPage item={item} />;
}

// This function generates the static paths for all movies at build time
export async function generateStaticParams() {
  const ref = collection(db, 'movies');
  const snapshot = await getDocs(ref);
  
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

// Revalidate data at most every 60 seconds
export const revalidate = 60;
