import { useState } from "react";
import { Loader2, Star, X } from "lucide-react";
import toast from "react-hot-toast";

import { createReview } from "../../services/reviewService";

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setLoading(true);

      await createReview({
        bookingId: booking._id,
        rating,
        comment,
      });

      toast.success("Review submitted successfully");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="glass w-full max-w-lg rounded-3xl p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-violet-300">
              Session Review
            </p>

            <h2 className="mt-2 font-heading text-3xl font-bold text-white">
              Rate your session
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Share your feedback for this completed session.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5 rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-slate-400">Subject</p>
            <p className="mt-1 font-semibold text-white">
              {booking?.subject || "Session"}
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-3 block text-sm font-semibold text-slate-300">
              Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition hover:scale-110"
                >
                  <Star
                    size={34}
                    className={
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-500"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Comment
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              placeholder="Example: Very helpful session. Explained DBMS clearly."
              className="input-field"
            />
          </div>

          <button
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;