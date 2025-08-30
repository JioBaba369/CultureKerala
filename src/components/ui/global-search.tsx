
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GlobalSearch({ className }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search for anything..."
        className="pl-10 h-9 bg-background/90 text-foreground focus:bg-background"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
}
