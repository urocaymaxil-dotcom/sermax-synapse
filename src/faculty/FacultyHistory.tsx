import { useState } from "react";
import type { ConsultationRequest } from "../types";
import { formatDate, formatTime, getStatusClass } from "../data";

interface Props {
  requests: ConsultationRequest[];
  onRecordOutcome: (id: string, outcome: string, notes: string) => void;
  userName: string;
  userId: string;
}

const OUTCOMES = ["Resolved", "Partially Resolved", "Follow-up Required", "Referred", "Cancelled", "No-show"];

export default function FacultyHistory({ requests, onRecordOutcome, userName, userId }: Props) {
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [outcomeForm, setOutcomeForm] = useState({ outcome: "Resolved", notes: "" });

  const myRequests = requests.filter(r => r.facultyId === userId || r.facultyName === userName);
  const completed = myRequests.filter(r => ["Completed", "Cancelled", "No-show", "Declined"].includes(r.status));
  const active = myRequests.filter(r => ["Confirmed", "Approved"].includes(r.status));
  const needsOutcome = myRequests.filter(r => r.status === "Confirmed" && !r.outcome);

  const allHistory = [...completed, ...active];
  const filtered = allHistory
    .filter(r => filter === "All" || r.status === filter)
    .filter(r => !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-slate-900">Consultation History</h1>
          <p className="text-slate-500 text-sm mt-1">{completed.length} completed consultations this semester</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Consultations", value: myRequests.length, color: "#1d4ed8", bg: "#dbeafe" },
          { label: "Completed", value: myRequests.filter(r => r.status === "Completed").length, color: "#059669", bg: "#d1fae5" },
          { label: "Cancelled/Declined", value: myRequests.filter(r => ["Cancelled","Declined"].includes(r.status)).length, color: "#dc2626", bg: "#fee2e2" },
          { label: "Needs Outcome", value: needsOutcome.length, color: "#d97706", bg: "#fef3c7" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl font-display" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: 200 }}>
          <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 bg-white" style={{ border: "1px solid #e2e8f0" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search student or subject..." className="bg-transparent text-sm text-slate-700 flex-1 min-w-0" style={{ border: "none", outline: "none", boxShadow: "none" }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {["All","Completed","Confirmed","Cancelled","Declined","No-show"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filter === s ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`} style={{ border: "1px solid #e2e8f0" }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f8faff", borderBottom: "1px solid #e2e8f0" }}>
                {["Student","Subject","Concern","Date & Time","Mode","Status","Outcome","Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <>
                  <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-slate-800">{req.studentName}</div>
                      <div className="text-xs text-slate-400">{req.section}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{req.subject}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{req.concern}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-600">{formatDate(req.preferredDate)}</div>
                      <div className="text-xs text-slate-400">{formatTime(req.preferredTime)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: req.mode === "Online" ? "#dbeafe" : "#d1fae5", color: req.mode === "Online" ? "#1e40af" : "#065f46" }}>{req.mode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusClass(req.status)}`}>{req.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {req.outcome ? (
                        <span className="text-xs text-emerald-600 font-medium">{req.outcome}</span>
                      ) : req.status === "Confirmed" ? (
                        <span className="text-xs text-amber-500">Pending</span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {req.status === "Confirmed" && (
                        <button onClick={() => setRecordingId(recordingId === req.id ? null : req.id)} className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all hover:opacity-90" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                          Record Outcome
                        </button>
                      )}
                    </td>
                  </tr>
                  {recordingId === req.id && (
                    <tr key={`${req.id}-form`}>
                      <td colSpan={8} className="px-4 pb-3">
                        <div className="rounded-xl p-4" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                          <p className="text-sm font-semibold text-emerald-800 mb-3">Record Consultation Outcome</p>
                          <div className="flex gap-3 flex-wrap">
                            <select className="rounded-lg px-3 py-2 text-sm bg-white" style={{ border: "1px solid #86efac" }} value={outcomeForm.outcome} onChange={e => setOutcomeForm(f => ({ ...f, outcome: e.target.value }))}>
                              {OUTCOMES.map(o => <option key={o}>{o}</option>)}
                            </select>
                            <input type="text" placeholder="Additional notes..." className="flex-1 rounded-lg px-3 py-2 text-sm bg-white" style={{ border: "1px solid #86efac", minWidth: 200 }} value={outcomeForm.notes} onChange={e => setOutcomeForm(f => ({ ...f, notes: e.target.value }))} />
                            <button onClick={() => { onRecordOutcome(req.id, outcomeForm.outcome, outcomeForm.notes); setRecordingId(null); }} className="px-4 py-2 text-sm text-white rounded-lg font-medium" style={{ background: "#059669" }}>Save</button>
                            <button onClick={() => setRecordingId(null)} className="px-4 py-2 text-sm text-slate-500 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
