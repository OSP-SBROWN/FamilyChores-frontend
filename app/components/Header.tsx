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
import { Home, Clock, Users, Calendar, Settings, LogOut, ChevronDown, Heart } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router';

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
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      {/* Mobile Menu Toggle and Brand */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Heart className="w-7 h-7 text-white" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-script font-bold bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent">
                ChoreNest
              </h1>
              <p className="text-sm text-orange-600/80 font-medium tracking-wide">
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
                className="font-medium text-gray-400 cursor-not-allowed opacity-50 px-6 py-3"
              >
                {item.name}
              </Button>
            ) : (
              <Link
                as={RouterLink}
                to={item.href}
                color={location.pathname === item.href ? "primary" : "foreground"}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${location.pathname === item.href 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl scale-105" 
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-100 hover:scale-105"
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
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-orange-100 transition-all duration-200">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-orange-600">{user.email}</p>
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
                  className="transition-transform hover:scale-110 border-2 border-orange-300 shadow-lg"
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
              <ChevronDown className="w-4 h-4 text-orange-600" />
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
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            {item.disabled ? (
              <div className="w-full p-4 flex items-center gap-3 text-gray-400 opacity-50 cursor-not-allowed">
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.name}</span>
              </div>
            ) : (
              <Link
                as={RouterLink}
                to={item.href}
                className="w-full"
                color={location.pathname === item.href ? "primary" : "foreground"}
                size="lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={`
                  w-full p-4 rounded-xl flex items-center gap-3 transition-all duration-300
                  ${location.pathname === item.href 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-100"
                  }
                `}>
                  <item.icon className="w-6 h-6" />
                  <span className="font-semibold">{item.name}</span>
                </div>
              </Link>
            )}
          </NavbarMenuItem>
        ))}
        
        {/* Mobile User Info */}
        <NavbarMenuItem>
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-lg">
            <div className="flex items-center gap-3">
              <Avatar
                isBordered
                className="border-2 border-orange-300"
                name={user.name}
                size="md"
                src={user.avatar}
                classNames={{
                  base: "bg-gradient-to-br from-orange-200 to-orange-300",
                  name: "text-orange-800 font-bold"
                }}
              />
              <div>
                <p className="font-bold text-gray-800">{user.name}</p>
                <p className="text-sm text-orange-600">{user.email}</p>
              </div>
            </div>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
