import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Link } from 'wouter';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <AppLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-6xl font-bold font-mono text-primary mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors">
          <Home className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </AppLayout>
  );
}
