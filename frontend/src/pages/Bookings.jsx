import EmptyState from "../components/ui/EmptyState";

const Bookings = () => {
  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Session Bookings</h1>
      <p className="mt-3 text-slate-400">
        Manage session requests, accepted bookings and meeting links.
      </p>

      <div className="mt-8">
        <EmptyState
          title="No bookings yet"
          description="Session booking will be added after tutor marketplace is ready."
        />
      </div>
    </div>
  );
};

export default Bookings;