import { useState } from "react";
import { X, Loader2, CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";

import { createBooking } from "../../services/bookingService";

const BookingRequestModal = ({ tutor, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: tutor?.subjects?.[0] || "",
    scheduledAt: "",
    durationMinutes: 60,
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.scheduledAt) {
      toast.error("Please select subject and session time");
      return;
    }

    const selectedDate = new Date(formData.scheduledAt);

    if (selectedDate < new Date()) {
      toast.error("Please choose a future date and time");
      return;
    }

    const payload = {
      tutorId: tutor._id,
      subject: formData.subject,
      scheduledAt: selectedDate.toISOString(),
      durationMinutes: Number(formData.durationMinutes),
      message: formData.message,
    };

    try {
      setLoading(true);
      await createBooking(payload);
      toast.success("Booking request sent successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!tutor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="glass max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
              <CalendarCheck />
            </div>

            <h2 className="font-heading text-2xl font-bold">
              Request Session
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Send a booking request to {tutor?.user?.name}.
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
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Subject
            </label>

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input-field bg-slate-900"
            >
              {tutor.subjects?.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Date and time
            </label>

            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Duration
            </label>

            <select
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              className="input-field bg-slate-900"
            >
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Message for tutor
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell tutor what topics you need help with..."
              className="input-field"
            />
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-slate-400">Estimated price</p>
            <p className="mt-1 font-heading text-2xl font-bold">
              ₹
              {Math.round(
                (Number(tutor.pricePerHour || 0) *
                  Number(formData.durationMinutes)) /
                  60
              )}
            </p>
          </div>

          <button
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Sending request..." : "Send Booking Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestModal;