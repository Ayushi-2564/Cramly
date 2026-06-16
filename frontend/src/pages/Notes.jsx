import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import EmptyState from "../components/ui/EmptyState";
import NoteCard from "../components/notes/NoteCard";
import NoteFilters from "../components/notes/NoteFilters";
import UploadNoteModal from "../components/notes/UploadNoteModal";

import { getNotes } from "../services/noteService";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    subject: "All",
    type: "All",
  });

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const params = {
        search: filters.search,
        subject: filters.subject,
        type: filters.type,
      };

      const data = await getNotes(params);
      setNotes(data.notes || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="pt-4">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
            Marketplace
          </p>

          <h1 className="mt-3 font-heading text-4xl font-bold">
            Notes & PYQs
          </h1>

          <p className="mt-3 text-slate-400">
            Upload, download and search exam-focused notes, PDFs and PYQs.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Upload Notes
        </button>
      </div>

      <NoteFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchNotes}
      />

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="glass h-80 animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onRefresh={fetchNotes} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No notes found"
            description="Upload your first notes or try changing filters."
          />
        )}
      </div>

      {showUploadModal && (
        <UploadNoteModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={fetchNotes}
        />
      )}
    </div>
  );
};

export default Notes;