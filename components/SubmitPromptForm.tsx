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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(100, {
    message: "Title must not be longer than 100 characters.",
  }),
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }).max(5000, {
    message: "Prompt must not be longer than 5000 characters.",
  }),
  instruction: z.string().optional(),
  tags: z.string().min(1, {
    message: "At least one tag is required.",
  }),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

export default function SubmitPromptForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      prompt: '',
      instruction: '',
      tags: '',
      difficulty: 'Intermediate',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      console.log('Submitting prompt:', values);
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

      console.log("Prompt submitted successfully:", data);
      toast({
        title: "Prompt submitted successfully!",
        description: "Your prompt has been added to the database.",
      })
      form.reset();
    } catch (error) {
      console.error("Error submitting prompt:", error);
      toast({
        title: "Error submitting prompt",
        description: error instanceof Error ? error.message : "There was an error submitting your prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter prompt title" {...field} />
              </FormControl>
              <FormDescription>
                A concise title for your programming prompt.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your prompt"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of the programming prompt.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter additional instructions"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include any additional instructions or context for your prompt.
              </FormDescription>
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
                Add relevant tags to categorize your prompt (e.g., JavaScript, Algorithm, Web Development).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the difficulty level of your prompt.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Prompt'}
        </Button>
      </form>
    </Form>
  );
}