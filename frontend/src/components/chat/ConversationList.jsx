const ConversationList = ({
  conversations,
  selectedConversation,
  onSelect,
  currentUserId,
  onlineUsers,
}) => {
  const getOtherUser = (conversation) => {
    return conversation.participants?.find(
      (participant) => participant._id !== currentUserId
    );
  };

  return (
    <div className="glass h-full rounded-3xl p-4">
      <h2 className="font-heading text-2xl font-bold">Chats</h2>

      <div className="mt-5 space-y-3">
        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-400">
            No conversations yet. Start chat from tutor profile.
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation);
            const isActive = selectedConversation?._id === conversation._id;
            const isOnline = onlineUsers.includes(otherUser?._id);

            return (
              <button
                key={conversation._id}
                onClick={() => onSelect(conversation)}
                className={`w-full rounded-2xl p-4 text-left transition ${
                  isActive
                    ? "bg-violet-500/20"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 font-bold">
                    {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}

                    {isOnline && (
                      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {otherUser?.name || "User"}
                    </p>

                    <p className="truncate text-sm text-slate-400">
                      {conversation.lastMessageText || "Start conversation"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;