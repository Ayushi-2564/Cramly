import { useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  IndianRupee,
  Loader2,
  MessageSquare,
  Star,
  User,
  Video,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../services/paymentService";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import ReviewModal from "../reviews/ReviewModal";

const getUserId = (user) => {
  if (!user) return "";
  return user._id || user;
};

const getUserName = (user, fallback = "User") => {
  if (!user) return fallback;
  return user.name || fallback;
};

const formatDate = (date) => {
  if (!date) return "Not scheduled";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status) => {
  if (status === "accepted") {
    return "border-green-400/20 bg-green-500/10 text-green-300";
  }

  if (status === "rejected") {
    return "border-red-400/20 bg-red-500/10 text-red-300";
  }

  if (status === "cancelled") {
    return "border-red-400/20 bg-red-500/10 text-red-300";
  }

  if (status === "completed") {
    return "border-sky-400/20 bg-sky-500/10 text-sky-300";
  }

  return "border-yellow-400/20 bg-yellow-500/10 text-yellow-300";
};

const BookingCard = ({
  booking,
  currentUser,
  user,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const savedUser = JSON.parse(localStorage.getItem("cramlyUser") || "{}");
  const loggedInUser = currentUser || user || savedUser;

  const studentId = getUserId(booking?.student);
  const teacherId = getUserId(booking?.teacher);
  const loggedInUserId = getUserId(loggedInUser);

  const isStudent = String(loggedInUserId) === String(studentId);
  const isTeacher = String(loggedInUserId) === String(teacherId);

  const price = booking?.price || 0;
  const isPaid = booking?.paymentStatus === "paid";

  const handleAction = async (actionFunction, successMessage) => {
    if (!actionFunction) {
      toast.error("Action is not connected");
      return;
    }

    try {
      setLoading(true);
      await actionFunction(booking._id);
      toast.success(successMessage);

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Razorpay failed to load");
        return;
      }

      const data = await createPaymentOrder(booking._id);

      const options = {
        key: data.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Cramly",
        description: `${booking.subject} session payment`,
        order_id: data.order.id,

        handler: async (response) => {
          try {
            await verifyPayment({
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful");

            if (onRefresh) {
              onRefresh();
            }
          } catch (error) {
            toast.error(
              error.response?.data?.message || "Payment verification failed"
            );
          }
        },

        prefill: {
          name: loggedInUser?.name || "",
          email: loggedInUser?.email || "",
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h3 className="font-heading text-2xl font-bold text-white">
              {booking.subject}
            </h3>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                booking.status
              )}`}
            >
              {booking.status}
            </span>
          </div>

          <p className="text-sm text-slate-400">
            {booking.message || "No message added"}
          </p>
        </div>

        {isPaid ? (
          <span className="rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300">
            Paid
          </span>
        ) : (
          <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300">
            Unpaid
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <User size={16} />
            Student
          </div>

          <p className="font-semibold text-white">
            {getUserName(booking.student, "Student")}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <User size={16} />
            Teacher
          </div>

          <p className="font-semibold text-white">
            {getUserName(booking.teacher, "Teacher")}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays size={16} />
            Date
          </div>

          <p className="font-semibold text-white">
            {formatDate(booking.scheduledAt)}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Clock size={16} />
            Time
          </div>

          <p className="font-semibold text-white">
            {formatTime(booking.scheduledAt)}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <IndianRupee size={16} />
            Price
          </div>

          <p className="font-semibold text-white">
            {price > 0 ? `₹${price}` : "Free"}
          </p>
        </div>
      </div>

      {booking.meetingLink && (
        <a
          href={booking.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-sky-500/10 px-4 py-3 font-semibold text-sky-300 transition hover:bg-sky-500/20"
        >
          <Video size={18} />
          Join Meeting
        </a>
      )}

      {isStudent &&
        !isPaid &&
        price > 0 &&
        !["rejected", "cancelled", "completed"].includes(booking.status) && (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CreditCard size={18} />
            )}
            Pay ₹{price}
          </button>
        )}

      {isPaid && (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 font-semibold text-green-300">
          <CheckCircle size={18} />
          Payment Completed
        </div>
      )}

      {isStudent && booking.status === "completed" && (
        <button
          onClick={() => setShowReviewModal(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500/10 px-4 py-3 font-semibold text-yellow-300 transition hover:bg-yellow-500/20"
        >
          <Star size={18} />
          Give Review
        </button>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {isTeacher && booking.status === "pending" && (
          <>
            <button
              onClick={() =>
                handleAction(onAccept, "Booking accepted successfully")
              }
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500/10 px-4 py-3 font-semibold text-green-300 transition hover:bg-green-500/20 disabled:opacity-70"
            >
              <CheckCircle size={18} />
              Accept
            </button>

            <button
              onClick={() =>
                handleAction(onReject, "Booking rejected successfully")
              }
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-70"
            >
              <XCircle size={18} />
              Reject
            </button>
          </>
        )}

        {isTeacher && booking.status === "accepted" && (
          <button
            onClick={() =>
              handleAction(onComplete, "Booking completed successfully")
            }
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-500/10 px-4 py-3 font-semibold text-sky-300 transition hover:bg-sky-500/20 disabled:opacity-70"
          >
            <CheckCircle size={18} />
            Mark Completed
          </button>
        )}

        {isStudent &&
          !["completed", "cancelled", "rejected"].includes(booking.status) && (
            <button
              onClick={() =>
                handleAction(onCancel, "Booking cancelled successfully")
              }
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-70"
            >
              <XCircle size={18} />
              Cancel
            </button>
          )}
      </div>

      {booking.createdAt && (
        <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
          <MessageSquare size={14} />
          Requested on {formatDate(booking.createdAt)}
        </div>
      )}

      {showReviewModal && (
        <ReviewModal
          booking={booking}
          onClose={() => setShowReviewModal(false)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};

export default BookingCard;