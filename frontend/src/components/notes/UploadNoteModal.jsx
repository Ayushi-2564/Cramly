import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

import { uploadNote } from "../../services/noteService";

const UploadNoteModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    semester: "",
    type: "notes",
    tags: "",
    price: 0,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.subject || !formData.file) {
      toast.error("Please add title, subject and file");
      return;
    }

    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("subject", formData.subject);
    payload.append("semester", formData.semester);
    payload.append("type", formData.type);
    payload.append("tags", formData.tags);
    payload.append("price", formData.price);
    payload.append("file", formData.file);

    try {
      setLoading(true);
      await uploadNote(payload);
      toast.success("Note uploaded successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
              <Upload />
            </div>

            <h2 className="font-heading text-2xl font-bold">Upload Notes</h2>

            <p className="mt-1 text-sm text-slate-400">
              Upload notes, PDFs, PYQs or important topics.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl bg-white/5 p-2 transition hover:bg-white/10"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: DBMS Unit 1 Notes"
            className="input-field"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description..."
            rows="3"
            className="input-field"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject: DBMS"
              className="input-field"
            />

            <input
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="Semester: 5"
              className="input-field"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field bg-slate-900"
            >
              <option value="notes">Notes</option>
              <option value="pyq">PYQ</option>
              <option value="important-topics">Important Topics</option>
              <option value="assignment">Assignment</option>
              <option value="other">Other</option>
            </select>

            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price, 0 for free"
              className="input-field"
            />
          </div>

          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags comma separated: dbms, sql, normalization"
            className="input-field"
          />

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Upload file
            </label>

            <input
              name="file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleChange}
              className="input-field"
            />

            <p className="mt-2 text-xs text-slate-500">
              Allowed: PDF, PNG, JPG, JPEG. Max size: 10MB.
            </p>
          </div>

          <button
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Uploading..." : "Upload Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNoteModal;