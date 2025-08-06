import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from '@heroui/react';
import { Home, Clock, Users, Calendar, Settings, LogOut, ChevronDown, Heart, Menu } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function Header({ user = { name: "John Doe", email: "john@example.com" } }: HeaderProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Home", href: "/", icon: Home, disabled: false },
    { name: "Manage Timezones", href: "/timezones", icon: Clock, disabled: false },
    { name: "Manage Household", href: "/household", icon: Users, disabled: true },
    { name: "Manage Chores", href: "/chores", icon: Calendar, disabled: true },
    { name: "Settings", href: "/settings", icon: Settings, disabled: true },
  ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      classNames={{
        base: "bg-[#023047] shadow-xl border-b border-white/10",
        wrapper: "px-4 sm:px-6",
        content: "gap-4",
        menu: "bg-[#023047] border-r border-white/10 pt-6 shadow-2xl",
        menuItem: "text-white"
      }}
      maxWidth="full"
      height="5rem"
    >
      {/* Mobile Menu Toggle and Brand */}
      <NavbarContent className="flex-1">
        <Button
          isIconOnly
          variant="light"
          className="sm:hidden text-white hover:bg-white/10 p-2 transition-all duration-200"
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="w-6 h-6 text-white" />
        </Button>
        <NavbarBrand className="flex-1 justify-center sm:justify-start">
          <div className="flex items-center gap-2 sm:gap-4">
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
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-3" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={location.pathname === item.href}>
            {item.disabled ? (
              <Button
                variant="light"
                isDisabled
                startContent={<item.icon className="w-5 h-5" />}
                className="font-medium text-[#219EBC] cursor-not-allowed opacity-70 px-6 py-3"
              >
                {item.name}
              </Button>
            ) : (
              <Link
                as={RouterLink}
                to={item.href}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${location.pathname === item.href 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl scale-105" 
                    : "text-white hover:text-orange-300 hover:bg-white/10 hover:scale-105"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )}
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* User Profile Dropdown */}
      <NavbarContent justify="end" className="flex-shrink-0">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2 sm:p-3 rounded-xl hover:bg-white/10 transition-all duration-200">
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-white/70">{user.email}</p>
              </div>
              <Badge 
                content="3" 
                color="danger" 
                size="sm"
                className="text-white"
              >
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform hover:scale-110 border-2 border-white/30 shadow-lg w-8 h-8 sm:w-10 sm:h-10"
                  color="default"
                  name={user.name}
                  size="md"
                  src={user.avatar}
                  classNames={{
                    base: "bg-gradient-to-br from-orange-200 to-orange-300",
                    name: "text-orange-800 font-bold"
                  }}
                />
              </Badge>
              <ChevronDown className="w-4 h-4 text-white/70" />
            </div>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Profile Actions" 
            variant="flat"
            classNames={{
              base: "bg-white/95 backdrop-blur-lg border border-orange-200/50 shadow-xl",
              list: "gap-1 p-2"
            }}
          >
            <DropdownItem key="profile" className="h-14 gap-2 hover:bg-orange-50 transition-colors">
              <p className="font-semibold text-gray-800">Signed in as</p>
              <p className="font-semibold text-orange-600">{user.email}</p>
            </DropdownItem>
            <DropdownItem 
              key="settings" 
              startContent={<Settings className="w-5 h-5 text-orange-600" />}
              className="hover:bg-orange-50 transition-colors"
            >
              <span className="text-gray-700 font-medium">My Settings</span>
            </DropdownItem>
            <DropdownItem 
              key="help_and_feedback"
              className="hover:bg-orange-50 transition-colors"
            >
              <span className="text-gray-700 font-medium">Help & Feedback</span>
            </DropdownItem>
            <DropdownItem 
              key="logout" 
              color="danger" 
              startContent={<LogOut className="w-5 h-5" />}
              className="hover:bg-red-50 transition-colors"
            >
              <span className="font-medium">Log Out</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden fixed top-20 left-0 w-full h-screen bg-[#023047] border-r border-white/10 pt-6 z-40 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={`${item.name}-${index}`} className="px-4">
              {item.disabled ? (
                <div className="w-full p-4 flex items-center gap-3 text-[#219EBC] opacity-70 cursor-not-allowed">
                  <item.icon className="w-6 h-6" />
                  <span className="font-medium">{item.name}</span>
                </div>
              ) : (
                <Link
                  as={RouterLink}
                  to={item.href}
                  className="w-full p-4 flex items-center gap-3 text-white hover:bg-white/10 rounded-lg transition-all duration-200 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
          
          {/* User Profile in Mobile Menu */}
          <div className="px-4 pt-4 border-t border-white/10 mt-4">
            <div className="p-4 flex items-center gap-3 text-white">
              <Avatar
                isBordered
                className="w-10 h-10 border-2 border-white/30"
                src={user.avatar}
                name={user.name}
              />
              <div className="flex flex-col">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-white/70">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Navbar>
  );
}
