'use client'

import { useState } from 'react'
import { Search, Filter, TrendingUp, Clock, ThumbsUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for prompts
const mockPrompts = [
  { id: 1, title: "Create a React Hook for API Calls", language: "JavaScript", framework: "React", difficulty: "Intermediate", upvotes: 120, author: { name: "Jane Doe", avatar: "/placeholder.svg?height=40&width=40" } },
  { id: 2, title: "Build a RESTful API with Express", language: "JavaScript", framework: "Express", difficulty: "Beginner", upvotes: 85, author: { name: "John Smith", avatar: "/placeholder.svg?height=40&width=40" } },
  { id: 3, title: "Implement a Binary Search Tree in Python", language: "Python", framework: "None", difficulty: "Advanced", upvotes: 200, author: { name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" } },
  { id: 4, title: "Create a Responsive Grid Layout with Tailwind CSS", language: "CSS", framework: "Tailwind", difficulty: "Beginner", upvotes: 150, author: { name: "Bob Brown", avatar: "/placeholder.svg?height=40&width=40" } },
]

export default function PromptGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [language, setLanguage] = useState("")
  const [framework, setFramework] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Prompt List</h1>
      
      {/* Search and Filters */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
          <Input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow text-sm sm:text-base"
          />
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="text-sm sm:text-base">
            <Filter className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Filters
          </Button>
        </div>
        {showFilters && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Select value={language} onValueChange={setLanguage}>
              <option value="">All Languages</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="CSS">CSS</option>
            </Select>
            <Select value={framework} onValueChange={setFramework}>
              <option value="">All Frameworks</option>
              <option value="React">React</option>
              <option value="Express">Express</option>
              <option value="Tailwind">Tailwind</option>
            </Select>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <option value="">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Select>
          </div>
        )}
      </div>

      {/* Trending and Latest Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 w-5 h-5 sm:w-6 sm:h-6" /> Trending Prompts
          </h2>
          <div className="space-y-4">
            {mockPrompts.slice(0, 3).map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2 w-5 h-5 sm:w-6 sm:h-6" /> Latest Prompts
          </h2>
          <div className="space-y-4">
            {mockPrompts.slice(3).map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function PromptCard({ prompt }: { prompt: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{prompt.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge className="text-xs sm:text-sm">{prompt.language}</Badge>
          <Badge variant="outline" className="text-xs sm:text-sm">{prompt.framework}</Badge>
          <Badge variant="secondary" className="text-xs sm:text-sm">{prompt.difficulty}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
            <AvatarImage src={prompt.author.avatar} alt={prompt.author.name} />
            <AvatarFallback>{prompt.author.name.split(' ').map((n: any) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="text-xs sm:text-sm text-gray-500">{prompt.author.name}</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
          <ThumbsUp className="w-4 h-4 mr-1" />
          {prompt.upvotes}
        </Button>
      </CardFooter>
    </Card>
  )
}