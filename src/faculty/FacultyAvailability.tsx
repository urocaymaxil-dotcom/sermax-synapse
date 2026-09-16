import { useState } from "react";
import type { AvailabilitySlot } from "../types";
import { formatTime } from "../data";

interface Props {
  availability: AvailabilitySlot[];
  onAdd: (slot: Omit<AvailabilitySlot, "id">) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function FacultyAvailability({ availability, onAdd, onDelete, onToggle }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ day: "Monday", startTime: "08:00", endTime: "10:00", type: "available" as "available" | "blocked", note: "" });

  const byDay = DAYS.reduce((acc, d) => {
    acc[d] = availability.filter(a => a.day === d);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const totalAvail = availability.filter(a => a.type === "available").reduce((sum, a) => {
    const start = parseInt(a.startTime.split(":")[0]) * 60 + parseInt(a.startTime.split(":")[1]);
    const end = parseInt(a.endTime.split(":")[0]) * 60 + parseInt(a.endTime.split(":")[1]);
    return sum + (end - start);
  }, 0);

  const handleAdd = () => {
    if (form.startTime >= form.endTime) return;
    onAdd(form);
    setShowForm(false);
    setForm({ day: "Monday", startTime: "08:00", endTime: "10:00", type: "available", note: "" });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Availability Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Define when you are available for student consultations. Unoccupied calendar time is <em>not</em> automatically considered available.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Slot
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Available Slots", value: availability.filter(a => a.type === "available").length, color: "#059669", bg: "#d1fae5" },
          { label: "Blocked Periods", value: availability.filter(a => a.type === "blocked").length, color: "#dc2626", bg: "#fee2e2" },
          { label: "Available Hours/Week", value: `${Math.floor(totalAvail/60)}h ${totalAvail%60}m`, color: "#1d4ed8", bg: "#dbeafe" },
          { label: "Active Days", value: DAYS.filter(d => byDay[d]?.some(s => s.type === "available")).length, color: "#7c3aed", bg: "#ede9fe" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl font-display font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add slot form */}
      {showForm && (
        <div className="card p-5 mb-6" style={{ border: "2px solid #dbeafe" }}>
          <h3 className="font-display font-semibold text-slate-800 mb-4">Add Availability Slot</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Day</label>
              <select className="w-full rounded-lg px-3 py-2 text-sm bg-white text-slate-700" style={{ border: "1px solid #e2e8f0" }} value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
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
              <label className="text-xs text-slate-500 font-medium mb-1 block">Type</label>
              <select className="w-full rounded-lg px-3 py-2 text-sm bg-white text-slate-700" style={{ border: "1px solid #e2e8f0" }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "available" | "blocked" }))}>
                <option value="available">Available</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs text-slate-500 font-medium mb-1 block">Note (optional)</label>
            <input type="text" placeholder="e.g., Office hours, Department work..." className="w-full rounded-lg px-3 py-2 text-sm bg-white" style={{ border: "1px solid #e2e8f0" }} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm text-white rounded-lg font-medium transition-all hover:opacity-90" style={{ background: "#1d4ed8" }}>Add Slot</button>
          </div>
        </div>
      )}

      {/* Weekly grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS.map(day => (
          <div key={day} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-slate-700">{day}</h3>
              <span className="text-xs text-slate-400">{byDay[day]?.length || 0} slot{byDay[day]?.length !== 1 ? "s" : ""}</span>
            </div>

            {(!byDay[day] || byDay[day].length === 0) ? (
              <div className="text-xs text-slate-300 text-center py-4 rounded-lg" style={{ border: "2px dashed #e2e8f0" }}>
                No slots defined
              </div>
            ) : (
              <div className="space-y-2">
                {byDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime)).map(slot => (
                  <div key={slot.id} className="flex items-center gap-2 rounded-lg p-2.5" style={{
                    background: slot.type === "available" ? "#f0fdf4" : "#f8fafc",
                    border: `1px solid ${slot.type === "available" ? "#bbf7d0" : "#e2e8f0"}`
                  }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: slot.type === "available" ? "#10b981" : "#94a3b8" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700">
                        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                      </div>
                      {slot.note && <div className="text-xs text-slate-400 truncate">{slot.note}</div>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onToggle(slot.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/80 transition-colors text-slate-400" title="Toggle type">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
                        </svg>
                      </button>
                      <button onClick={() => onDelete(slot.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 transition-colors text-slate-300 hover:text-red-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="mt-6 rounded-xl p-4 flex gap-3" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <p className="text-sm text-orange-700 leading-relaxed">
          <strong>Important:</strong> Only explicitly defined availability slots are shown to students as bookable periods. Calendar time without a class or meeting is <em>not</em> automatically treated as available for consultation.
        </p>
      </div>
    </div>
  );
}
