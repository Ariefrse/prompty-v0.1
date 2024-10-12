import SubmitPromptForm from '@/components/SubmitPromptForm';

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Submit a Prompt</h1>
      <SubmitPromptForm />
    </div>
  );
}