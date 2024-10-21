"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Home, Search, PlusCircle, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/prompts', icon: Search, label: 'Prompt List' },
    { href: '/submit', icon: PlusCircle, label: 'Submit' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <nav className={cn("p-4", isMobile ? "pt-8" : "")}>
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
              <span className={cn("absolute left-2", isMobile ? "top-2" : "mt-4")}>
                <item.icon className="h-5 w-5 flex-shrink-0" />
              </span>
              <span 
                className={cn(
                  "absolute left-10 whitespace-nowrap",
                  isMobile ? "top-2" : "mt-4",
                  !isMobile && (isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4")
                )}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-4 left-4 z-50 sm:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[280px]">
          <SidebarContent isMobile={true} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "bg-background border-r fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-hidden",
          "transition-all duration-300 ease-in-out",
          "z-40",
          "hidden sm:block",
          isExpanded ? "w-48" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

export default Sidebar;
