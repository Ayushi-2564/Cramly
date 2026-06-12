import { Sparkles } from "lucide-react";

const EmptyState = ({
  title = "Nothing here yet",
  description = "This section will be filled once you start using Cramly.",
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-violet-300">
        <Sparkles size={22} />
      </div>

      <h3 className="font-heading text-xl font-bold text-white">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;