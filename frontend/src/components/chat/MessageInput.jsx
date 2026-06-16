import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSend(text.trim());
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/10 bg-slate-950/80 p-4"
    >
      <div className="flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Type your message..."
          className="input-field"
        />

        <button
          disabled={disabled || !text.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;