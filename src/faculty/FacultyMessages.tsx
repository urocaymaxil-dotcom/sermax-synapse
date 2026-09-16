import { useState } from "react";
import type { Conversation, ChatMessage } from "../types";
import { formatTimestamp } from "../data";

interface Props {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSend: (convId: string, message: string) => void;
}

export default function FacultyMessages({ conversations, selectedId, onSelect, onSend }: Props) {
  const [draft, setDraft] = useState("");
  const selected = conversations.find(c => c.id === selectedId);

  const handleSend = () => {
    if (!draft.trim() || !selectedId) return;
    onSend(selectedId, draft.trim());
    setDraft("");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-slate-900">Messages</h1>
        <p className="text-slate-500 text-sm mt-1">Communication within consultation requests</p>
      </div>

      <div className="card overflow-hidden" style={{ height: 600, display: "flex" }}>
        {/* Conversation list */}
        <div className="flex flex-col" style={{ width: 280, borderRight: "1px solid #f1f5f9", flexShrink: 0 }}>
          <div className="p-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "#f8faff", border: "1px solid #e2e8f0" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input className="bg-transparent text-sm flex-1" style={{ border: "none", outline: "none" }} placeholder="Search..." />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.map(conv => (
              <button key={conv.id} onClick={() => onSelect(conv.id)} className={`w-full text-left p-4 transition-all ${selectedId === conv.id ? "bg-blue-50" : "hover:bg-slate-50"}`} style={{ borderBottom: "1px solid #f8fafc" }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
                    {conv.participantName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <span className={`text-sm font-semibold truncate ${selectedId === conv.id ? "text-blue-700" : "text-slate-800"}`}>{conv.participantName}</span>
                      {conv.unread > 0 && <span className="badge ml-1 flex-shrink-0">{conv.unread}</span>}
                    </div>
                    {conv.participantSection && <div className="text-xs text-slate-400">{conv.participantSection}</div>}
                    <div className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{formatTimestamp(conv.lastTimestamp)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {selected ? (
          <div className="flex flex-col flex-1 min-w-0">
            {/* Header */}
            <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
                {selected.participantName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="font-display font-semibold text-slate-800 text-sm">{selected.participantName}</div>
                <div className="text-xs text-slate-400">{selected.subject}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selected.messages.map((msg: ChatMessage) => {
                const isMe = msg.senderId === "f1";
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 self-end" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
                        {msg.senderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    )}
                    <div className="max-w-xs lg:max-w-md">
                      <div className={`rounded-2xl px-4 py-2.5 text-sm ${isMe ? "text-white rounded-br-sm" : "text-slate-800 rounded-bl-sm"}`} style={{ background: isMe ? "linear-gradient(135deg, #1d4ed8, #2563eb)" : "white", border: isMe ? "none" : "1px solid #e2e8f0" }}>
                        {msg.content}
                      </div>
                      <div className={`text-xs text-slate-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>{formatTimestamp(msg.timestamp)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4" style={{ borderTop: "1px solid #f1f5f9" }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-800"
                  style={{ border: "1px solid #e2e8f0", outline: "none" }}
                  placeholder="Type a message..."
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                />
                <button onClick={handleSend} disabled={!draft.trim()} className="w-10 h-10 flex items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4 20-7z M22 2l-11 11"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-30">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="text-sm">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
