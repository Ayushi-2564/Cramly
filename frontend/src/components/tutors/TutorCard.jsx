import { Star, Clock, IndianRupee, ArrowRight } from "lucide-react";

const TutorCard = ({ tutor, onView }) => {
  return (
    <div className="glass rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 text-xl font-bold">
          {tutor?.user?.name?.charAt(0)?.toUpperCase() || "T"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-heading text-xl font-bold">
            {tutor?.user?.name || "Tutor"}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-400">
            {tutor.headline}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tutor.subjects?.slice(0, 3).map((subject) => (
          <span
            key={subject}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
          >
            {subject}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-white/5 p-3">
          <div className="flex items-center gap-1 text-yellow-300">
            <Star size={15} fill="currentColor" />
            <span>{tutor.rating || "0.0"}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Rating</p>
        </div>

        <div className="rounded-2xl bg-white/5 p-3">
          <div className="flex items-center gap-1 text-sky-300">
            <IndianRupee size={15} />
            <span>{tutor.pricePerHour}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Per hour</p>
        </div>

        <div className="rounded-2xl bg-white/5 p-3">
          <div className="flex items-center gap-1 text-violet-300">
            <Clock size={15} />
            <span>{tutor.experienceYears}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Years</p>
        </div>
      </div>

      <button
        onClick={() => onView(tutor)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500/20"
      >
        View Profile
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default TutorCard;