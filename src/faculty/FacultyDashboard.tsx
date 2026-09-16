import { useState } from "react";
import type { ConsultationRequest, AppNotification } from "../types";
import { TODAYS_EVENTS, UPCOMING_DEADLINES, QUOTES, formatTime, formatDate, getStatusClass } from "../data";

interface Props {
  requests: ConsultationRequest[];
  notifications: AppNotification[];
  onNav: (v: string) => void;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  userName: string;
  userId: string;
}


function MiniCalendar() {
  const today = new Date(2026, 8, 15); // Sep 15, 2026
  const [current, setCurrent] = useState({ year: 2026, month: 8 });

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const eventDays = [15, 17, 18, 19, 20, 22, 24];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d: number | null) =>
    d !== null && d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  const hasEvent = (d: number | null) => d !== null && eventDays.includes(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrent(c => ({ ...c, month: c.month === 0 ? 11 : c.month - 1 }))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span className="text-sm font-semibold text-slate-700">{months[current.month]} {current.year}</span>
        <button onClick={() => setCurrent(c => ({ ...c, month: c.month === 11 ? 0 : c.month + 1 }))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0 mb-1">
        {days.map(d => <div key={d} className="text-center text-xs text-slate-400 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center py-0.5">
            <div
              className={`calendar-day relative text-xs ${isToday(d) ? "today" : d ? "text-slate-600" : ""} ${hasEvent(d) && !isToday(d) ? "font-semibold text-blue-600" : ""}`}
            >
              {d}
              {hasEvent(d) && !isToday(d) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FacultyDashboard({ requests, notifications, onNav, onApprove, onDecline, userName, userId }: Props) {
  const myRequests = requests.filter(r => r.facultyId === userId || r.facultyName === userName);
  const pending = myRequests.filter(r => r.status === "Pending");
  const upcoming = myRequests.filter(r => ["Confirmed", "Approved"].includes(r.status));
  const waitlisted = myRequests.filter(r => r.status === "Waitlisted");
  const availabilityBlocks = 12;

  const recentPending = pending.slice(0, 3);
  const unreadNotif = notifications.filter(n => !n.read).length;
  const quote = QUOTES[0];

  const today = new Date(2026, 8, 15);
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-slate-900 text-2xl">Good morning, {userName}!</h1>
          <p className="text-slate-500 text-sm mt-1">Here's an overview of your consultations and requests for today.</p>
          <div className="mt-3 inline-block px-3 py-1.5 rounded-md" style={{ background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.15)" }}>
            <p className="text-xs text-blue-800 font-medium tracking-wide">
              <span className="font-bold text-blue-700 mr-1">SYNAPSE:</span>
              Scheduling, Yield Negotiation, Adaptive Prioritization, and Slot Evaluation
            </p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-700">{dateStr}</p>
          <p className="text-xs text-slate-400 italic mt-0.5">"Small conversations make a big difference."</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Upcoming Consultations", value: upcoming.length || 5, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z", cls: "stat-card-blue", iconColor: "#3b82f6", nav: "faculty-schedule" },
          { label: "Pending Requests", value: pending.length || 3, icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", cls: "stat-card-green", iconColor: "#10b981", nav: "faculty-requests" },
          { label: "Waitlisted Students", value: waitlisted.length || 1, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", cls: "stat-card-red", iconColor: "#ef4444", nav: "faculty-requests" },
          { label: "Availability Blocks", value: availabilityBlocks, icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", cls: "stat-card-purple", iconColor: "#8b5cf6", nav: "faculty-availability" },
        ].map((s) => (
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
        {/* Left: Today's Schedule + Recent Requests */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Today's Schedule */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                </svg>
                <h2 className="font-heading text-slate-800">Today's Schedule</h2>
              </div>
              <button onClick={() => onNav("faculty-schedule")} className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">View Full Schedule →</button>
            </div>

            <div className="space-y-2">
              {TODAYS_EVENTS.map((ev, i) => (
                <div key={i} className={`flex gap-4 items-start rounded-lg p-3 ${ev.type === "blocked" ? "event-blocked" : "event-consultation"}`}>
                  <div className="text-right flex-shrink-0" style={{ minWidth: 72 }}>
                    <div className="text-xs font-semibold text-slate-700">{ev.time}</div>
                    <div className="text-xs text-slate-400">{ev.endTime}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: ev.type === "blocked" ? "#94a3b8" : "#10b981" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-500 mb-0.5">{ev.label}</div>
                    <div className="text-sm font-medium text-slate-800 truncate">{ev.student}</div>
                    {ev.topic && <div className="text-xs text-slate-500 truncate">{ev.topic}</div>}
                  </div>
                  {ev.mode && (
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium" style={{
                      background: ev.mode === "Online" ? "#dbeafe" : "#d1fae5",
                      color: ev.mode === "Online" ? "#1e40af" : "#065f46"
                    }}>{ev.mode}</span>
                  )}
                  <button className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-white/60 transition-colors text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Kanban Board for Requests */}
          <div className="card p-5" style={{ background: "var(--theme-bg-surface)", borderColor: "var(--theme-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <h2 className="font-heading text-[var(--theme-text-main)] text-lg">Consultation Pipeline</h2>
              </div>
              <button onClick={() => onNav("faculty-requests")} className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">View All →</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {[
                { title: "Pending", items: requests.filter(r => r.status === "Pending"), bg: "linear-gradient(135deg, #fef3c7, #fde68a)", color: "#92400e" },
                { title: "Approved", items: requests.filter(r => r.status === "Approved"), bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)", color: "#065f46" },
                { title: "Waitlisted", items: requests.filter(r => r.status === "Waitlisted"), bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#5b21b6" },
              ].map(col => (
                <div key={col.title} className="flex-1 min-w-[280px] snap-center rounded-xl p-3" style={{ background: "var(--theme-bg-base)", border: "1px solid var(--theme-border)" }}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-heading text-sm text-[var(--theme-text-main)]">{col.title}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: col.bg, color: col.color }}>{col.items.length}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {col.items.map(req => (
                      <div key={req.id} className="p-3 rounded-lg shadow-sm transition-transform hover:-translate-y-0.5" style={{ background: "var(--theme-bg-surface)", border: "1px solid var(--theme-border)" }}>
                        <div className="text-sm font-bold text-[var(--theme-text-main)] mb-1">{req.studentName}</div>
                        <div className="text-xs text-[var(--theme-text-muted)] mb-3">{req.subject}</div>
                        <div className="flex items-center gap-2 text-xs text-[var(--theme-text-muted)] mb-3 bg-[var(--theme-bg-base)] p-1.5 rounded">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {formatDate(req.preferredDate)} • {formatTime(req.preferredTime)}
                        </div>
                        {col.title === "Pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => onApprove(req.id)} className="flex-1 text-xs py-1.5 rounded font-medium text-white transition-all hover:opacity-90" style={{ background: "#10b981" }}>Approve</button>
                            <button onClick={() => onDecline(req.id)} className="flex-1 text-xs py-1.5 rounded font-medium transition-all hover:bg-red-500/10" style={{ border: "1px solid #ef4444", color: "#ef4444" }}>Decline</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {col.items.length === 0 && (
                      <div className="text-center text-xs text-[var(--theme-text-muted)] py-4 border-2 border-dashed border-[var(--theme-border)] rounded-lg">
                        No {col.title.toLowerCase()} requests
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Calendar + Deadlines + Quote */}
        <div className="flex flex-col gap-4">
          {/* Calendar */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <h3 className="font-heading text-slate-800 text-sm">Calendar Overview</h3>
            </div>
            <MiniCalendar />
          </div>

          {/* Upcoming Deadlines */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                <h3 className="font-heading text-slate-800 text-sm">Upcoming Deadlines</h3>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {UPCOMING_DEADLINES.map((d) => (
                <div key={d.title} className="flex items-start gap-3">
                  <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ height: 36, background: d.color === "red" ? "#ef4444" : d.color === "yellow" ? "#f59e0b" : "#3b82f6" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 leading-tight">{d.title}</div>
                    <div className="text-xs text-slate-400">{d.date}</div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{
                    background: d.color === "red" ? "#fee2e2" : d.color === "yellow" ? "#fef3c7" : "#dbeafe",
                    color: d.color === "red" ? "#dc2626" : d.color === "yellow" ? "#d97706" : "#2563eb"
                  }}>{d.daysLeft} days left</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="card p-5" style={{ background: "linear-gradient(135deg, #1e40af, #0d9488)", color: "white" }}>
            <div className="text-2xl mb-3" style={{ opacity: 0.7, fontFamily: "Georgia, serif" }}>"</div>
            <p className="text-sm leading-relaxed italic" style={{ opacity: 0.95 }}>{quote.text}</p>
            <p className="text-xs mt-3" style={{ opacity: 0.6 }}>— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Upload Schedule Section */}
      <div className="mt-6 card p-6 border-dashed border-2 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderColor: "#cbd5e1", background: "#f8fafc" }}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            </div>
            <h2 className="font-heading text-slate-800 text-lg">Upload Your Schedule</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-xl">Upload your official teaching schedule as a PDF or image. The system will automatically parse and integrate your classes into SYNAPSE.</p>
        </div>
        <div className="w-full md:w-auto">
          <label className="flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-all shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
             Browse Files
             <input type="file" className="hidden" accept=".pdf,image/*" />
          </label>
        </div>
      </div>
    </div>
  );
}
