const AiToolCard = ({ tool, activeTool, onSelect }) => {
  const Icon = tool.icon;
  const isActive = activeTool === tool.id;

  return (
    <button
      onClick={() => onSelect(tool.id)}
      className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 ${
        isActive
          ? "border-violet-400/40 bg-violet-500/20"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
        <Icon size={24} />
      </div>

      <h3 className="font-heading text-xl font-bold">{tool.title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {tool.description}
      </p>
    </button>
  );
};

export default AiToolCard;