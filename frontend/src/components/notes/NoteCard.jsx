import {
  Download,
  FileText,
  IndianRupee,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import { deleteNote, downloadNote } from "../../services/noteService";
import useAuthStore from "../../store/authStore";

const NoteCard = ({ note, onRefresh }) => {
  const { user } = useAuthStore();

  const isOwner = note.uploader?._id === user?._id;

  const handleDownload = async () => {
    try {
      const data = await downloadNote(note._id);

      window.open(data.fileUrl, "_blank");

      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this note?");

    if (!confirmDelete) return;

    try {
      await deleteNote(note._id);
      toast.success("Note deleted successfully");
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const sizeInMb = (note.fileSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="glass rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-violet-500/20 p-3 text-violet-300">
          <FileText size={26} />
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize text-slate-300">
          {note.type?.replace("-", " ")}
        </span>
      </div>

      <h3 className="line-clamp-2 font-heading text-xl font-bold">
        {note.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
        {note.description || "No description added."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
          {note.subject}
        </span>

        {note.semester && (
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
            Sem {note.semester}
          </span>
        )}

        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
          {sizeInMb} MB
        </span>
      </div>

      {note.tags?.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Tag size={14} />
          <span className="line-clamp-1">{note.tags.join(", ")}</span>
        </div>
      )}

      <div className="mt-5 rounded-2xl bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <User size={15} />
          <span>{note.uploader?.name || "Unknown uploader"}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <IndianRupee size={15} className="text-green-300" />
            <span>{note.isFree ? "Free" : note.price}</span>
          </div>

          <p className="text-sm text-slate-400">
            {note.downloads} downloads
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={handleDownload}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-105"
        >
          <Download size={16} />
          Download
        </button>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;