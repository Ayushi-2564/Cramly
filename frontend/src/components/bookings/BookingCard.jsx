import {
  CalendarCheck,
  CheckCircle,
  Clock,
  IndianRupee,
  Link as LinkIcon,
  Loader2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
} from "../../services/bookingService";
import useAuthStore from "../../store/authStore";

const statusStyles = {
  pending: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",
  accepted: "border-green-400/20 bg-green-500/10 text-green-300",
  rejected: "border-red-400/20 bg-red-500/10 text-red-300",
  completed: "border-sky-400/20 bg-sky-500/10 text-sky-300",
  cancelled: "border-slate-400/20 bg-slate-500/10 text-slate-300",
};

const BookingCard = ({ booking, onRefresh }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const isTeacher = booking.teacher?._id === user?._id;
  const isStudent = booking.student?._id === user?._id;

  const dateText = new Date(booking.scheduledAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleAccept = async () => {
    try {
      setLoading(true);
      await acceptBooking(
        booking._id,
        meetingLink || "Meeting link will be shared soon"
      );
      toast.success("Booking accepted");
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept booking");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await rejectBooking(booking._id);
      toast.success("Booking rejected");
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject booking");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      await completeBooking(booking._id);
      toast.success("Booking completed");
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      await cancelBooking(booking._id);
      toast.success("Booking cancelled");
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="font-heading text-2xl font-bold">
            {booking.subject}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {isTeacher
              ? `Student: ${booking.student?.name}`
              : `Tutor: ${booking.teacher?.name}`}
          </p>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
            statusStyles[booking.status]
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-4">
          <CalendarCheck className="mb-2 text-violet-300" size={20} />
          <p className="text-sm text-slate-400">Scheduled at</p>
          <p className="mt-1 font-semibold">{dateText}</p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <Clock className="mb-2 text-sky-300" size={20} />
          <p className="text-sm text-slate-400">Duration</p>
          <p className="mt-1 font-semibold">{booking.durationMinutes} min</p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <IndianRupee className="mb-2 text-green-300" size={20} />
          <p className="text-sm text-slate-400">Price</p>
          <p className="mt-1 font-semibold">₹{booking.price}</p>
        </div>
      </div>

      {booking.message && (
        <div className="mt-4 rounded-2xl bg-white/5 p-4">
          <p className="text-sm text-slate-400">Message</p>
          <p className="mt-1 text-slate-200">{booking.message}</p>
        </div>
      )}

      {booking.meetingLink && (
        <div className="mt-4 rounded-2xl bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sky-300">
            <LinkIcon size={18} />
            <p className="font-semibold">Meeting Link</p>
          </div>
          <p className="mt-2 break-all text-sm text-slate-300">
            {booking.meetingLink}
          </p>
        </div>
      )}

      {isTeacher && booking.status === "pending" && (
        <div className="mt-5 space-y-3">
          <input
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="Optional meeting link"
            className="input-field"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500/20 px-4 py-3 font-semibold text-green-300 transition hover:bg-green-500/30 disabled:opacity-70"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Accept
            </button>

            <button
              onClick={handleReject}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-70"
            >
              <XCircle size={18} />
              Reject
            </button>
          </div>
        </div>
      )}

      {isTeacher && booking.status === "accepted" && (
        <button
          onClick={handleComplete}
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-sky-500/20 px-4 py-3 font-semibold text-sky-300 transition hover:bg-sky-500/30 disabled:opacity-70"
        >
          Mark Completed
        </button>
      )}

      {isStudent && ["pending", "accepted"].includes(booking.status) && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-70"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
};

export default BookingCard;