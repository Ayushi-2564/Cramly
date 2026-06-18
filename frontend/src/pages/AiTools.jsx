import { useState } from "react";
import {
  Brain,
  CalendarDays,
  FileQuestion,
  HelpCircle,
  Layers,
  Loader2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import AiToolCard from "../components/ai/AiToolCard";
import AiResultBox from "../components/ai/AiResultBox";
import { generateStudyContent } from "../services/aiService";

const tools = [
  {
    id: "roadmap",
    title: "Study Roadmap",
    description: "Create a last-minute study plan based on your exam deadline.",
    icon: CalendarDays,
  },
  {
    id: "questions",
    title: "Important Questions",
    description: "Generate probable short, long and viva questions.",
    icon: FileQuestion,
  },
  {
    id: "explain",
    title: "Explain Topic",
    description: "Understand any topic in simple beginner-friendly language.",
    icon: Brain,
  },
  {
    id: "quiz",
    title: "Quiz Generator",
    description: "Create MCQ practice quiz with answers and explanations.",
    icon: HelpCircle,
  },
  {
    id: "flashcards",
    title: "Flashcards",
    description: "Generate quick revision flashcards for active recall.",
    icon: Layers,
  },
];

const AiTools = () => {
  const [activeTool, setActiveTool] = useState("roadmap");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    examDate: "",
    notesText: "",
  });

  const activeToolInfo = tools.find((tool) => tool.id === activeTool);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!formData.subject && !formData.topic && !formData.notesText) {
      toast.error("Please enter subject, topic or notes");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const data = await generateStudyContent({
        type: activeTool,
        subject: formData.subject,
        topic: formData.topic,
        examDate: formData.examDate,
        notesText: formData.notesText,
      });

      setResult(data.result);
      toast.success("AI content generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
          Cramly AI
        </p>

        <h1 className="mt-3 font-heading text-4xl font-bold">
          AI Study Tools
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Generate roadmaps, important questions, explanations, quizzes and
          flashcards for last-minute exam preparation.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {tools.map((tool) => (
          <AiToolCard
            key={tool.id}
            tool={tool}
            activeTool={activeTool}
            onSelect={(id) => {
              setActiveTool(id);
              setResult("");
            }}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleGenerate} className="glass rounded-3xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
              {activeToolInfo && <activeToolInfo.icon size={24} />}
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold">
                {activeToolInfo?.title}
              </h2>
              <p className="text-sm text-slate-400">
                Fill details and generate output.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject: DBMS, DSA, OS..."
              className="input-field"
            />

            <input
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Example: I have DBMS exam in 3 days"
              className="input-field"
            />

            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              className="input-field"
            />

            <textarea
              name="notesText"
              value={formData.notesText}
              onChange={handleChange}
              rows="7"
              placeholder="Paste notes text, syllabus or important topics..."
              className="input-field"
            />

            <button
              disabled={loading}
              className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Sparkles size={18} />
              )}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>

        <AiResultBox result={result} />
      </div>
    </div>
  );
};

export default AiTools;