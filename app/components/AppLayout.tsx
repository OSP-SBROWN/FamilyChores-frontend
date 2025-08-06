import React from 'react';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function AppLayout({ 
  children, 
  user
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with integrated navigation */}
      <Header user={user} />
      
      {/* Main Content */}
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
