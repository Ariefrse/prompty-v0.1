"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  upvotes: number;
  difficulty: string;
}

const PromptGrid = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching prompts:', error);
      } else {
        setPrompts(data as Prompt[]);
      }
    };

    fetchPrompts();
  }, []);

  const handleUpvote = async (id: string) => {
    const { data, error } = await supabase
      .from('prompts')
      .update({ upvotes: (prompts.find(p => p.id === id)?.upvotes || 0) + 1 })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error upvoting prompt:', error);
    } else {
      setPrompts(prompts.map(prompt => 
        prompt.id === id ? { ...prompt, upvotes: (prompt.upvotes || 0) + 1 } : prompt
      ));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <Card key={prompt.id}>
          <CardHeader>
            <CardTitle>{prompt.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{prompt.prompt}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <Badge>{prompt.difficulty}</Badge>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleUpvote(prompt.id)}>
              <ThumbsUp className="mr-2 h-4 w-4" />
              {prompt.upvotes || 0}
            </Button>
            <Button size="sm">View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PromptGrid;