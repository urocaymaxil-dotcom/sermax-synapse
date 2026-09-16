import { useState } from "react";
import type { ScheduleEvent } from "../types";
import { formatTime } from "../data";

interface Props {
  schedule: ScheduleEvent[];
  onAddEvent?: (event: Omit<ScheduleEvent, "id">) => void;
  onEditEvent?: (id: string, updated: Partial<ScheduleEvent>) => void;
  onDeleteEvent?: (id: string) => void;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM – 6 PM

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToPx(min: number, startHour = 7, pxPerHour = 60) {
  return ((min - startHour * 60) / 60) * pxPerHour;
}

const EVENT_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  class: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af", label: "Class" },
  meeting: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e", label: "Meeting" },
  blocked: { bg: "#f1f5f9", border: "#94a3b8", text: "#475569", label: "Blocked" },
  consultation: { bg: "#d1fae5", border: "#10b981", text: "#065f46", label: "Consultation" },
  availability: { bg: "#ede9fe", border: "#8b5cf6", text: "#5b21b6", label: "Available" },
};

export default function FacultySchedule({ schedule, onAddEvent, onEditEvent, onDeleteEvent }: Props) {
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "class" as const,
    days: ["Monday"],
    startTime: "09:00",
    endTime: "10:30",
    recurring: true,
  });
  const PX_PER_HOUR = 72;

  const daysToShow = viewMode === "week" ? WEEKDAYS : [selectedDay];

  const eventsForDay = (day: string) =>
    schedule.filter((e) => e.days.includes(day));

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-slate-900">My Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">Academic Year 2026–2027, First Semester</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Add Event Button */}
          {onAddEvent && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewEvent({
                  title: "",
                  type: "class",
                  days: ["Monday"],
                  startTime: "09:00",
                  endTime: "10:30",
                  recurring: true,
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Event
            </button>
          )}

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--theme-border)" }}>
            {(["week", "day"] as const).map((m) => (
              <button key={m} onClick={() => setViewMode(m)} className={`text-sm px-4 py-2 font-medium transition-all ${viewMode === m ? "bg-blue-600 text-white" : "bg-[var(--theme-bg-surface)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-base)]"}`}>
                {m === "week" ? "Week" : "Day"}
              </button>
            ))}
          </div>

          {/* Day selector for day view */}
          {viewMode === "day" && (
            <select className="text-sm rounded-lg px-3 py-2 bg-[var(--theme-bg-surface)] text-[var(--theme-text-main)]" style={{ border: "1px solid var(--theme-border)" }} value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
              {WEEKDAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {Object.entries(EVENT_COLORS).map(([type, c]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: c.bg, border: `2px solid ${c.border}` }} />
            <span className="text-xs text-slate-500">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="card overflow-hidden">
        {/* Day headers */}
        <div className="flex border-b border-slate-100">
          <div style={{ width: 60, flexShrink: 0 }} />
          {daysToShow.map((day) => (
            <div key={day} className="flex-1 text-center py-3" style={{ borderLeft: "1px solid #f1f5f9" }}>
              <div className="font-heading text-sm text-slate-700">{day}</div>
              {day === "Monday" && (
                <div className="text-xs text-blue-600 font-medium">Today</div>
              )}
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex overflow-y-auto" style={{ maxHeight: 520 }}>
          {/* Time labels */}
          <div style={{ width: 60, flexShrink: 0 }}>
            {HOURS.map(h => (
              <div key={h} style={{ height: PX_PER_HOUR }} className="flex items-start pt-1 px-2">
                <span className="text-xs text-slate-400">
                  {h === 12 ? "12 PM" : h > 12 ? `${h-12} PM` : `${h} AM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {daysToShow.map((day) => {
            const dayEvents = eventsForDay(day);
            return (
              <div key={day} className="flex-1 relative" style={{ borderLeft: "1px solid #f1f5f9" }}>
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div key={h} style={{ height: PX_PER_HOUR, borderTop: "1px solid #f8faff" }} className={h % 2 === 0 ? "bg-slate-50/30" : ""} />
                ))}

                {/* Events */}
                {dayEvents.map((ev) => {
                  const startMin = timeToMinutes(ev.startTime);
                  const endMin = timeToMinutes(ev.endTime);
                  const top = minutesToPx(startMin, 7, PX_PER_HOUR);
                  const height = ((endMin - startMin) / 60) * PX_PER_HOUR;
                  const colors = EVENT_COLORS[ev.type] || EVENT_COLORS.blocked;

                  return (
                    <div
                      key={ev.id}
                      className="absolute inset-x-1 rounded overflow-hidden text-xs"
                      style={{
                        top,
                        height: Math.max(height, 24),
                        background: colors.bg,
                        borderLeft: `3px solid ${colors.border}`,
                        color: colors.text,
                        padding: "3px 5px",
                        zIndex: 1,
                        cursor: onEditEvent ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (onEditEvent) {
                          setEditingId(ev.id);
                          setNewEvent({
                            title: ev.title,
                            type: ev.type as any,
                            days: [...ev.days],
                            startTime: ev.startTime,
                            endTime: ev.endTime,
                            recurring: ev.recurring,
                          });
                          setShowAddModal(true);
                        }
                      }}
                    >
                      <div className="font-semibold truncate leading-tight">{ev.title}</div>
                      {height >= 36 && (
                        <div className="opacity-70 truncate" style={{ fontSize: 10 }}>
                          {formatTime(ev.startTime)} – {formatTime(ev.endTime)}
                          {ev.location && ` · ${ev.location}`}
                          {ev.mode && ` · ${ev.mode}`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event list summary */}
      <div className="mt-6">
        <h2 className="font-heading text-slate-800 mb-3 text-base">
          {viewMode === "week" ? "All This Week" : `${selectedDay}'s Events`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {schedule
            .filter(e => viewMode === "week" || e.days.includes(selectedDay))
            .map(ev => {
              const colors = EVENT_COLORS[ev.type] || EVENT_COLORS.blocked;
              return (
                <div key={ev.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-1 rounded-full mt-1 self-stretch" style={{ background: colors.border, minWidth: 3 }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-slate-800 text-sm">{ev.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>{colors.label}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {ev.days.join(", ")} · {formatTime(ev.startTime)} – {formatTime(ev.endTime)}
                        {ev.recurring && " (Recurring)"}
                      </div>
                      {ev.location && <div className="text-xs text-slate-400">📍 {ev.location}</div>}
                      {ev.mode && <div className="text-xs text-slate-400">💻 {ev.mode}</div>}
                      {ev.studentName && <div className="text-xs text-slate-500">👤 {ev.studentName} ({ev.section})</div>}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div className="card p-6 w-full max-w-md" style={{ background: "var(--theme-bg-surface)" }}>
            <h2 className="font-heading text-lg text-[var(--theme-text-main)] mb-4">{editingId ? "Edit Event" : "Add Schedule Event"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--theme-text-muted)] mb-1 block">Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg px-3 py-2 text-sm bg-[var(--theme-bg-base)] text-[var(--theme-text-main)]"
                  style={{ border: "1px solid var(--theme-border)" }}
                  value={newEvent.title}
                  onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--theme-text-muted)] mb-1 block">Type</label>
                  <select
                    className="w-full rounded-lg px-3 py-2 text-sm bg-[var(--theme-bg-base)] text-[var(--theme-text-main)]"
                    style={{ border: "1px solid var(--theme-border)" }}
                    value={newEvent.type}
                    onChange={e => setNewEvent(p => ({ ...p, type: e.target.value as any }))}
                  >
                    <option value="class">Class</option>
                    <option value="meeting">Meeting</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--theme-text-muted)] mb-1 block">Day</label>
                  <select
                    className="w-full rounded-lg px-3 py-2 text-sm bg-[var(--theme-bg-base)] text-[var(--theme-text-main)]"
                    style={{ border: "1px solid var(--theme-border)" }}
                    value={newEvent.days[0]}
                    onChange={e => setNewEvent(p => ({ ...p, days: [e.target.value] }))}
                  >
                    {WEEKDAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--theme-text-muted)] mb-1 block">Start Time</label>
                  <input
                    type="time"
                    className="w-full rounded-lg px-3 py-2 text-sm bg-[var(--theme-bg-base)] text-[var(--theme-text-main)]"
                    style={{ border: "1px solid var(--theme-border)" }}
                    value={newEvent.startTime}
                    onChange={e => setNewEvent(p => ({ ...p, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--theme-text-muted)] mb-1 block">End Time</label>
                  <input
                    type="time"
                    className="w-full rounded-lg px-3 py-2 text-sm bg-[var(--theme-bg-base)] text-[var(--theme-text-main)]"
                    style={{ border: "1px solid var(--theme-border)" }}
                    value={newEvent.endTime}
                    onChange={e => setNewEvent(p => ({ ...p, endTime: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-[var(--theme-border)] mt-4">
                {editingId && onDeleteEvent ? (
                  <button onClick={() => { onDeleteEvent(editingId); setShowAddModal(false); }} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">Delete</button>
                ) : <div />}
                <div className="flex gap-3">
                  <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-base)] rounded-lg transition-colors">Cancel</button>
                  <button
                    onClick={() => {
                      if (editingId && onEditEvent && newEvent.title && newEvent.startTime && newEvent.endTime) {
                        onEditEvent(editingId, newEvent as any);
                        setShowAddModal(false);
                      } else if (!editingId && onAddEvent && newEvent.title && newEvent.startTime && newEvent.endTime) {
                        onAddEvent(newEvent as any);
                        setShowAddModal(false);
                      }
                    }}
                    disabled={!newEvent.title || !newEvent.startTime || !newEvent.endTime}
                    className="px-5 py-2 text-sm text-white rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}
                  >
                    {editingId ? "Save Changes" : "Save Event"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
