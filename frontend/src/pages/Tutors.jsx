import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import EmptyState from "../components/ui/EmptyState";
import TutorCard from "../components/tutors/TutorCard";
import TutorFilters from "../components/tutors/TutorFilters";
import TutorProfileModal from "../components/tutors/TutorProfileModal";
import BecomeTutorModal from "../components/tutors/BecomeTutorModal";
import { getTutors } from "../services/tutorService";
import BookingRequestModal from "../components/bookings/BookingRequestModal";
const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showBecomeTutor, setShowBecomeTutor] = useState(false);
const [bookingTutor, setBookingTutor] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    subject: "All",
    maxPrice: "",
  });

  const fetchTutors = async () => {
    try {
      setLoading(true);

      const params = {
        search: filters.search,
        subject: filters.subject,
        maxPrice: filters.maxPrice,
      };

      const data = await getTutors(params);
      setTutors(data.tutors || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tutors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
            Marketplace
          </p>

          <h1 className="mt-3 font-heading text-4xl font-bold">
            Tutor Marketplace
          </h1>

          <p className="mt-3 text-slate-400">
            Search exam-focused tutors and book last-minute doubt sessions.
          </p>
        </div>

        <button
          onClick={() => setShowBecomeTutor(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Become a Tutor
        </button>
      </div>

      <TutorFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchTutors}
      />

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="glass h-72 animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : tutors.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tutors.map((tutor) => (
              <TutorCard
                key={tutor._id}
                tutor={tutor}
                onView={setSelectedTutor}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tutors found"
            description="Try changing your search filters or create your own tutor profile."
          />
        )}
      </div>

      {selectedTutor && (
  <TutorProfileModal
    tutor={selectedTutor}
    onClose={() => setSelectedTutor(null)}
    onRequestSession={(tutor) => {
      setSelectedTutor(null);
      setBookingTutor(tutor);
    }}
  />
)}

{bookingTutor && (
  <BookingRequestModal
    tutor={bookingTutor}
    onClose={() => setBookingTutor(null)}
  />
)}

      {showBecomeTutor && (
        <BecomeTutorModal
          onClose={() => setShowBecomeTutor(false)}
          onSuccess={fetchTutors}
        />
      )}
    </div>
  );
};

export default Tutors;