"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  password: string | null;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  model: string;
  framework: string;
  difficulty: string;
  upvotes: number;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<Profile>();
  const [user, setUser] = useState<User>();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getProfileAndPrompts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      const { data: promptsData, error: promptsError } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id);

      if (promptsError) {
        console.error('Error fetching prompts:', promptsError);
      } else {
        setPrompts(promptsData);
      }

      setLoading(false);
    };

    getProfileAndPrompts();
  }, []);

  const handleUpvote = async (promptId: string) => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .update({ upvotes: prompts.find(p => p.id === promptId)!.upvotes + 1 })
        .eq('id', promptId)
        .select();

      if (error) throw error;

      setPrompts(prevPrompts =>
        prevPrompts.map(p =>
          p.id === promptId ? { ...p, upvotes: data[0].upvotes } : p
        )
      );
    } catch (error) {
      console.error('Error upvoting prompt:', error);
      toast({
        title: "Error upvoting prompt",
        description: "There was an error upvoting the prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user!.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev!, full_name: fullName }));
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (  
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">User Profile</h2>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Left column: User Profile */}
        <div className="w-full lg:w-1/3 xl:w-1/4">
          {profile?.avatar_url && (
            <div className="mb-4">
              <Label>Avatar</Label>
              <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full" />
            </div>
          )}
          
           
              <form onSubmit={handleProfileUpdate} className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email || ''} disabled className="text-sm sm:text-base" />
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" defaultValue={profile?.full_name || ''} className="text-sm sm:text-base" />
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" defaultValue={profile?.username || ''} className="text-sm sm:text-base" />
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" className="text-sm sm:text-base" />
                </div>
                
                <Button type="submit" className="w-full text-sm sm:text-base">Update Profile</Button>
              </form>
            </div>

        {/* Right column: User Prompts */}
        <div className="w-full lg:w-2/3 xl:w-3/4 mt-6 lg:mt-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Your Prompts</h3>
          {prompts.length === 0 ? (
            <p className="text-gray-600 text-sm sm:text-base">You haven't created any prompts yet.</p>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="py-2 sm:py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm sm:text-base md:text-lg">{prompt.title}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => handleUpvote(prompt.id)}>
                        <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="text-xs sm:text-sm">{prompt.upvotes}</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="py-1 sm:py-2">
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">{prompt.description}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{prompt.model}</Badge>
                      <Badge variant="outline" className="text-xs">{prompt.framework}</Badge>
                      <Badge className="text-xs">{prompt.difficulty}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile;
