import { X, Star, IndianRupee, Clock, CalendarCheck } from "lucide-react";
const TutorProfileModal = ({ tutor, onClose, onRequestSession }) => {
  if (!tutor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-sky-500 text-2xl font-bold">
              {tutor?.user?.name?.charAt(0)?.toUpperCase() || "T"}
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold">
                {tutor?.user?.name}
              </h2>
              <p className="text-sm text-slate-400">{tutor?.user?.university}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl bg-white/5 p-2 transition hover:bg-white/10"
          >
            <X />
          </button>
        </div>

        <h3 className="font-heading text-xl font-bold">{tutor.headline}</h3>

        <p className="mt-3 leading-7 text-slate-300">{tutor.bio}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {tutor.subjects?.map((subject) => (
            <span
              key={subject}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              {subject}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <Star className="mb-2 text-yellow-300" />
            <p className="font-bold">{tutor.rating || "0.0"}</p>
            <p className="text-xs text-slate-500">Rating</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <IndianRupee className="mb-2 text-sky-300" />
            <p className="font-bold">₹{tutor.pricePerHour}</p>
            <p className="text-xs text-slate-500">Per hour</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <Clock className="mb-2 text-violet-300" />
            <p className="font-bold">{tutor.experienceYears} year</p>
            <p className="text-xs text-slate-500">Experience</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <CalendarCheck className="mb-2 text-green-300" />
            <p className="font-bold">Open</p>
            <p className="text-xs text-slate-500">Booking</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-slate-400">Availability</p>
          <p className="mt-1 font-semibold">{tutor.availability}</p>
        </div>

       <button
  onClick={() => onRequestSession(tutor)}
  className="btn-primary mt-6 w-full"
>
  Request Session
</button>
      </div>
    </div>
  );
};

export default TutorProfileModal;