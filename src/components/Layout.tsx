import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Car } from 'lucide-react';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight text-foreground">Veloce</span>
            </div>
            <ThemeToggle className="relative" />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built with ❤️ at Cloudflare
          </p>
        </div>
      </footer>
    </div>
  );
};
export default Layout;