import type { Album } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { AlbumGrid } from '@/components/AlbumGrid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

async function getAlbums(): Promise<Album[]> {
  // Check if Supabase client is initialized
  if (!supabase) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('Album')
      .select('*')
      .order('Title', { ascending: true });

    if (error) {
      console.error('Error fetching albums:', error);
      // In a real app, this should be handled more gracefully
      return [];
    }
    return data || [];
  } catch(e) {
    // This can happen if the URL is invalid
    console.error(e);
    return [];
  }
}

export default async function Home() {
  const albums = await getAlbums();

  const isSupabaseConfigured = !!supabase;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-headline font-bold tracking-tight text-primary">
          Album Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse through the collection of albums. Click on an album to see its tracks. Use the search bar to filter by title.
        </p>
      </div>

      {isSupabaseConfigured && albums.length > 0 ? (
        <AlbumGrid albums={albums} />
      ) : (
        <Alert className="mt-16 max-w-2xl mx-auto">
          <Terminal className="h-4 w-4" />
          <AlertTitle className="font-headline">Connect to your Supabase Database</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              To connect to your own Supabase instance, create a{' '}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                .env.local
              </code>{' '}
              file in your project root and add your credentials. Make sure the URL is valid.
            </p>
            <pre className="bg-muted-foreground/10 p-2 rounded-md text-sm font-code mt-2 overflow-x-auto">
              <code>
                {`NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"\nNEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"`}
              </code>
            </pre>
             <p className="mt-4">
              After creating the file, you'll need to restart your development server for the changes to take effect.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
