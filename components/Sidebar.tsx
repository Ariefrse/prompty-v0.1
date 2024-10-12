"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Home, Search, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/prompts', icon: Search, label: 'Prompt List' },
    { href: '/submit', icon: PlusCircle, label: 'Submit' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside 
      className={cn(
        "bg-background border-r fixed left-0 top-0 h-full pt-16 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        "z-50", // Added highest z-index
        isExpanded ? "w-48" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="p-2">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={cn(
                  "flex items-center text-foreground hover:text-primary p-2 rounded-lg hover:bg-secondary",
                  "transition-all duration-300 ease-in-out",
                  "relative h-10"
                )}
              >
                <span className="absolute left-2">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                </span>
                <span 
                  className={cn(
                    "absolute left-10 whitespace-nowrap",
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;