
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item, Perk as PerkType } from '@/types';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { Award } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';

export default function PerksPage() {
  const [perks, setPerks] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { appUser } = useAuth();

  useEffect(() => {
    const fetchPerks = async () => {
      setLoading(true);
      try {
        const ref = collection(db, "perks");
        let q = query(ref, where("status", "==", "active"));
        
        // If user is not a club member, only show perks for all users (if any)
        if (!appUser?.clubMembership?.status || appUser.clubMembership.status !== 'active') {
            q = query(q, where("eligibility", "==", "all_users"));
        }

        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => {
          const perkData = doc.data() as PerkType;
          return { 
            id: doc.id,
            slug: perkData.slug, 
            title: perkData.title,
            description: perkData.description || '',
            category: 'Perk',
            location: perkData.partnerBusinessId ? 'Partner Offer' : 'Platform Benefit',
            image: perkData.imageURL || 'https://placehold.co/600x400.png',
          } as Item
        });
        
        setPerks(data);
      } catch (error) {
        console.error("Error fetching perks: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerks();
  }, [appUser]);


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <Award className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold">DilSePass Club Perks</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Exclusive benefits and offers available only to our club members.
        </p>
      </header>

      {loading ? <ItemsGridSkeleton /> : <ItemsGrid items={perks} />}
    </div>
  );
}

function ItemsGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <h3 className="font-headline text-2xl">No Perks Found</h3>
        <p>Check back soon for new and exciting perks!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
