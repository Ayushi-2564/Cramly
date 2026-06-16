import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({
  selectedConversation,
  messages,
  currentUserId,
  onSend,
  onlineUsers,
}) => {
  const bottomRef = useRef(null);

  const otherUser = selectedConversation?.participants?.find(
    (participant) => participant._id !== currentUserId
  );

  const isOnline = onlineUsers.includes(otherUser?._id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedConversation) {
    return (
      <div className="glass flex h-[72vh] items-center justify-center rounded-3xl p-8 text-center">
        <div>
          <h2 className="font-heading text-3xl font-bold">
            Select a conversation
          </h2>
          <p className="mt-3 text-slate-400">
            Choose a chat from the left panel or start chat from tutor profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass flex h-[72vh] flex-col overflow-hidden rounded-3xl">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 font-bold">
            {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}

            {isOnline && (
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />
            )}
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold">
              {otherUser?.name || "User"}
            </h2>

            <p className="text-sm text-slate-400">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-slate-400">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSend} />
    </div>
  );
};

export default ChatWindow;