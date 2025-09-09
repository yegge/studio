'use client';

import { useState, useMemo } from 'react';
import type { Album } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Music } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type AlbumGridProps = {
  albums: Album[];
};

export function AlbumGrid({ albums }: AlbumGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlbums = useMemo(() => {
    if (!searchTerm) return albums;
    return albums.filter((album) =>
      album.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [albums, searchTerm]);

  return (
    <div>
      <div className="relative mb-8 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by album title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAlbums.map((album) => (
            <Link key={album.AlbumId} href={`/albums/${album.AlbumId}`} passHref>
              <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={`https://picsum.photos/seed/${album.AlbumId}/400/400`}
                    alt={`Cover art for ${album.Title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="album cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardHeader className="p-4 mt-auto z-10 bg-card">
                  <CardTitle className="font-headline text-lg leading-tight text-card-foreground group-hover:text-primary transition-colors">
                    {album.Title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Music className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-headline font-semibold">No Albums Found</h3>
          <p className="mt-2 text-muted-foreground">
            Your search for "{searchTerm}" did not match any albums.
          </p>
        </div>
      )}
    </div>
  );
}
