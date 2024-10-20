"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/utils/supabase/client'; // Correct Import

const promptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  aiModel: z.string().min(1, 'Please select an AI model'),
  framework: z.string().min(1, 'Please select a framework'),
  difficulty: z.string().min(1, 'Please select a difficulty level'),
  tags: z.string().refine(value => value.split(',').filter(Boolean).length > 0, {
    message: 'Please provide at least one tag',
  }),
});

const aiModels = [
  { value: "gpt3", label: "GPT-3" },
  { value: "gpt4", label: "GPT-4" },
  { value: "dalle", label: "DALL-E" },
  { value: "stable-diffusion", label: "Stable Diffusion" },
  { value: "midjourney", label: "Midjourney" },
];

const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "nextjs", label: "Next.js" },
  { value: "express", label: "Express" },
  { value: "django", label: "Django" },
  { value: "flask", label: "Flask" },
  { value: "none", label: "None" },
];

const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function SubmitPromptForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: '',
      description: '',
      aiModel: '',
      framework: '',
      difficulty: '',
      tags: '',
    },
  });

  async function onSubmit(values: z.infer<typeof promptSchema>) {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            ...values,
            tags: values.tags.split(',').map(tag => tag.trim()),
            created_at: new Date().toISOString(),
            upvotes: 0,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Prompt submitted successfully!",
        description: "Your prompt has been submitted for review.",
      });
      form.reset();
    } catch (error: any) {
      console.error("Error submitting prompt:", error);
      toast({
        title: "Error submitting prompt",
        description: error.message || "There was an error submitting your prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Submit a New Prompt</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your prompt title" {...field} />
                </FormControl>
                <FormDescription>
                  A catchy title for your AI prompt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your prompt in detail..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a clear description of the AI challenge or prompt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="aiModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aiModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a framework" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frameworks.map((framework) => (
                        <SelectItem key={framework.value} value={framework.value}>
                          {framework.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tags separated by commas" {...field} />
                </FormControl>
                <FormDescription>
                  Add relevant tags to help others find your prompt (e.g., image-generation, text-completion, code-assistant).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Prompt'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
