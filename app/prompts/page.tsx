import PromptGrid from '@/components/PromptGrid';

export default function PromptsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Prompts</h1>
      <PromptGrid />
    </div>
  );
}