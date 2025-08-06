import React from 'react';
import { Link, useLocation } from 'react-router';
import { 
  Navbar, 
  NavbarContent, 
  NavbarItem, 
  Button,
  Divider,
  Chip
} from '@heroui/react';
import { 
  Home, 
  Clock, 
  Users, 
  Calendar, 
  Settings,
  BarChart3,
  CheckSquare
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: Home,
    color: 'primary' as const,
    description: 'Overview & Stats'
  },
  {
    label: 'Timezones',
    href: '/timezones',
    icon: Clock,
    color: 'secondary' as const,
    description: 'Manage Time Periods'
  },
  {
    label: 'Household',
    href: '/household',
    icon: Users,
    color: 'success' as const,
    description: 'Family Members'
  },
  {
    label: 'Chores',
    href: '/chores',
    icon: CheckSquare,
    color: 'warning' as const,
    description: 'Task Management'
  },
  {
    label: 'Schedule',
    href: '/schedule',
    icon: Calendar,
    color: 'danger' as const,
    description: 'Weekly Planning'
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
    color: 'default' as const,
    description: 'Analytics & Insights'
  }
];

export default function Navigation({ className = '' }: NavigationProps) {
  const location = useLocation();

  return (
    <div className={`w-full bg-white/70 backdrop-blur-lg border-b border-primary-100/50 ${className}`}>
      <Navbar
        maxWidth="full"
        className="bg-transparent"
        height="3.5rem"
        isBordered={false}
      >
        <NavbarContent className="flex gap-1 w-full" justify="center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavbarItem key={item.href} className="flex">
                <Button
                  as={Link}
                  to={item.href}
                  variant={isActive ? "flat" : "light"}
                  color={isActive ? item.color : "default"}
                  size="md"
                  className={`
                    flex flex-col h-12 px-4 gap-1 min-w-20
                    ${isActive 
                      ? 'bg-gradient-to-br from-white to-primary-50 shadow-md ring-1 ring-primary-200' 
                      : 'hover:bg-white/60'
                    }
                    transition-all duration-200
                  `}
                  startContent={
                    <Icon 
                      className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-primary-500'}`} 
                    />
                  }
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xs font-semibold ${isActive ? 'text-primary-700' : 'text-primary-600'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="text-[8px] h-4 min-h-4 px-1 bg-primary-100/80 text-primary-600"
                      >
                        {item.description}
                      </Chip>
                    )}
                  </div>
                </Button>
              </NavbarItem>
            );
          })}
        </NavbarContent>
      </Navbar>
    </div>
  );
}
