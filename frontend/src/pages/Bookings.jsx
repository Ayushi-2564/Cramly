import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import EmptyState from "../components/ui/EmptyState";
import BookingCard from "../components/bookings/BookingCard";
import { getMyBookings } from "../services/bookingService";

const tabs = ["all", "pending", "accepted", "completed", "rejected", "cancelled"];

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data.bookings || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeTab);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
          Sessions
        </p>

        <h1 className="mt-3 font-heading text-4xl font-bold">
          Session Bookings
        </h1>

        <p className="mt-3 text-slate-400">
          Manage pending requests, accepted sessions and completed learning
          sessions.
        </p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold capitalize transition ${
              activeTab === tab
                ? "bg-violet-500/20 text-violet-200"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-5">
          {[1, 2].map((item) => (
            <div key={item} className="glass h-64 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid gap-5">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onRefresh={fetchBookings}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No bookings found"
          description="Book a tutor session from the tutor marketplace. Teacher requests will also appear here."
        />
      )}
    </div>
  );
};

export default Bookings;