import { useState } from "react";
import { STUDENT } from "../data";

export default function StudentProfile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: STUDENT.name,
    email: STUDENT.email,
    section: STUDENT.section,
    phone: "+63 912 345 6789",
    notifyEmail: true,
    notifySystem: true,
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account information and preferences</p>
        </div>
        <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: editing ? "#e2e8f0" : "#d1fae5", color: editing ? "#475569" : "#059669", border: "1px solid " + (editing ? "#cbd5e1" : "#6ee7b7") }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>JD</div>
            <h2 className="font-display font-bold text-slate-900 text-xl">{STUDENT.name}</h2>
            <p className="text-slate-500 text-sm mt-1">{STUDENT.section}</p>
            <p className="text-slate-400 text-xs">{STUDENT.email}</p>

            <div className="mt-4 pt-4 grid grid-cols-2 gap-3" style={{ borderTop: "1px solid #f1f5f9" }}>
              {[
                { label: "Academic Year", value: "2026–2027" },
                { label: "Semester", value: "1st Sem" },
                { label: "Program", value: "BSCS" },
                { label: "Year Level", value: "2nd Year" },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-sm font-semibold text-slate-700">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-700 text-sm mb-3">Consultation Summary</h3>
            <div className="space-y-2">
              {[
                { label: "Total Requests", value: "1" },
                { label: "Completed", value: "1" },
                { label: "Pending", value: "0" },
                { label: "Priority Queue Rank", value: "N/A" },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{s.label}</span>
                  <span className="font-semibold text-slate-700">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email Address", key: "email", type: "email" },
                { label: "Section", key: "section", type: "text" },
                { label: "Phone Number", key: "phone", type: "tel" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-500 font-medium mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    disabled={!editing}
                    className="w-full rounded-lg px-3 py-2 text-sm text-slate-700"
                    style={{ border: "1px solid #e2e8f0", background: editing ? "white" : "#f8fafc" }}
                    value={form[f.key as keyof typeof form] as string}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-800 mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { label: "Email Notifications", sub: "Receive email alerts when request status changes", key: "notifyEmail" },
                { label: "System Notifications", sub: "Show in-app alerts for consultation updates", key: "notifySystem" },
              ].map(t => (
                <div key={t.key} className="flex items-center justify-between py-2" style={{ borderTop: "1px solid #f8fafc" }}>
                  <div>
                    <div className="text-sm font-medium text-slate-700">{t.label}</div>
                    <div className="text-xs text-slate-400">{t.sub}</div>
                  </div>
                  <button
                    disabled={!editing}
                    onClick={() => editing && setForm(f => ({ ...f, [t.key]: !f[t.key as keyof typeof f] }))}
                    className="relative w-11 h-6 rounded-full transition-all duration-200"
                    style={{ background: form[t.key as keyof typeof form] ? "#059669" : "#e2e8f0" }}
                  >
                    <div className="absolute top-1 transition-all duration-200 w-4 h-4 rounded-full bg-white shadow" style={{ left: form[t.key as keyof typeof form] ? "calc(100% - 4px - 16px)" : "4px" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {editing && (
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(false)} className="px-5 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => setEditing(false)} className="px-5 py-2 text-sm text-white rounded-xl font-medium hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
