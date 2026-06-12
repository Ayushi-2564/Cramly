import EmptyState from "../components/ui/EmptyState";

const Chat = () => {
  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Realtime Chat</h1>
      <p className="mt-3 text-slate-400">
        Chat instantly with tutors and students using Socket.IO.
      </p>

      <div className="mt-8">
        <EmptyState
          title="No conversations yet"
          description="Realtime chat will be added with Socket.IO in an upcoming phase."
        />
      </div>
    </div>
  );
};

export default Chat;