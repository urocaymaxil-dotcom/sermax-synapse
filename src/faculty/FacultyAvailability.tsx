import { useState } from "react";
import type { AvailabilitySlot, ScheduleEvent } from "../types";
import { formatTime } from "../data";

interface Props {
  availability: AvailabilitySlot[];
  schedule: ScheduleEvent[];
  onAdd: (slot: Omit<AvailabilitySlot, "id">) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM – 6 PM
const PX_PER_HOUR = 72;

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToPx(min: number, startHour = 7, pxPerHour = 60) {
  return ((min - startHour * 60) / 60) * pxPerHour;
}

function checkOverlap(slotStartMin: number, slotEndMin: number, day: string, schedule: ScheduleEvent[], blocked: AvailabilitySlot[]) {
  const daySchedule = schedule.filter(e => e.days.includes(day));
  for (const ev of daySchedule) {
    const evStart = timeToMinutes(ev.startTime);
    const evEnd = timeToMinutes(ev.endTime);
    if (slotStartMin < evEnd && slotEndMin > evStart) return true;
  }
  const dayBlocked = blocked.filter(a => a.day === day && a.type === "blocked");
  for (const b of dayBlocked) {
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);
    if (slotStartMin < bEnd && slotEndMin > bStart) return true;
  }
  return false;
}

export default function FacultyAvailability({ availability, schedule, onAdd, onDelete, onToggle }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ day: "Monday", startTime: "12:00", endTime: "13:00", type: "blocked" as "available" | "blocked", note: "" });

  const handleAdd = () => {
    if (form.startTime >= form.endTime) return;
    onAdd(form);
    setShowForm(false);
    setForm({ day: "Monday", startTime: "12:00", endTime: "13:00", type: "blocked", note: "" });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-slate-900">Availability Exceptions</h1>
          <p className="text-slate-500 text-sm mt-1">
            By default, all time from 7:00 AM to 8:30 PM outside your classes is considered <strong>available</strong>. 
            Click a green block below, or use the button, to <strong>block off</strong> specific times.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Block Custom Time
        </button>
      </div>

      {/* Add slot form */}
      {showForm && (
        <div className="card p-5 mb-6" style={{ border: "2px solid #fee2e2" }}>
          <h3 className="font-heading text-slate-800 mb-4">Add Blocked Exception</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Day</label>
              <select className="w-full rounded-lg px-3 py-2 text-sm bg-white text-slate-700" style={{ border: "1px solid #e2e8f0" }} value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
                {WEEKDAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Start Time</label>
              <input type="time" className="w-full rounded-lg px-3 py-2 text-sm bg-white" style={{ border: "1px solid #e2e8f0" }} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">End Time</label>
              <input type="time" className="w-full rounded-lg px-3 py-2 text-sm bg-white" style={{ border: "1px solid #e2e8f0" }} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Note (optional)</label>
              <input type="text" placeholder="e.g., Department work..." className="w-full rounded-lg px-3 py-2 text-sm bg-white" style={{ border: "1px solid #e2e8f0" }} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm text-white rounded-lg font-medium transition-all hover:opacity-90 bg-red-600">Add Blocked Time</button>
          </div>
        </div>
      )}

      {/* Weekly grid */}
      <div className="card overflow-hidden" style={{ background: "var(--theme-bg-base)", border: "1px solid var(--theme-border)" }}>
        {/* Day headers */}
        <div className="flex border-b border-[var(--theme-border)]">
          <div style={{ width: 50, flexShrink: 0 }} />
          {WEEKDAYS.map((day) => (
            <div key={day} className="flex-1 text-center py-2" style={{ borderLeft: "1px solid var(--theme-border)" }}>
              <div className="font-heading text-xs text-[var(--theme-text-main)]">{day.substring(0,3)}</div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex overflow-y-auto" style={{ maxHeight: 500 }}>
          {/* Time labels */}
          <div style={{ width: 50, flexShrink: 0 }}>
            {HOURS.map(h => (
              <div key={h} style={{ height: PX_PER_HOUR }} className="flex items-start pt-1 px-1">
                <span className="text-[10px] text-[var(--theme-text-muted)]">
                  {h === 12 ? "12pm" : h > 12 ? `${h-12}pm` : `${h}am`}
                </span>
              </div>
            ))}
            {[19, 20].map(h => (
              <div key={h} style={{ height: PX_PER_HOUR }} className="flex items-start pt-1 px-1">
                <span className="text-[10px] text-[var(--theme-text-muted)]">
                  {h > 12 ? `${h-12}pm` : `${h}am`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {WEEKDAYS.map((day) => {
            const dayEvents = schedule.filter(e => e.days.includes(day));
            const dayBlocked = availability.filter(s => s.day === day && s.type === "blocked");
            
            // Generate available chunks
            const generatedChunks = [];
            for(let m = 420; m < 1230; m += 30) {
              if (!checkOverlap(m, m + 30, day, schedule, availability)) {
                 generatedChunks.push({
                    id: `slot-${day}-${m}`,
                    startTime: `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`,
                    endTime: `${String(Math.floor((m+30)/60)).padStart(2,'0')}:${String((m+30)%60).padStart(2,'0')}`,
                    startMin: m,
                    endMin: m + 30
                 });
              }
            }

            return (
              <div key={day} className="flex-1 relative" style={{ borderLeft: "1px solid var(--theme-border)" }}>
                {HOURS.concat([19, 20]).map(h => (
                  <div key={h} style={{ height: PX_PER_HOUR, borderTop: "1px solid var(--theme-border)", opacity: 0.5 }} className={h % 2 === 0 ? "bg-slate-50/10" : ""} />
                ))}

                {/* Render unclickable schedule events */}
                {dayEvents.map((ev) => {
                  const startMin = timeToMinutes(ev.startTime);
                  const endMin = timeToMinutes(ev.endTime);
                  const top = minutesToPx(startMin, 7, PX_PER_HOUR);
                  const height = ((endMin - startMin) / 60) * PX_PER_HOUR;
                  
                  return (
                    <div
                      key={ev.id}
                      className="absolute inset-x-1 rounded overflow-hidden text-[9px] pointer-events-none"
                      style={{
                        top,
                        height: Math.max(height, 20),
                        background: "var(--theme-bg-surface)",
                        border: "1px solid var(--theme-border)",
                        color: "var(--theme-text-muted)",
                        padding: "2px 4px",
                        zIndex: 1,
                        opacity: 0.6
                      }}
                    >
                      <div className="font-semibold truncate">{ev.title}</div>
                    </div>
                  );
                })}

                {/* Render clickable blocked exceptions (Click to UNBLOCK) */}
                {dayBlocked.map((b) => {
                  const startMin = timeToMinutes(b.startTime);
                  const endMin = timeToMinutes(b.endTime);
                  const top = minutesToPx(startMin, 7, PX_PER_HOUR);
                  const height = ((endMin - startMin) / 60) * PX_PER_HOUR;
                  return (
                    <button
                      key={b.id}
                      onClick={() => onDelete(b.id)}
                      className="absolute inset-x-1 rounded overflow-hidden text-[9px] hover:opacity-80 transition-opacity flex flex-col items-center justify-center group"
                      title="Click to Unblock"
                      style={{
                        top,
                        height: Math.max(height, 20),
                        background: "rgba(220, 38, 38, 0.1)",
                        border: "1px solid rgba(220, 38, 38, 0.3)",
                        color: "rgba(220, 38, 38, 0.8)",
                        padding: "2px 4px",
                        zIndex: 2,
                      }}
                    >
                      <div className="group-hover:hidden">Blocked</div>
                      <div className="hidden group-hover:block font-bold">Unblock</div>
                    </button>
                  );
                })}

                {/* Render clickable availability blocks (Click to BLOCK) */}
                {generatedChunks.map((slot) => {
                  const top = minutesToPx(slot.startMin, 7, PX_PER_HOUR);
                  const height = ((slot.endMin - slot.startMin) / 60) * PX_PER_HOUR;
                  
                  return (
                    <button
                      key={slot.id}
                      onClick={() => onAdd({ day, startTime: slot.startTime, endTime: slot.endTime, type: "blocked", note: "" })}
                      className="absolute inset-x-0.5 rounded overflow-hidden text-[10px] text-left transition-all hover:bg-red-500 hover:border-red-600 hover:text-white group"
                      title="Click to Block"
                      style={{
                        top,
                        height: Math.max(height, 24),
                        background: "#10b981",
                        color: "white",
                        border: "1px solid #34d399",
                        padding: "2px 4px",
                        zIndex: 1,
                      }}
                    >
                      <div className="font-bold truncate group-hover:hidden">{formatTime(slot.startTime)}</div>
                      <div className="hidden group-hover:block text-center mt-1">Block</div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
