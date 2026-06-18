import { useEffect, useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import BookingCard from "../components/bookings/BookingCard";
import {
  acceptBooking,
  cancelBooking,
  completeBooking,
  getMyBookings,
  rejectBooking,
} from "../services/bookingService";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("cramlyUser") || "{}");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const data = await getMyBookings();

      setBookings(data.bookings || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAcceptBooking = async (bookingId) => {
    await acceptBooking(bookingId, {
      meetingLink: "https://meet.google.com/demo-cramly-session",
    });

    await fetchBookings();
  };

  const handleRejectBooking = async (bookingId) => {
    await rejectBooking(bookingId);
    await fetchBookings();
  };

  const handleCompleteBooking = async (bookingId) => {
    await completeBooking(bookingId);
    await fetchBookings();
  };

  const handleCancelBooking = async (bookingId) => {
    await cancelBooking(bookingId);
    await fetchBookings();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-violet-300" size={34} />
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
          Sessions
        </p>

        <h1 className="mt-3 font-heading text-4xl font-bold">
          My Bookings
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Track your requested sessions, accepted sessions, payments and
          completed classes.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass flex min-h-[350px] items-center justify-center rounded-3xl p-8 text-center">
          <div>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-500/20 text-violet-300">
              <CalendarCheck size={30} />
            </div>

            <h2 className="font-heading text-3xl font-bold">
              No bookings found
            </h2>

            <p className="mt-3 text-slate-400">
              Book a tutor session to see it here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              currentUser={currentUser}
              onAccept={handleAcceptBooking}
              onReject={handleRejectBooking}
              onComplete={handleCompleteBooking}
              onCancel={handleCancelBooking}
              onRefresh={fetchBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;