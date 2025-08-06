import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardBody, Button, Spinner } from '@heroui/react';
import { Heart, LogIn } from 'lucide-react';

export default function Login() {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100"></div>
      
      {/* Login Card */}
      <Card className="relative w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border border-gray-100">
        <CardBody className="p-8">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-[#023047] rounded-full">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
            <h1 className="font-script text-4xl text-[#023047] mb-2">
              ChoreNest
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome to your family's chore management hub
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Sign In to Continue
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Access your family's chore dashboard securely with Auth0
              </p>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8ECAE6] to-[#219EBC] text-white font-medium py-3 px-4 rounded-lg hover:from-[#219EBC] hover:to-[#023047] transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
              startContent={
                isLoading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )
              }
            >
              {isLoading ? 'Signing In...' : 'Sign In with Auth0'}
            </Button>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500 mb-4">
                What you'll get access to:
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#8ECAE6] rounded-full mr-2"></div>
                  Manage family chores and assignments
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#219EBC] rounded-full mr-2"></div>
                  Track progress and completion
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#023047] rounded-full mr-2"></div>
                  Coordinate with family members
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#8ECAE6]/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#219EBC]/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-[#FFB703]/20 rounded-full blur-lg"></div>
    </div>
  );
}
