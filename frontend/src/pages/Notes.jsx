import EmptyState from "../components/ui/EmptyState";

const Notes = () => {
  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Notes & PYQs</h1>
      <p className="mt-3 text-slate-400">
        Upload, preview, download and search exam-focused notes.
      </p>

      <div className="mt-8">
        <EmptyState
          title="No notes uploaded yet"
          description="PDF upload and notes marketplace will be added in a later phase."
        />
      </div>
    </div>
  );
};

export default Notes;