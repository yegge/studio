import { supabase } from '@/lib/supabase';
import type { Album, Track } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Clock, Music } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AlbumDetailPageProps = {
  params: {
    albumId: string;
  };
};

async function getAlbumData(albumId: string): Promise<{ album: Album; tracks: Track[] } | null> {
  if (!supabase) {
    return null;
  }

  const albumIdNum = parseInt(albumId, 10);
  if (isNaN(albumIdNum)) {
    return null;
  }

  const albumPromise = supabase
    .from('Album')
    .select('*')
    .eq('AlbumId', albumIdNum)
    .single();

  const tracksPromise = supabase
    .from('Track')
    .select('*')
    .eq('AlbumId', albumIdNum)
    .order('TrackId', { ascending: true });

  const [albumResult, tracksResult] = await Promise.all([albumPromise, tracksPromise]);

  if (albumResult.error || !albumResult.data) {
    return null;
  }
  
  if (tracksResult.error) {
     console.error('Error fetching tracks:', tracksResult.error);
  }

  return {
    album: albumResult.data,
    tracks: tracksResult.data || [],
  };
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const data = await getAlbumData(params.albumId);

  if (!data) {
    notFound();
  }

  const { album, tracks } = data;

  const totalDuration = tracks.reduce((sum, track) => sum + track.Milliseconds, 0);

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Albums
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <Card className="overflow-hidden sticky top-24">
            <div className="relative w-full aspect-square">
              <Image
                src={`https://picsum.photos/seed/${album.AlbumId}/600/600`}
                alt={`Cover art for ${album.Title}`}
                width={600}
                height={600}
                className="object-cover"
                priority
                data-ai-hint="album cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{album.Title}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="font-bold">{tracks.length}</p>
                        <p className="text-muted-foreground">Tracks</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="font-bold">{formatDuration(totalDuration)}</p>
                        <p className="text-muted-foreground">Duration</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
            <h2 className="text-3xl font-headline font-bold mb-4">Tracklist</h2>
            <Card>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] text-center">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Composer</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {tracks.length > 0 ? (
                        tracks.map((track, index) => (
                            <TableRow key={track.TrackId}>
                            <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                            <TableCell className="font-medium">{track.Name}</TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                {track.Composer || 'N/A'}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {formatDuration(track.Milliseconds)}
                            </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No tracks found for this album.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </Card>
        </div>
      </div>
    </div>
  );
}
