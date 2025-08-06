import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Divider } from '@heroui/react';
import { Heart, Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const { loginWithRedirect } = useAuth0();

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // This would use Auth0's Management API for custom authentication
      // For now, let's use the redirect method but we can enhance this
      await loginWithRedirect({
        authorizationParams: {
          login_hint: email,
          screen_hint: mode
        }
      });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2'
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]"></div>
      
      {/* Login Card */}
      <Card className="relative w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-100">
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

          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#023047] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#023047] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Custom Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail className="w-4 h-4 text-gray-400" />}
              variant="bordered"
              classNames={{
                input: "text-gray-700",
                inputWrapper: "border-gray-200 hover:border-[#8ECAE6] focus:border-[#219EBC]"
              }}
              required
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="w-4 h-4 text-gray-400" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              variant="bordered"
              classNames={{
                input: "text-gray-700",
                inputWrapper: "border-gray-200 hover:border-[#8ECAE6] focus:border-[#219EBC]"
              }}
              required
            />

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-[#8ECAE6] to-[#219EBC] text-white font-medium py-3 px-4 rounded-lg hover:from-[#219EBC] hover:to-[#023047] transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
              startContent={
                isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )
              }
            >
              {isLoading ? 'Signing In...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <Divider className="my-6" />

          {/* Social Login */}
          <Button
            onClick={handleSocialLogin}
            variant="bordered"
            className="w-full border-gray-200 hover:border-[#8ECAE6] hover:bg-[#8ECAE6]/5"
            size="lg"
            startContent={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
          >
            Continue with Google
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
        </CardBody>
      </Card>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#8ECAE6]/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#219EBC]/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-[#FFB703]/20 rounded-full blur-lg"></div>
    </div>
  );
}
