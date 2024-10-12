import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth');
  }

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