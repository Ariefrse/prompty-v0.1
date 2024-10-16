import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Prompty</h1>
      <p className="text-xl mb-8">
        Discover, share, and contribute to programming prompts, code snippets, and project ideas.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/prompts">Explore Prompts</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/submit">Submit a Prompt</Link>
        </Button>
      </div>
    </div>
  );
}
