import type { ConsultationRequest, AppNotification } from "../types";
import { FACULTY, formatDate, formatTime, getStatusClass } from "../data";

interface Props {
  requests: ConsultationRequest[];
  notifications: AppNotification[];
  onNav: (v: string) => void;
  userName: string;
  userId: string;
}


export default function StudentDashboard({ requests, notifications, onNav, userName, userId }: Props) {
  const myRequests = requests.filter(r => r.studentId === userId || r.studentName === userName);
  const pending = myRequests.filter(r => ["Pending","Waitlisted"].includes(r.status));
  const upcoming = myRequests.filter(r => ["Confirmed","Approved"].includes(r.status));
  const completed = myRequests.filter(r => r.status === "Completed");
  const unread = notifications.filter(n => !n.read).length;

  const today = new Date(2026, 8, 15);
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-slate-900 text-2xl">Good morning, {userName ? userName.split(' ')[0] : 'Student'}!</h1>
          <p className="text-slate-500 text-sm mt-1">Here's an overview of your consultations with Dr. Santos.</p>
          <div className="mt-3 inline-block px-3 py-1.5 rounded-md" style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.15)" }}>
            <p className="text-xs text-emerald-800 font-medium tracking-wide">
              <span className="font-bold text-emerald-700 mr-1">SYNAPSE:</span>
              Scheduling, Yield Negotiation, Adaptive Prioritization, and Slot Evaluation
            </p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-700">{dateStr}</p>
          <p className="text-xs text-slate-400 mt-0.5">BSCS 2A · AY 2026–2027</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pending Requests", value: pending.length, cls: "stat-card-yellow", iconColor: "#d97706", nav: "student-consultations", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
          { label: "Upcoming Sessions", value: upcoming.length, cls: "stat-card-blue", iconColor: "#3b82f6", nav: "student-consultations", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" },
          { label: "Completed Sessions", value: completed.length, cls: "stat-card-green", iconColor: "#10b981", nav: "student-consultations", icon: "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
          { label: "Unread Notifications", value: unread, cls: "stat-card-purple", iconColor: "#8b5cf6", nav: "student-notifications", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" },
        ].map(s => (
          <button key={s.label} onClick={() => onNav(s.nav)} className={`card p-4 text-left hover:shadow-md transition-all ${s.cls} cursor-pointer`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.7)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-3xl font-display text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-600 mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: My Requests */}
        <div className="lg:col-span-2 space-y-5">
          {/* Upcoming */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-slate-800">My Consultation Requests</h2>
              <button onClick={() => onNav("student-consultations")} className="text-xs text-blue-600 hover:text-blue-800 font-medium">View All →</button>
            </div>
            {myRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No consultation requests yet.</p>
                <button onClick={() => onNav("student-request")} className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">Request a consultation →</button>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 4).map(req => (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#f8faff", border: "1px solid #e2e8f0" }}>
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: req.status === "Completed" ? "#10b981" : req.status === "Pending" ? "#f59e0b" : "#3b82f6" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">{req.subject}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusClass(req.status)}`}>{req.status}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{req.concern}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        📅 {formatDate(req.preferredDate)} at {formatTime(req.preferredTime)} · {req.mode}
                      </div>
                      {req.facultyNotes && (
                        <div className="text-xs text-blue-600 mt-1 italic">Dr. Santos: "{req.facultyNotes}"</div>
                      )}
                      {req.alternativeDate && (
                        <div className="text-xs text-purple-600 mt-1">Alternative proposed: {formatDate(req.alternativeDate)} at {formatTime(req.alternativeTime!)}</div>
                      )}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: req.mode === "Online" ? "#dbeafe" : "#d1fae5", color: req.mode === "Online" ? "#1e40af" : "#065f46" }}>{req.mode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h2 className="font-heading text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "New Consultation Request", icon: "M12 5v14M5 12h14", nav: "student-request", color: "#1d4ed8", bg: "#dbeafe" },
                { label: "View My Consultations", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", nav: "student-consultations", color: "#059669", bg: "#d1fae5" },
                { label: "Messages with Faculty", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", nav: "student-messages", color: "#7c3aed", bg: "#ede9fe" },
              ].map(a => (
                <button key={a.label} onClick={() => onNav(a.nav)} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:shadow-md transition-all text-center" style={{ background: a.bg }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.7)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={a.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-medium" style={{ color: a.color }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Faculty info + notifications */}
        <div className="space-y-4">
          {/* Faculty card */}
          <div className="card p-5">
            <h3 className="font-heading text-slate-700 text-sm mb-4">My Faculty Adviser</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>MS</div>
              <div>
                <div className="font-heading text-slate-800">{FACULTY.name}</div>
                <div className="text-xs text-slate-400">{FACULTY.title}</div>
                <div className="text-xs text-slate-400">{FACULTY.email}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Available Consultation Slots</div>
              {[
                { day: "Monday", time: "8:00 AM – 11:00 AM" },
                { day: "Tuesday", time: "12:00 PM – 4:00 PM" },
                { day: "Thursday", time: "1:00 PM – 5:00 PM" },
              ].map(s => (
                <div key={s.day} className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">{s.day}</span>
                  <span className="text-slate-500">{s.time}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNav("student-request")} className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white text-center hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
              Request Consultation
            </button>
          </div>

          {/* Recent notifications */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-slate-700 text-sm">Recent Notifications</h3>
              <button onClick={() => onNav("student-notifications")} className="text-xs text-blue-600 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className={`flex items-start gap-2 ${!n.read ? "opacity-100" : "opacity-60"}`}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: !n.read ? "#1d4ed8" : "#e2e8f0" }} />
                  <div>
                    <div className="text-xs font-medium text-slate-700">{n.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{n.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip card */}
          <div className="card p-4" style={{ background: "linear-gradient(135deg, #1e40af, #0d9488)", color: "white" }}>
            <p className="text-xs font-semibold mb-1" style={{ opacity: 0.7 }}>💡 HELPFUL TIP</p>
            <p className="text-sm leading-relaxed">Include a clear description of your concern and your deadline when requesting a consultation. This helps the faculty prioritize your request.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
