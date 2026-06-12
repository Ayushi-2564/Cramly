import EmptyState from "../components/ui/EmptyState";

const AiTools = () => {
  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">AI Study Tools</h1>
      <p className="mt-3 text-slate-400">
        Generate summaries, roadmaps, questions, quizzes and flashcards.
      </p>

      <div className="mt-8">
        <EmptyState
          title="AI tools coming soon"
          description="We will connect Gemini/OpenAI APIs in the AI phase."
        />
      </div>
    </div>
  );
};

export default AiTools;