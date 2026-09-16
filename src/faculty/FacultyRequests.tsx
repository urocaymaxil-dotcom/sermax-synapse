import { useState } from "react";
import type { ConsultationRequest, ConsultationStatus } from "../types";
import { formatDate, formatTime, getStatusClass, getPriorityLabel } from "../data";

interface Props {
  requests: ConsultationRequest[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  onInfoRequest: (id: string, note: string) => void;
  onProposeAlternative: (id: string, date: string, time: string, note: string) => void;
  onWaitlist: (id: string) => void;
}

const ALL_STATUSES: (ConsultationStatus | "All")[] = [
  "All", "Pending", "Approved", "Confirmed", "Waitlisted", "Alternative Proposed", "Info Requested", "Declined", "Completed", "Cancelled",
];

function RequestCard({
  req,
  hasConflict,
  onApprove,
  onDecline,
  onInfoRequest,
  onProposeAlternative,
  onWaitlist,
}: {
  req: ConsultationRequest;
  hasConflict: boolean;
  onApprove: () => void;
  onDecline: () => void;
  onInfoRequest: (note: string) => void;
  onProposeAlternative: (date: string, time: string, note: string) => void;
  onWaitlist: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [showAltForm, setShowAltForm] = useState(false);
  const [infoNote, setInfoNote] = useState("");
  const [altDate, setAltDate] = useState("");
  const [altTime, setAltTime] = useState("");
  const [altNote, setAltNote] = useState("");
  const { label: priorityLabel, cls: priorityCls } = getPriorityLabel(req.priorityScore);

  const canAct = ["Pending", "Waitlisted", "Info Requested"].includes(req.status);

  return (
    <div className="card mb-3 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Priority score indicator */}
          <div className="flex-shrink-0 text-center">
            <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center" style={{ background: req.priorityScore >= 80 ? "#fee2e2" : req.priorityScore >= 60 ? "#fef3c7" : "#dbeafe" }}>
              <span className={`text-lg font-bold font-display ${priorityCls}`}>{req.priorityScore}</span>
            </div>
            <span className={`text-xs font-semibold ${priorityCls}`}>{priorityLabel}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <span className="font-heading text-slate-800">{req.studentName}</span>
                <span className="text-slate-400 text-sm ml-2">({req.section})</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${getStatusClass(req.status)}`}>{req.status}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: req.mode === "Online" ? "#dbeafe" : "#d1fae5", color: req.mode === "Online" ? "#1e40af" : "#065f46" }}>{req.mode}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
              <span><strong className="text-slate-500 font-medium">Subject:</strong> {req.subject}</span>
              <span><strong className="text-slate-500 font-medium">Concern:</strong> {req.concern}</span>
              <span><strong className="text-slate-500 font-medium">Duration:</strong> {req.duration} min</span>
            </div>

            <div className="flex flex-wrap gap-4 mt-1 text-xs text-slate-500">
              <span>📅 {formatDate(req.preferredDate)} at {formatTime(req.preferredTime)}</span>
              {req.deadline && <span className="text-orange-600 font-medium">⏰ Deadline: {formatDate(req.deadline)}</span>}
              <span>⏳ Waiting: {req.waitDays} day{req.waitDays !== 1 ? "s" : ""}</span>
              {req.displacementCount > 0 && <span className="text-red-500">⚡ Displaced: {req.displacementCount}×</span>}
            </div>

            {/* Alternative proposal info */}
            {req.alternativeDate && (
              <div className="mt-2 p-2 rounded-lg text-xs" style={{ background: "#fdf4ff", border: "1px solid #e9d5ff" }}>
                <span className="font-semibold text-purple-700">Alternative Proposed:</span>
                <span className="text-purple-600 ml-2">{formatDate(req.alternativeDate)} at {formatTime(req.alternativeTime!)}</span>
              </div>
            )}

            {req.facultyNotes && (
              <div className="mt-2 text-xs text-slate-500 italic bg-slate-50 rounded p-2">
                <span className="font-medium not-italic">Note:</span> {req.facultyNotes}
              </div>
            )}
          </div>
        </div>

        {/* Expand/collapse */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
            {expanded ? "▲ Hide details" : "▼ Show description"}
          </button>

          {canAct && (
            <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
              {hasConflict && (
                <div className="w-full mb-2 p-2.5 rounded-lg text-xs font-medium flex items-center gap-2" style={{ background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span><strong>Scheduling Conflict Detected:</strong> This request overlaps with an existing constraint. You must Waitlist, Propose Alt., or Decline.</span>
                </div>
              )}
              <button onClick={() => { onWaitlist(); }} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-90" style={{ background: "#ede9fe", color: "#5b21b6" }}>Waitlist</button>
              <button onClick={() => { setShowInfoForm(!showInfoForm); setShowAltForm(false); }} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-90" style={{ background: "#fff7ed", color: "#9a3412" }}>Request Info</button>
              <button onClick={() => { setShowAltForm(!showAltForm); setShowInfoForm(false); }} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-90" style={{ background: "#fdf4ff", color: "#7e22ce" }}>Propose Alt.</button>
              <button onClick={onDecline} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-90" style={{ background: "#fee2e2", color: "#dc2626" }}>Decline</button>
              {!hasConflict && (
                <button onClick={onApprove} className="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-all hover:opacity-90" style={{ background: "#059669" }}>Approve</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded description */}
      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="rounded-lg p-3 text-sm text-slate-600" style={{ background: "#f8faff", border: "1px solid #e2e8f0" }}>
            <p className="font-medium text-slate-700 mb-1">Student's Description:</p>
            <p className="leading-relaxed">{req.description}</p>
          </div>
        </div>
      )}

      {/* Info request form */}
      {showInfoForm && (
        <div className="px-4 pb-4">
          <div className="rounded-lg p-3" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
            <p className="text-sm font-medium text-orange-700 mb-2">Request Additional Information</p>
            <textarea
              className="w-full rounded-lg p-2 text-sm text-slate-700 resize-none"
              rows={3}
              style={{ border: "1px solid #fdba74", background: "white" }}
              placeholder="What additional information do you need from the student?"
              value={infoNote}
              onChange={e => setInfoNote(e.target.value)}
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button onClick={() => setShowInfoForm(false)} className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={() => { onInfoRequest(infoNote); setShowInfoForm(false); setInfoNote(""); }} className="text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ background: "#d97706" }}>Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Alternative proposal form */}
      {showAltForm && (
        <div className="px-4 pb-4">
          <div className="rounded-lg p-3" style={{ background: "#fdf4ff", border: "1px solid #e9d5ff" }}>
            <p className="text-sm font-medium text-purple-700 mb-2">Propose Alternative Schedule</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-xs text-purple-600 font-medium mb-1 block">Alternative Date</label>
                <input type="date" className="w-full rounded-lg p-2 text-sm" style={{ border: "1px solid #c084fc", background: "white" }} value={altDate} onChange={e => setAltDate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-purple-600 font-medium mb-1 block">Alternative Time</label>
                <input type="time" className="w-full rounded-lg p-2 text-sm" style={{ border: "1px solid #c084fc", background: "white" }} value={altTime} onChange={e => setAltTime(e.target.value)} />
              </div>
            </div>
            <textarea
              className="w-full rounded-lg p-2 text-sm resize-none"
              rows={2}
              style={{ border: "1px solid #c084fc", background: "white" }}
              placeholder="Reason for the alternative schedule (optional)"
              value={altNote}
              onChange={e => setAltNote(e.target.value)}
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button onClick={() => setShowAltForm(false)} className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={() => { if (altDate && altTime) { onProposeAlternative(altDate, altTime, altNote); setShowAltForm(false); setAltDate(""); setAltTime(""); setAltNote(""); } }} className="text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ background: "#7e22ce" }}>Propose</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FacultyRequests({ requests, onApprove, onDecline, onInfoRequest, onProposeAlternative, onWaitlist }: Props) {
  const [filter, setFilter] = useState<ConsultationStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"priority" | "date" | "wait">("priority");

  // Constraint-Aware Scheduling Conflict Detection
  const checkConflict = (req: ConsultationRequest) => {
    if (!["Pending", "Waitlisted", "Info Requested"].includes(req.status)) return false;
    // Basic interval conflict detection against existing approved/confirmed sessions
    return requests.some(other => 
      (other.status === "Confirmed" || other.status === "Approved") &&
      other.preferredDate === req.preferredDate &&
      other.preferredTime === req.preferredTime
    );
  };

  const filtered = requests
    .filter(r => filter === "All" || r.status === filter)
    .filter(r => !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "priority") return b.priorityScore - a.priorityScore;
      if (sort === "wait") return b.waitDays - a.waitDays;
      return a.preferredDate.localeCompare(b.preferredDate);
    });

  const pending = requests.filter(r => r.status === "Pending").length;
  const waitlisted = requests.filter(r => r.status === "Waitlisted").length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-slate-900">Consultation Requests</h1>
          <p className="text-slate-500 text-sm mt-1">
            {pending} pending · {waitlisted} waitlisted · Sorted by priority queue score
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort:</span>
          {(["priority", "date", "wait"] as const).map(s => (
            <button key={s} onClick={() => setSort(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${sort === s ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`} style={{ border: "1px solid #e2e8f0" }}>
              {s === "priority" ? "Priority Score" : s === "date" ? "Date" : "Wait Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Prelim Queue Visualization */}
      <div className="card p-4 mb-4" style={{ borderLeft: "4px solid #10b981" }}>
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <h3 className="font-heading text-slate-700 text-sm">Processing Queue (Prelim Implementation)</h3>
          <span className="text-xs text-slate-400 ml-1">Strict First-In, First-Out (FIFO) Order</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {requests.filter(r => r.status === "Pending").map((r, i) => (
            <div key={r.id} className="flex-shrink-0 rounded-lg p-3 text-center flex flex-col items-center" style={{ background: i === 0 ? "#ecfdf5" : "#f8faff", border: `1px solid ${i === 0 ? "#a7f3d0" : "#e2e8f0"}`, minWidth: 120 }}>
              <div className="text-xs font-bold mb-1" style={{ color: i === 0 ? "#059669" : "#94a3b8" }}>{i === 0 ? "FRONT OF QUEUE" : `Pos: ${i+1}`}</div>
              <div className="text-sm font-semibold text-slate-700 truncate w-24">{r.studentName.split(" ")[0]}</div>
              <div className="text-xs text-slate-400 truncate w-24">{r.subject}</div>
            </div>
          ))}
          {requests.filter(r => r.status === "Pending").length === 0 && (
            <div className="text-sm text-slate-400 italic">Queue is empty.</div>
          )}
        </div>
      </div>

      {/* Priority queue visualization */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
          <h3 className="font-heading text-slate-700 text-sm">Priority Queue — Fairness-Aware Ranking</h3>
          <span className="text-xs text-slate-400 ml-1">(Wait time + Deadline proximity + Displacement count + Aging)</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {requests.filter(r => ["Pending","Waitlisted"].includes(r.status)).sort((a,b) => b.priorityScore - a.priorityScore).slice(0,6).map((r, i) => (
            <div key={r.id} className="flex-shrink-0 rounded-lg p-3 text-center" style={{ background: i === 0 ? "#fef3c7" : "#f8faff", border: `1px solid ${i === 0 ? "#fde68a" : "#e2e8f0"}`, minWidth: 110 }}>
              <div className="text-xs font-bold text-slate-500 mb-1">#{i+1}</div>
              <div className="text-xl font-display" style={{ color: i === 0 ? "#d97706" : "#1d4ed8" }}>{r.priorityScore}</div>
              <div className="text-xs text-slate-600 mt-1 truncate font-medium">{r.studentName.split(" ")[0]}</div>
              <div className="text-xs text-slate-400 truncate">{r.subject}</div>
              <span className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${getStatusClass(r.status)}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: 200 }}>
          <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 bg-white" style={{ border: "1px solid #e2e8f0" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search student or subject..." className="bg-transparent text-sm text-slate-700 flex-1 min-w-0" style={{ border: "none", outline: "none", boxShadow: "none" }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {ALL_STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filter === s ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`} style={{ border: "1px solid #e2e8f0" }}>
              {s} {s !== "All" ? `(${requests.filter(r => r.status === s).length})` : `(${requests.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Request list */}
      <div>
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-slate-300 text-5xl mb-3">📋</div>
            <p className="text-slate-500">No requests found matching your filters.</p>
          </div>
        ) : (
          filtered.map(req => (
            <RequestCard
              key={req.id}
              req={req}
              hasConflict={checkConflict(req)}
              onApprove={() => onApprove(req.id)}
              onDecline={() => onDecline(req.id)}
              onInfoRequest={(note) => onInfoRequest(req.id, note)}
              onProposeAlternative={(date, time, note) => onProposeAlternative(req.id, date, time, note)}
              onWaitlist={() => onWaitlist(req.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
