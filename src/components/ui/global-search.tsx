
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './input';
import { Search } from 'lucide-react';

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
      <Input
        placeholder="Search..."
        className="pl-10 h-9 bg-primary-foreground/10 border-primary-foreground/20 placeholder:text-primary-foreground/60 text-primary-foreground focus:bg-background focus:text-foreground"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
}
