import { useState, useMemo } from "react";
import type { ConsultationRequest, ConcernType, ConsultationMode, AvailabilitySlot, ScheduleEvent, FacultyRecord } from "../types";
import { CONCERN_TYPES, SUBJECTS, FACULTY, formatTime } from "../data";

interface Props {
  availability: AvailabilitySlot[];
  schedule: ScheduleEvent[];
  faculties: FacultyRecord[];
  userName: string;
  onSubmit: (req: Omit<ConsultationRequest, "id" | "status" | "priorityScore" | "waitDays" | "displacementCount" | "createdAt">) => void;
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

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StudentRequestForm({ onSubmit, availability, schedule, faculties, userName }: Props) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [searchTeacher, setSearchTeacher] = useState("");
  const [form, setForm] = useState({
    facultyId: "",
    facultyName: "",
    subject: "",
    concern: "" as ConcernType,
    description: "",
    preferredDate: "",
    preferredTime: "",
    duration: 30,
    deadline: "",
    mode: "Online" as ConsultationMode,
    hasDeadline: false,
  });

  const update = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    onSubmit({
      studentId: "s1",
      studentName: userName,
      section: "BSCS 2A",
      facultyId: form.facultyId,
      facultyName: form.facultyName,
      subject: form.subject,
      concern: form.concern,
      description: form.description,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      duration: form.duration,
      deadline: form.hasDeadline ? form.deadline : undefined,
      mode: form.mode,
    });
    setSubmitted(true);
  };

  // We no longer use pre-defined availableSlots
  // Availability is determined dynamically
  
  const nextOccurrences = useMemo(() => {
    const dates = {} as Record<string, string>;
    const today = new Date();
    // Get the next 7 days to cover exactly one week
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = DAYS[d.getDay()];
      if (WEEKDAYS.includes(dayName)) {
        dates[dayName] = d.toISOString().split("T")[0];
      }
    }
    return dates;
  }, []);

  const canProceed0 = form.facultyId !== "";
  const canProceed1 = form.subject && form.concern && form.description.length > 10;
  const canProceed2 = form.preferredDate && form.preferredTime && (!form.hasDeadline || form.deadline);

  const selectedFaculty = faculties.find(f => f.id === form.facultyId);
  const facultySubjects = selectedFaculty?.subjectsHandled || [];
  const filteredFaculties = faculties.filter(f => f.name.toLowerCase().includes(searchTeacher.toLowerCase()) || f.subjectsHandled.some(s => s.toLowerCase().includes(searchTeacher.toLowerCase())));

  if (submitted) {
    return (
      <div>
        <div className="flex items-start justify-between mb-6">
          <h1 className="font-display text-2xl text-slate-900">Request Consultation</h1>
        </div>
        <div className="max-w-lg mx-auto">
          <div className="card p-10 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#d1fae5" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              </svg>
            </div>
            <h2 className="font-display text-slate-900 text-xl mb-2">Request Submitted!</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Your consultation request for <strong>{form.subject}</strong> has been sent to {form.facultyName}. You will be notified once the request is reviewed.
            </p>
            <div className="rounded-xl p-4 text-left mb-6" style={{ background: "#f8faff", border: "1px solid #e2e8f0" }}>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-400">Subject:</span> <span className="text-slate-700 font-medium">{form.subject}</span></div>
                <div><span className="text-slate-400">Concern:</span> <span className="text-slate-700 font-medium">{form.concern}</span></div>
                <div><span className="text-slate-400">Preferred Date:</span> <span className="text-slate-700 font-medium">{new Date(form.preferredDate).toLocaleDateString()}</span></div>
                <div><span className="text-slate-400">Preferred Time:</span> <span className="text-slate-700 font-medium">{formatTime(form.preferredTime)}</span></div>
                <div><span className="text-slate-400">Duration:</span> <span className="text-slate-700 font-medium">{form.duration} min</span></div>
                <div><span className="text-slate-400">Mode:</span> <span className="text-slate-700 font-medium">{form.mode}</span></div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setSubmitted(false); setStep(0); setForm({ facultyId: "", facultyName: "", subject: "", concern: "" as ConcernType, description: "", preferredDate: "", preferredTime: "", duration: 30, deadline: "", mode: "Online", hasDeadline: false }); }} className="px-5 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors" style={{ border: "1px solid #bfdbfe" }}>
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-slate-900">Request Consultation</h1>
          <p className="text-slate-500 text-sm mt-1">Submit a consultation request to a faculty member</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 max-w-lg">
        {[0, 1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "text-white" : "text-slate-400"}`} style={{ background: step >= s ? (step > s ? "#059669" : "#1d4ed8") : "#f1f5f9" }}>
              {step > s ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
              ) : s + 1}
            </div>
            <div className="text-xs text-slate-500 ml-2 hidden md:block">
              {s === 0 ? "Teacher" : s === 1 ? "Details" : s === 2 ? "Schedule" : "Submit"}
            </div>
            {s < 3 && <div className="flex-1 h-0.5 mx-3" style={{ background: step > s ? "#059669" : "#e2e8f0" }} />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        {/* Step 0: Teacher Selection */}
        {step === 0 && (
          <div className="card p-6 space-y-5 fade-in">
            <h2 className="font-heading text-slate-800 text-lg">Select Faculty Member</h2>
            <div className="relative">
              <svg className="absolute left-3 top-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder="Search teacher or subject..." className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white text-slate-700" style={{ border: "1px solid #e2e8f0" }} value={searchTeacher} onChange={e => setSearchTeacher(e.target.value)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredFaculties.length === 0 ? (
                <div className="col-span-2 text-center text-slate-500 py-8 text-sm">No teachers found matching your search.</div>
              ) : (
                filteredFaculties.map(f => (
                  <div key={f.id} onClick={() => { update("facultyId", f.id); update("facultyName", f.name); update("subject", ""); }} className="card p-4 cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden" style={{ border: form.facultyId === f.id ? "2px solid #1d4ed8" : "1px solid #e2e8f0", background: form.facultyId === f.id ? "#f8faff" : "white" }}>
                    <div className="flex gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>{f.initials}</div>
                      <div>
                        <div className="font-heading text-slate-900 text-sm">{f.name}</div>
                        <div className="text-xs text-slate-500">{f.department}</div>
                      </div>
                    </div>
                    {f.subjectsHandled.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {f.subjectsHandled.slice(0, 3).map(s => <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">{s}</span>)}
                        {f.subjectsHandled.length > 3 && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">+{f.subjectsHandled.length - 3}</span>}
                      </div>
                    )}
                    {form.facultyId === f.id && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>}
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-end pt-4 mt-6" style={{ borderTop: "1px solid #f8fafc" }}>
              <button disabled={!canProceed0} onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: canProceed0 ? "linear-gradient(135deg, #1d4ed8, #059669)" : "#cbd5e1" }}>Next Step</button>
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="card p-6 space-y-5 fade-in">
            <h2 className="font-heading text-slate-800 text-lg">Consultation Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Subject / Course <span className="text-red-400">*</span></label>
                <select className="w-full rounded-xl px-4 py-2.5 text-sm bg-white text-slate-700" style={{ border: "1px solid #e2e8f0" }} value={form.subject} onChange={e => update("subject", e.target.value)}>
                  <option value="">Select a subject...</option>
                  {facultySubjects.length > 0 ? facultySubjects.map((s: string) => <option key={s}>{s}</option>) : <option disabled>No subjects listed for this teacher</option>}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Concern Type <span className="text-red-400">*</span></label>
                <select className="w-full rounded-xl px-4 py-2.5 text-sm bg-white text-slate-700" style={{ border: "1px solid #e2e8f0" }} value={form.concern} onChange={e => update("concern", e.target.value as ConcernType)}>
                  <option value="">Select concern type...</option>
                  {CONCERN_TYPES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Description of Concern <span className="text-red-400">*</span>
                <span className="text-slate-400 font-normal ml-1">({form.description.length}/500)</span>
              </label>
              <textarea
                className="w-full rounded-xl px-4 py-3 text-sm text-slate-700 resize-none"
                rows={5}
                style={{ border: "1px solid #e2e8f0", background: "white" }}
                placeholder="Describe your academic concern in detail. What specifically do you need help with? What have you already tried?"
                value={form.description}
                maxLength={500}
                onChange={e => update("description", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Consultation Mode <span className="text-red-400">*</span></label>
              <div className="flex gap-3">
                {(["Online", "Face-to-Face"] as ConsultationMode[]).map(m => (
                  <button key={m} onClick={() => update("mode", m)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${form.mode === m ? "text-white" : "text-slate-600 hover:bg-slate-50"}`} style={{
                    background: form.mode === m ? (m === "Online" ? "#1d4ed8" : "#059669") : "white",
                    border: `2px solid ${form.mode === m ? (m === "Online" ? "#1d4ed8" : "#059669") : "#e2e8f0"}`
                  }}>
                    {m === "Online" ? "💻 Online" : "🏫 Face-to-Face"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(0)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">← Back</button>
              <button disabled={!canProceed1} onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
                Next: Schedule →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="card p-6 space-y-6 fade-in">
            <h2 className="font-heading text-slate-800 text-lg">Schedule Preferences</h2>

            <div className="rounded-xl p-4" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
              <div className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
                <p className="text-sm text-orange-700">Please select an available (green) time block based on {FACULTY.name}'s schedule. Classes and meetings are grayed out.</p>
              </div>
            </div>

            <div className="card overflow-hidden mt-4" style={{ background: "var(--theme-bg-base)", border: "1px solid var(--theme-border)" }}>
              {/* Day headers */}
              <div className="flex border-b border-[var(--theme-border)]">
                <div style={{ width: 50, flexShrink: 0 }} />
                {WEEKDAYS.map((day) => {
                  const dateStr = nextOccurrences[day];
                  const d = dateStr ? new Date(dateStr) : null;
                  return (
                    <div key={day} className="flex-1 text-center py-2" style={{ borderLeft: "1px solid var(--theme-border)" }}>
                      <div className="font-heading text-xs text-[var(--theme-text-main)]">{day.substring(0,3)}</div>
                      {d && <div className="text-[10px] text-[var(--theme-text-muted)]">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>}
                    </div>
                  );
                })}
              </div>

              {/* Time grid */}
              <div className="flex overflow-y-auto" style={{ maxHeight: 350 }}>
                {/* Time labels */}
                <div style={{ width: 50, flexShrink: 0 }}>
                  {HOURS.map(h => (
                    <div key={h} style={{ height: PX_PER_HOUR }} className="flex items-start pt-1 px-1">
                      <span className="text-[10px] text-[var(--theme-text-muted)]">
                        {h === 12 ? "12pm" : h > 12 ? `${h-12}pm` : `${h}am`}
                      </span>
                    </div>
                  ))}
                  {/* Additional label for 7PM and 8PM since hours only go up to 6PM (12 items) */}
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
                  const dateStr = nextOccurrences[day];
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

                      {/* Render unclickable blocked exceptions */}
                      {dayBlocked.map((b) => {
                        const startMin = timeToMinutes(b.startTime);
                        const endMin = timeToMinutes(b.endTime);
                        const top = minutesToPx(startMin, 7, PX_PER_HOUR);
                        const height = ((endMin - startMin) / 60) * PX_PER_HOUR;
                        return (
                          <div
                            key={b.id}
                            className="absolute inset-x-1 rounded overflow-hidden text-[9px] pointer-events-none flex items-center justify-center"
                            style={{
                              top,
                              height: Math.max(height, 20),
                              background: "rgba(220, 38, 38, 0.1)",
                              border: "1px solid rgba(220, 38, 38, 0.3)",
                              color: "rgba(220, 38, 38, 0.8)",
                              padding: "2px 4px",
                              zIndex: 1,
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                          </div>
                        );
                      })}

                      {/* Render clickable availability blocks */}
                      {generatedChunks.map((slot) => {
                        const top = minutesToPx(slot.startMin, 7, PX_PER_HOUR);
                        const height = ((slot.endMin - slot.startMin) / 60) * PX_PER_HOUR;
                        
                        const isSelected = form.preferredDate === dateStr && form.preferredTime === slot.startTime;

                        return (
                          <button
                            key={slot.id}
                            onClick={() => { update("preferredDate", dateStr); update("preferredTime", slot.startTime); }}
                            className={`absolute inset-x-0.5 rounded overflow-hidden text-[10px] text-left transition-all ${isSelected ? "shadow-md scale-[1.02]" : "hover:opacity-90"}`}
                            style={{
                              top,
                              height: Math.max(height, 24),
                              background: isSelected ? "#059669" : "#10b981",
                              color: "white",
                              border: `1px solid ${isSelected ? "#047857" : "#34d399"}`,
                              padding: "2px 4px",
                              zIndex: 2,
                            }}
                          >
                            <div className="font-bold truncate">{formatTime(slot.startTime)}</div>
                            <div className="truncate opacity-90">Available</div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="text-sm font-medium text-slate-700 mb-3 block">Estimated Duration</label>
              <div className="flex gap-2 flex-wrap">
                {[15, 30, 45, 60, 90].map(d => (
                  <button key={d} onClick={() => update("duration", d)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${form.duration === d ? "text-white" : "text-slate-600 hover:bg-slate-50"}`} style={{ background: form.duration === d ? "#1d4ed8" : "white", border: `1px solid ${form.duration === d ? "#1d4ed8" : "#e2e8f0"}` }}>
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <input type="checkbox" id="hasDeadline" checked={form.hasDeadline} onChange={e => update("hasDeadline", e.target.checked)} className="rounded" />
                <label htmlFor="hasDeadline" className="text-sm font-medium text-slate-700">I have an applicable academic deadline</label>
              </div>
              {form.hasDeadline && (
                <div className="fade-in">
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Deadline Date <span className="text-red-400">*</span></label>
                  <input type="date" min="2026-09-15" className="w-full rounded-xl px-4 py-2.5 text-sm bg-white" style={{ border: "1px solid #e2e8f0" }} value={form.deadline} onChange={e => update("deadline", e.target.value)} />
                  <p className="text-xs text-slate-400 mt-1">This date affects the priority score of your request in the queue.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">← Back</button>
              <button disabled={!canProceed2} onClick={() => setStep(3)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="card p-6 space-y-5 fade-in">
            <h2 className="font-heading text-slate-800 text-lg">Review & Submit</h2>

            <div className="rounded-xl p-5" style={{ background: "#f8faff", border: "2px solid #dbeafe" }}>
              <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">Request Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Faculty", value: form.facultyName },
                  { label: "Subject", value: form.subject },
                  { label: "Concern Type", value: form.concern },
                  { label: "Mode", value: form.mode },
                  { label: "Preferred Date", value: new Date(form.preferredDate).toLocaleDateString() },
                  { label: "Preferred Time", value: formatTime(form.preferredTime) },
                  { label: "Duration", value: `${form.duration} minutes` },
                  { label: "Deadline", value: form.hasDeadline && form.deadline ? form.deadline : "None" },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-xs text-slate-400 font-medium">{f.label}</div>
                    <div className="text-sm text-slate-800 font-medium mt-0.5">{f.value || "—"}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #e2e8f0" }}>
                <div className="text-xs text-slate-400 font-medium mb-1">Description</div>
                <p className="text-sm text-slate-700 leading-relaxed">{form.description}</p>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <p className="text-sm text-emerald-700">
                <strong>Ready to submit.</strong> Your request will be placed in the consultation queue and reviewed by {form.facultyName}. You will receive a notification when the status changes.
              </p>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">← Back</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
                Submit Request ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
