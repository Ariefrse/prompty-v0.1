'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Search, Filter, TrendingUp, Clock, ThumbsUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import Link from 'next/link'


// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const filterSchema = z.object({
  searchTerm: z.string(),

  model: z.string(),
  framework: z.string(),
  difficulty: z.string(),
})

const models = [
  { value: "", label: "All Models" },
  { value: "gpt3", label: "GPT-3" },
  { value: "gpt4", label: "GPT-4" },
  { value: "dalle", label: "DALL-E" },
  { value: "stable-diffusion", label: "Stable Diffusion" },
  { value: "midjourney", label: "Midjourney" },
]

const frameworks = [
  { value: "", label: "All Frameworks" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "nextjs", label: "Next.js" },
  { value: "express", label: "Express" },
  { value: "django", label: "Django" },
  { value: "flask", label: "Flask" },
  { value: "none", label: "None" },
]

const difficultyLevels = [
  { value: "", label: "All Difficulties" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

// Define the Prompt type
type Prompt = {
  id: string; // or number, depending on your data structure
  title: string;
  description: string;
  model: string;
  framework: string;
  difficulty: string;
  profile: {
    username: string;
    avatar: string;
  };
  upvotes: number;
}

export default function PromptGrid() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      searchTerm: '',
      model: '',        
      framework: '',
      difficulty: '',
    },
  })

  const handleAIPromptGenerated = (generatedPrompt: string) => {
    // Here you can decide how to handle the generated prompt
    // For example, you could add it to the list of prompts or
    // pre-fill a form for the user to edit before submitting
    console.log('Generated prompt:', generatedPrompt)
    toast({
      title: "AI Prompt Generated",
      description: "A new prompt has been generated. You can now edit and submit it.",
    })
    // TODO: Implement logic to add the generated prompt to your app's state or UI
  }

  async function onSubmit(values: z.infer<typeof filterSchema>) {
    setLoading(true)
    try {
      let query = supabase
        .from('prompts')
        .select('*')

      if (values.searchTerm) {
        query = query.ilike('title', `%${values.searchTerm}%`)
      }
      if (values.model) {
        query = query.eq('model', values.model)
      }
      if (values.framework) {
        query = query.eq('framework', values.framework)
      }
      if (values.difficulty) {
        query = query.eq('difficulty', values.difficulty)
      }

      const { data, error } = await query

      if (error) throw error

      setPrompts(data)
    } catch (error) {
      console.error('Error fetching prompts:', error)
      toast({
        title: "Error fetching prompts",
        description: "There was an error fetching the prompts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onSubmit(form.getValues())
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Prompt List</h1>
      
      

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 sm:mb-8 space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Search prompts..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="text-sm sm:text-base">
              <Filter className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Filters
            </Button>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {models.map((model) => (
                          <option key={model.value} value={model.value}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="framework"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Framework</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {frameworks.map((framework) => (
                          <option key={framework.value} value={framework.value}>
                            {framework.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {difficultyLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
          )}
          <Button type="submit" className="">
            Apply Filters
          </Button>
        </form>
      </Form>

      {loading ? (
        <div className="text-center">Loading prompts...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} setPrompts={setPrompts} />
          ))}
        </div>
      )}
    </div>
  )
}

function PromptCard({ prompt, setPrompts }: { prompt: Prompt; setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>> }) {
  // New function to handle upvote
  const handleUpvote = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .update({ upvotes: prompt.upvotes + 1 }) // Increment the upvote count
        .eq('id', prompt.id) // Ensure we update the correct prompt
        .select();

      if (error) throw error;

      // Update the prompt state with the new upvote count
      setPrompts((prevPrompt: Prompt[]) =>
        prevPrompt.map((p: Prompt ) =>
          p.id === prompt.id ? { ...p, upvotes: data[0].upvotes } : p
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

  return (
    <Link href={`/prompts/${prompt.id}`} passHref>
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{prompt.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{prompt.description}</p>
        </CardContent>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className="text-xs sm:text-sm">{prompt.model}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">{prompt.framework}</Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">{prompt.difficulty}</Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarImage src={prompt.profile?.avatar} alt={prompt.profile?.username} />
              <AvatarFallback>{prompt.profile?.username.split(' ').map((n: any) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-xs sm:text-sm text-gray-500">{prompt.profile?.username}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs sm:text-sm" onClick={(e) => {
            e.preventDefault(); // Prevent the default button behavior
            e.stopPropagation(); // Prevent the click event from bubbling up to the Link
            handleUpvote(); // Call the upvote function
          }}>
            <ThumbsUp className="w-4 h-4 mr-1" />
            {prompt.upvotes}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
