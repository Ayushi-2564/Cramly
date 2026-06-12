import EmptyState from "../components/ui/EmptyState";

const Tutors = () => {
  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Tutor Marketplace</h1>
      <p className="mt-3 text-slate-400">
        Search and filter tutors by subject, rating and price.
      </p>

      <div className="mt-8">
        <EmptyState
          title="Tutor marketplace coming next"
          description="In the next phase, we will add tutor cards, search, filters and tutor profile pages."
        />
      </div>
    </div>
  );
};

export default Tutors;