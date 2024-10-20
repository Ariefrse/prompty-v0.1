"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<Profile>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    getProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return;
  }

  return (  
    <div>
      <h2>User Profile</h2>
      <p>Email: {user.email}</p>
      <p>Full Name: {profile?.full_name || 'Not set'}</p>
      {profile?.avatar_url && <img src={profile.avatar_url} alt="Avatar" />}
    </div>
  )
}

export default UserProfile
