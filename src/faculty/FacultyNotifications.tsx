import type { AppNotification } from "../types";
import { formatTimestamp } from "../data";

interface Props {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const NOTIF_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
  request: { icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", bg: "#dbeafe", color: "#1d4ed8" },
  approval: { icon: "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", bg: "#d1fae5", color: "#059669" },
  decline: { icon: "M10 14l2-2m0 0 2-2m-2 2-2-2m2 2 2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", bg: "#fee2e2", color: "#dc2626" },
  info: { icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", bg: "#fff7ed", color: "#d97706" },
  alternative: { icon: "M8 7h12m0 0-4-4m4 4-4 4M4 17h12m0 0-4-4m4 4-4 4", bg: "#fdf4ff", color: "#7e22ce" },
  reminder: { icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0", bg: "#fef3c7", color: "#d97706" },
  reschedule: { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15", bg: "#fff7ed", color: "#9a3412" },
  system: { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z", bg: "#f1f5f9", color: "#475569" },
};

export default function FacultyNotifications({ notifications, onMarkRead, onMarkAllRead }: Props) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
        {unread > 0 && (
          <button onClick={onMarkAllRead} className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">Mark all as read</button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-slate-300 text-5xl mb-3">🔔</div>
            <p className="text-slate-500">No notifications</p>
          </div>
        ) : (
          notifications.map(n => {
            const config = NOTIF_ICONS[n.type] || NOTIF_ICONS.system;
            return (
              <div key={n.id} className={`card p-4 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer ${!n.read ? "border-l-4" : ""}`} style={{ borderLeftColor: !n.read ? "#1d4ed8" : "transparent" }} onClick={() => onMarkRead(n.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: config.bg }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={config.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-semibold ${!n.read ? "text-slate-900" : "text-slate-600"}`}>{n.title}</span>
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatTimestamp(n.timestamp)}</span>
                  </div>
                  <p className={`text-sm mt-0.5 leading-relaxed ${!n.read ? "text-slate-700" : "text-slate-500"}`}>{n.message}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: "#1d4ed8" }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
