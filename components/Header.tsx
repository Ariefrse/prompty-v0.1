"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

const MoonIcon = dynamic(() => import('lucide-react').then((mod) => mod.Moon), { ssr: false });
const SunIcon = dynamic(() => import('lucide-react').then((mod) => mod.Sun), { ssr: false });

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setMounted(true);
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
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
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost">Logout</Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="ghost">Login / Sign Up</Button>
            </Link>
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