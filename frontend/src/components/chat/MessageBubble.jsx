const MessageBubble = ({ message, currentUserId }) => {
  const isOwn =
    message.sender?._id === currentUserId || message.sender === currentUserId;

  const time = new Date(message.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-3xl px-4 py-3 ${
          isOwn
            ? "bg-gradient-to-r from-violet-600 to-sky-500 text-white"
            : "bg-white/10 text-slate-100"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.text}
        </p>

        <p
          className={`mt-1 text-right text-[11px] ${
            isOwn ? "text-white/70" : "text-slate-500"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;