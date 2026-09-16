import { useState, useMemo } from "react";
import type { ConsultationRequest, ConcernType, ConsultationMode, AvailabilitySlot } from "../types";
import { CONCERN_TYPES, SUBJECTS, FACULTY, formatTime } from "../data";

interface Props {
  availability: AvailabilitySlot[];
  onSubmit: (req: Omit<ConsultationRequest, "id" | "status" | "priorityScore" | "waitDays" | "displacementCount" | "createdAt">) => void;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StudentRequestForm({ onSubmit, availability }: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
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
      studentName: "Juan Dela Cruz",
      section: "BSCS 2A",
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

  const availableSlots = useMemo(() => availability.filter(a => a.type === "available"), [availability]);
  
  const upcomingDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = DAYS[d.getDay()];
      if (availableSlots.some(s => s.day === dayName)) {
        dates.push({
          date: d.toISOString().split("T")[0],
          dayName,
          display: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
      }
    }
    return dates;
  }, [availableSlots]);

  const canProceed1 = form.subject && form.concern && form.description.length > 10;
  const canProceed2 = form.preferredDate && form.preferredTime && (!form.hasDeadline || form.deadline);

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
              Your consultation request for <strong>{form.subject}</strong> has been sent to {FACULTY.name}. You will be notified once the request is reviewed.
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
              <button onClick={() => { setSubmitted(false); setStep(1); setForm({ subject: "", concern: "" as ConcernType, description: "", preferredDate: "", preferredTime: "", duration: 30, deadline: "", mode: "Online", hasDeadline: false }); }} className="px-5 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors" style={{ border: "1px solid #bfdbfe" }}>
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
          <p className="text-slate-500 text-sm mt-1">Submit a consultation request to {FACULTY.name}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 max-w-lg">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "text-white" : "text-slate-400"}`} style={{ background: step >= s ? (step > s ? "#059669" : "#1d4ed8") : "#f1f5f9" }}>
              {step > s ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
              ) : s}
            </div>
            <div className="text-xs text-slate-500 ml-2 hidden md:block">
              {s === 1 ? "Consultation Details" : s === 2 ? "Schedule Preferences" : "Review & Submit"}
            </div>
            {s < 3 && <div className="flex-1 h-0.5 mx-3" style={{ background: step > s ? "#059669" : "#e2e8f0" }} />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        {/* Step 1: Details */}
        {step === 1 && (
          <div className="card p-6 space-y-5 fade-in">
            <h2 className="font-heading text-slate-800 text-lg">Consultation Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Subject / Course <span className="text-red-400">*</span></label>
                <select className="w-full rounded-xl px-4 py-2.5 text-sm bg-white text-slate-700" style={{ border: "1px solid #e2e8f0" }} value={form.subject} onChange={e => update("subject", e.target.value)}>
                  <option value="">Select a subject...</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
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

            <div className="flex justify-end">
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
                <p className="text-sm text-orange-700">Please select an available time block based on {FACULTY.name}'s schedule.</p>
              </div>
            </div>

            {availableSlots.length === 0 ? (
              <div className="rounded-xl p-6 text-center" style={{ background: "#f8fafc", border: "2px dashed #cbd5e1" }}>
                <p className="text-slate-600 font-medium mb-1">No availability schedules defined</p>
                <p className="text-sm text-slate-400 mb-4">The faculty member hasn't set their availability yet.</p>
                <button onClick={() => setStep(1)} className="px-5 py-2 rounded-lg text-sm text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors">Go Back</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">1. Select an Available Date <span className="text-red-400">*</span></label>
                  <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
                    {upcomingDates.length === 0 ? (
                      <div className="text-sm text-slate-500 italic">No upcoming available dates found.</div>
                    ) : (
                      upcomingDates.map(d => (
                        <button
                          key={d.date}
                          onClick={() => { update("preferredDate", d.date); update("preferredTime", ""); }}
                          className={`flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${form.preferredDate === d.date ? "text-white shadow-lg scale-105" : "bg-white text-slate-500 border border-slate-200 hover:border-blue-300 hover:bg-blue-50"}`}
                          style={{ background: form.preferredDate === d.date ? "#1d4ed8" : undefined }}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{d.display.split(',')[0]}</span>
                          <span className="text-2xl font-display">{d.display.split(' ')[2]}</span>
                          <span className="text-[10px] uppercase font-bold opacity-80 mt-1">{d.display.split(' ')[1]}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {form.preferredDate && (
                  <div className="fade-in pt-2">
                    <label className="text-sm font-medium text-slate-700 mb-3 block">2. Select a Time Slot <span className="text-red-400">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots
                        .filter(s => s.day === upcomingDates.find(d => d.date === form.preferredDate)?.dayName)
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => update("preferredTime", slot.startTime)}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${form.preferredTime === slot.startTime ? "text-emerald-700 border-2 border-emerald-500 bg-emerald-50 shadow-sm" : "bg-white text-slate-600 border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: form.preferredTime === slot.startTime ? 1 : 0.4 }}>
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  { label: "Faculty", value: FACULTY.name },
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
                <strong>Ready to submit.</strong> Your request will be placed in the consultation queue and reviewed by {FACULTY.name}. You will receive a notification when the status changes.
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
