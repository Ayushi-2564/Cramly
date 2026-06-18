import { Copy } from "lucide-react";
import toast from "react-hot-toast";

const AiResultBox = ({ result }) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard");
  };

  if (!result) {
    return (
      <div className="glass flex min-h-[360px] items-center justify-center rounded-3xl p-8 text-center">
        <div>
          <h3 className="font-heading text-2xl font-bold">
            AI output will appear here
          </h3>
          <p className="mt-3 text-slate-400">
            Choose a tool, fill details, and generate study content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold">Generated Result</h2>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
        >
          <Copy size={16} />
          Copy
        </button>
      </div>

      <pre className="max-h-[620px] overflow-y-auto whitespace-pre-wrap rounded-2xl bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
        {result}
      </pre>
    </div>
  );
};

export default AiResultBox;