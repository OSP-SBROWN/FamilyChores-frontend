import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Home, Clock, Users, Calendar, Settings, LogOut, ChevronDown, Heart, Menu, User } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';

export default function Header() {
  const { user, logout, isLoading } = useAuth0();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  // Guard against undefined user
  if (!user) {
    return null;
  }

  const menuItems = [
    { name: "Home", href: "/", icon: Home, disabled: false },
    { name: "Manage Timezones", href: "/timezones", icon: Clock, disabled: false },
  { name: "Manage Household", href: "/people", icon: Users, disabled: false },
    { name: "Manage Chores", href: "/chores", icon: Calendar, disabled: true },
    { name: "Settings", href: "/settings", icon: Settings, disabled: true },
  ];

  return (
    <header className="bg-[#023047] shadow-xl border-b border-white/10 relative z-50">
      <nav className="max-w-full mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Toggle and Brand */}
        <div className="flex items-center flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden text-white hover:bg-white/10 mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center sm:justify-start">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-3xl font-bold app-name">
                <span className="chore">Chore</span><span className="nest">Nest</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/70 font-medium tracking-wide hidden sm:block">
                Family Organization Hub
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-3 flex-1 justify-center">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.disabled ? (
                <Button
                  variant="ghost"
                  disabled
                  className="font-medium text-[#219EBC] cursor-not-allowed opacity-70 px-6 py-3 flex items-center gap-2"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Button>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  className={`
                    flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300
                    ${location.pathname === item.href 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl scale-105 hover:from-orange-500 hover:to-orange-600" 
                      : "text-white hover:text-orange-300 hover:bg-white/10 hover:scale-105"
                    }
                  `}
                >
                  <RouterLink to={item.href}>
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </RouterLink>
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* User Profile Dropdown */}
        <div className="flex-shrink-0 relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-white/10 text-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-xs text-white/70">{user.email}</p>
            </div>
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold z-10">
                3
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg hover:scale-110 transition-transform">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name || 'User'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-800" />
                )}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/70" />
          </Button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsDropdownOpen(false)}
              />
              
              {/* Dropdown Content */}
              <Card className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-lg border border-orange-200/50 shadow-xl z-40">
                <CardContent className="p-2">
                  <div className="p-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">Signed in as</p>
                    <p className="font-semibold text-orange-600 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-orange-50 text-gray-700 font-medium"
                    >
                      <Settings className="w-5 h-5 text-orange-600 mr-2" />
                      My Settings
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-orange-50 text-gray-700 font-medium"
                    >
                      Help & Feedback
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-red-50 text-red-600 font-medium"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Log Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="sm:hidden fixed inset-0 bg-black/50 z-30" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Content */}
          <div className="sm:hidden fixed top-20 left-0 w-full bg-[#023047] border-r border-white/10 pt-6 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 space-y-2">
              {menuItems.map((item, index) => (
                <div key={`${item.name}-${index}`}>
                  {item.disabled ? (
                    <div className="w-full p-4 flex items-center gap-3 text-[#219EBC] opacity-70 cursor-not-allowed rounded-lg">
                      <item.icon className="w-6 h-6" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  ) : (
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full p-4 flex items-center gap-3 text-white hover:bg-white/10 rounded-lg justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <RouterLink to={item.href}>
                        <item.icon className="w-6 h-6" />
                        <span className="font-medium">{item.name}</span>
                      </RouterLink>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {/* User Profile in Mobile Menu */}
            <div className="px-4 pt-4 border-t border-white/10 mt-4">
              <div className="p-4 flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center border-2 border-white/30">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name || 'User'} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-orange-800" />
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-white/70">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
