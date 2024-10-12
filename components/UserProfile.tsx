"use client"

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  prompts_count: number;
  contributions_count: number;
}

type UserWithProfile = User & Profile;

const UserProfile = () => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUser({ ...user, ...data } as UserWithProfile);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url || undefined} alt={user.name || undefined} />
            <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name || 'Anonymous'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{user.bio || 'No bio provided'}</p>
          <div className="flex space-x-4 mb-4">
            <div>
              <strong>{user.prompts_count || 0}</strong> <span className="text-muted-foreground">Prompts</span>
            </div>
            <div>
              <strong>{user.contributions_count || 0}</strong> <span className="text-muted-foreground">Contributions</span>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {/* Add real activity data here when available */}
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Submitted a new prompt</p>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
              <Badge>Prompt</Badge>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;