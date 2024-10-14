"use client"

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  // Add other profile fields as needed
}

const UserProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
        } else {
          setProfile(data)
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || undefined} />
            <AvatarFallback>{profile.full_name ? profile.full_name.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{profile.full_name || 'Anonymous'}</CardTitle>
            <CardDescription>{/* Add user email or other info here */}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add more profile information here */}
          <Button>Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Add more cards or sections for user activity, etc. */}
    </div>
  );
};

export default UserProfile;
