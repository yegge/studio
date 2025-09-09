import Link from 'next/link';
import { Music2 } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Music2 className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">
            Album Explorer
          </span>
        </Link>
      </div>
    </header>
  );
}
