import { useState } from "react";
import type { StudentRecord } from "../types";
import { formatDate } from "../data";

interface Props {
  students: StudentRecord[];
}

export default function FacultyStudents({ students }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"name" | "consultations" | "section">("consultations");

  const filtered = students
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.section.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "section") return a.section.localeCompare(b.section);
      return b.totalConsultations - a.totalConsultations;
    });

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-slate-900">My Students</h1>
          <p className="text-slate-500 text-sm mt-1">{students.length} students across your subjects</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: students.length, color: "#1d4ed8" },
          { label: "With Pending Requests", value: students.filter(s => s.pendingRequests > 0).length, color: "#d97706" },
          { label: "Consulted This Sem", value: students.filter(s => s.totalConsultations > 0).length, color: "#059669" },
          { label: "Avg. Consultations", value: (students.reduce((s, st) => s + st.totalConsultations, 0) / students.length).toFixed(1), color: "#7c3aed" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl font-display" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + sort */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: 200 }}>
          <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 bg-white" style={{ border: "1px solid #e2e8f0" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search by name or section..." className="bg-transparent text-sm text-slate-700 flex-1" style={{ border: "none", outline: "none", boxShadow: "none" }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-1">
          {(["name","section","consultations"] as const).map(s => (
            <button key={s} onClick={() => setSort(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${sort === s ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`} style={{ border: "1px solid #e2e8f0" }}>
              {s === "name" ? "Name" : s === "section" ? "Section" : "Consultations"}
            </button>
          ))}
        </div>
      </div>

      {/* Student grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(student => (
          <div key={student.id} className="card p-5 hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
                {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading text-slate-800 text-sm">{student.name}</div>
                <div className="text-xs text-slate-400">{student.section}</div>
                <div className="text-xs text-slate-400 truncate">{student.email}</div>
              </div>
              {student.pendingRequests > 0 && (
                <span className="badge flex-shrink-0">{student.pendingRequests}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Consultations</span>
                <span className="font-semibold text-slate-700">{student.totalConsultations}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Pending Requests</span>
                <span className={`font-semibold ${student.pendingRequests > 0 ? "text-amber-600" : "text-slate-400"}`}>{student.pendingRequests}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Last Consultation</span>
                <span className="text-slate-600">{student.lastConsultation ? formatDate(student.lastConsultation) : "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Subjects</span>
                <span className="text-slate-600 text-right">{student.subjects.join(", ")}</span>
              </div>
            </div>

            {/* Consultation bar */}
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Consultation activity</span>
                <span>{student.totalConsultations} sessions</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #1d4ed8, #059669)", width: `${Math.min(100, (student.totalConsultations / 10) * 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
