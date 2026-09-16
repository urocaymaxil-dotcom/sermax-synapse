import { useState } from "react";
import type { ConsultationRequest, ConsultationStatus } from "../types";
import { formatDate, formatTime, getStatusClass } from "../data";

interface Props {
  requests: ConsultationRequest[];
  onAcceptAlternative: (id: string) => void;
  onCancelRequest: (id: string) => void;
  onNav: (v: string) => void;
}

const MY_STUDENT_ID = "s1";

const STATUS_HELP: Partial<Record<ConsultationStatus, string>> = {
  "Pending": "Your request is in the queue, awaiting faculty review.",
  "Waitlisted": "No available slots currently. You will be notified when a slot opens.",
  "Info Requested": "The faculty member needs more information before proceeding.",
  "Alternative Proposed": "The faculty proposed a different schedule. Please review and respond.",
  "Approved": "Your request is approved. Awaiting confirmation.",
  "Confirmed": "Your consultation is confirmed. Please attend on time.",
  "Completed": "This consultation session has been completed.",
  "Declined": "Your request was declined. You may submit a new request with a different schedule.",
  "Cancelled": "This consultation was cancelled.",
};

export default function StudentConsultations({ requests, onAcceptAlternative, onCancelRequest, onNav }: Props) {
  const [filter, setFilter] = useState<ConsultationStatus | "All">("All");
  const myRequests = requests.filter(r => r.studentId === MY_STUDENT_ID);
  const filtered = filter === "All" ? myRequests : myRequests.filter(r => r.status === filter);

  const statuses = Array.from(new Set(myRequests.map(r => r.status)));

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-slate-900">My Consultations</h1>
          <p className="text-slate-500 text-sm mt-1">{myRequests.length} total request{myRequests.length !== 1 ? "s" : ""} across all semesters</p>
        </div>
        <button onClick={() => onNav("student-request")} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New Request
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => setFilter("All")} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filter === "All" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`} style={{ border: "1px solid #e2e8f0" }}>All ({myRequests.length})</button>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filter === s ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`} style={{ border: "1px solid #e2e8f0" }}>
            {s} ({myRequests.filter(r => r.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-slate-300 text-5xl mb-3">📋</div>
          <p className="text-slate-500 mb-4">No consultations found.</p>
          <button onClick={() => onNav("student-request")} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
            Request Your First Consultation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <div key={req.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-heading text-slate-800">{req.subject}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${getStatusClass(req.status)}`}>{req.status}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: req.mode === "Online" ? "#dbeafe" : "#d1fae5", color: req.mode === "Online" ? "#1e40af" : "#065f46" }}>{req.mode}</span>
                  </div>
                  <div className="text-sm text-slate-500">{req.concern}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-slate-700">{formatDate(req.preferredDate)}</div>
                  <div className="text-xs text-slate-400">{formatTime(req.preferredTime)} · {req.duration} min</div>
                  {req.deadline && <div className="text-xs text-orange-500 font-medium mt-0.5">Deadline: {formatDate(req.deadline)}</div>}
                </div>
              </div>

              <div className="text-sm text-slate-600 leading-relaxed mb-3 p-3 rounded-lg" style={{ background: "#f8fafc" }}>
                {req.description}
              </div>

              {/* Status help text */}
              {STATUS_HELP[req.status] && (
                <div className="rounded-lg p-3 mb-3 flex items-start gap-2" style={{ background: "#f8faff", border: "1px solid #dbeafe" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                  </svg>
                  <p className="text-xs text-blue-700">{STATUS_HELP[req.status]}</p>
                </div>
              )}

              {/* Faculty notes */}
              {req.facultyNotes && (
                <div className="rounded-lg p-3 mb-3" style={{ background: "#fef3c7", border: "1px solid #fde68a" }}>
                  <p className="text-xs font-semibold text-amber-800 mb-0.5">Faculty Response:</p>
                  <p className="text-sm text-amber-700">{req.facultyNotes}</p>
                </div>
              )}

              {/* Alternative proposal */}
              {req.status === "Alternative Proposed" && req.alternativeDate && (
                <div className="rounded-xl p-4 mb-3" style={{ background: "#fdf4ff", border: "2px solid #e9d5ff" }}>
                  <p className="text-sm font-semibold text-purple-800 mb-2">Alternative Schedule Proposed</p>
                  <p className="text-sm text-purple-700 mb-3">
                    {req.facultyNotes || "The faculty member is proposing a different schedule."}
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-sm font-medium text-purple-800">
                      📅 {formatDate(req.alternativeDate)} at {formatTime(req.alternativeTime!)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onAcceptAlternative(req.id)} className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-all" style={{ background: "#059669" }}>Accept Alternative</button>
                    <button onClick={() => onCancelRequest(req.id)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors" style={{ border: "1px solid #fca5a5", color: "#dc2626" }}>Decline</button>
                  </div>
                </div>
              )}

              {/* Outcome */}
              {req.outcome && (
                <div className="rounded-lg p-3" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <p className="text-xs font-semibold text-emerald-700">Outcome: <span className="font-medium">{req.outcome}</span></p>
                  {req.completedAt && <p className="text-xs text-emerald-600 mt-0.5">Completed: {formatDate(req.completedAt.split("T")[0])}</p>}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #f8fafc" }}>
                {["Pending","Waitlisted","Approved"].includes(req.status) && (
                  <button onClick={() => onCancelRequest(req.id)} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:bg-red-50" style={{ border: "1px solid #fca5a5", color: "#dc2626" }}>
                    Cancel Request
                  </button>
                )}
                <div className="text-xs text-slate-400 self-center">Priority Score: <strong className="text-slate-600">{req.priorityScore}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
