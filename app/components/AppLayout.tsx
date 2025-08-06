import React from 'react';
import Header from './Header';
import ProtectedRoute from './ProtectedRoute';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Header with integrated navigation */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
