"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

const MoonIcon = dynamic(() => import('lucide-react').then((mod) => mod.Moon), { ssr: false });
const SunIcon = dynamic(() => import('lucide-react').then((mod) => mod.Sun), { ssr: false });

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth');
  };
  
  return (
    <header className="bg-background border-b fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex text-3xl font-bold text-primary">
          Prompty
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/submit">
                <Button variant="ghost">Submit Prompt</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="ghost">Sign Up</Button>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && (theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />)}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
