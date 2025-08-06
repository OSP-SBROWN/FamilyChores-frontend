import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner } from '@heroui/react';
import Login from './Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, error } = useAuth0();

  // Show loading spinner while Auth0 is checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if there's an Auth0 error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold mb-2">Authentication Error</h2>
            <p className="text-red-600 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show protected content if authenticated
  return <>{children}</>;
}
