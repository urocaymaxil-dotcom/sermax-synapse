import type { ViewType, AppNotification } from "../types";
import logo from "@/imports/ChatGPT_Image_Sep_16__2026__02_42_11_AM-removebg-preview.png";

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

function Icon({ path, size = 18 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

interface SidebarProps {
  role: "faculty" | "student";
  view: ViewType;
  onNav: (v: ViewType) => void;
  notifications: AppNotification[];
  unreadMessages: number;
  onLogout: () => void;
}

function Sidebar({ role, view, onNav, notifications, unreadMessages, onLogout }: SidebarProps) {
  const unreadNotif = notifications.filter((n) => !n.read).length;

  const facultyNav: NavItem[] = [
    { id: "faculty-dashboard", label: "Dashboard", icon: <Icon path="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" /> },
    { id: "faculty-schedule", label: "My Schedule", icon: <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" /> },
    { id: "faculty-requests", label: "Consultation Requests", icon: <Icon path="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />, badge: 3 },
    { id: "faculty-students", label: "My Students", icon: <Icon path="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> },
    { id: "faculty-availability", label: "Availability", icon: <Icon path="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
    { id: "faculty-messages", label: "Messages", icon: <Icon path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, badge: unreadMessages > 0 ? unreadMessages : undefined },
    { id: "faculty-history", label: "Consultation History", icon: <Icon path="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /> },
    { id: "faculty-notifications", label: "Notifications", icon: <Icon path="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />, badge: unreadNotif > 0 ? unreadNotif : undefined },
    { id: "faculty-profile", label: "Profile", icon: <Icon path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> },
  ];

  const studentNav: NavItem[] = [
    { id: "student-dashboard", label: "Dashboard", icon: <Icon path="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" /> },
    { id: "student-request", label: "Request Consultation", icon: <Icon path="M12 5v14M5 12h14" /> },
    { id: "student-consultations", label: "My Consultations", icon: <Icon path="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /> },
    { id: "student-messages", label: "Messages", icon: <Icon path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, badge: unreadMessages > 0 ? unreadMessages : undefined },
    { id: "student-notifications", label: "Notifications", icon: <Icon path="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />, badge: unreadNotif > 0 ? unreadNotif : undefined },
    { id: "student-profile", label: "Profile", icon: <Icon path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> },
  ];

  const nav = role === "faculty" ? facultyNav : studentNav;

  return (
    <div className="flex flex-col h-full" style={{ background: "white", borderRight: "1px solid #e2e8f0", width: 240 }}>
      {/* Logo area */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <div className="bg-white rounded-full p-1.5 shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-md cursor-pointer group" style={{ width: 44, height: 44 }}>
          <img src={logo} alt="SerMax SYNAPSE" className="transition-transform duration-500 group-hover:rotate-12" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div>
          <div className="font-display font-bold text-sm leading-tight">
            <span style={{ color: "#1d4ed8" }}>SERMAX</span>
            <span style={{ color: "#059669" }}> SYNAPSE</span>
          </div>
          <div className="text-xs text-slate-400" style={{ fontSize: 10 }}>Connect. Consult. Progress.</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {nav.map((item) => {
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`nav-item w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 text-left transition-all ${isActive ? "nav-active" : "text-slate-600 hover:text-slate-900"}`}
            >
              <span className={isActive ? "text-blue-600" : "text-slate-400"}>{item.icon}</span>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-5 py-5" style={{ borderTop: "1px solid #f1f5f9" }}>
        <p className="text-slate-400 text-xs font-display mb-3 leading-snug">Academic Support<br />Stronger Together.</p>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-xs transition-colors"
        >
          <Icon path="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
}

interface TopBarProps {
  role: "faculty" | "student";
  view: ViewType;
  notifications: AppNotification[];
  unreadNotif: number;
  onNav: (v: ViewType) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}

const VIEW_TITLES: Record<string, string> = {
  "faculty-dashboard": "Dashboard",
  "faculty-schedule": "My Schedule",
  "faculty-requests": "Consultation Requests",
  "faculty-students": "My Students",
  "faculty-availability": "Availability Management",
  "faculty-messages": "Messages",
  "faculty-history": "Consultation History",
  "faculty-notifications": "Notifications",
  "faculty-profile": "Profile",
  "student-dashboard": "Dashboard",
  "student-request": "Request Consultation",
  "student-consultations": "My Consultations",
  "student-messages": "Messages",
  "student-notifications": "Notifications",
  "student-profile": "Profile",
};

function TopBar({ role, view, notifications, unreadNotif, onNav, searchQuery, onSearch }: TopBarProps) {
  const name = role === "faculty" ? "Dr. Maria Santos" : "Juan Dela Cruz";
  const title = role === "faculty" ? "Faculty Member" : "BSCS 2A";
  const initials = role === "faculty" ? "MS" : "JD";
  const profileView: ViewType = role === "faculty" ? "faculty-profile" : "student-profile";
  const notifView: ViewType = role === "faculty" ? "faculty-notifications" : "student-notifications";

  return (
    <div className="flex items-center gap-4 px-6 py-3" style={{ background: "white", borderBottom: "1px solid #e2e8f0", minHeight: 64 }}>
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md rounded-lg px-3 py-2" style={{ background: "#f8faff", border: "1px solid #e2e8f0" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search students, subjects, or consultation requests..."
          className="bg-transparent text-sm text-slate-700 flex-1 min-w-0"
          style={{ border: "none", outline: "none", boxShadow: "none" }}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button
          onClick={() => onNav(notifView)}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadNotif > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-white rounded-full" style={{ background: "#dc2626", fontSize: 9, fontWeight: 700 }}>
              {unreadNotif}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => onNav(profileView)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #1d4ed8, #059669)" }}>
            {initials}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 font-display leading-tight">{name}</div>
            <div className="text-xs text-slate-400">{title}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface LayoutProps {
  role: "faculty" | "student";
  view: ViewType;
  onNav: (v: ViewType) => void;
  notifications: AppNotification[];
  unreadMessages: number;
  onLogout: () => void;
  children: React.ReactNode;
  searchQuery: string;
  onSearch: (q: string) => void;
}

export default function Layout({ role, view, onNav, notifications, unreadMessages, onLogout, children, searchQuery, onSearch }: LayoutProps) {
  const unreadNotif = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#eef2ff" }}>
      <div className="flex-shrink-0 h-full overflow-hidden">
        <Sidebar role={role} view={view} onNav={onNav} notifications={notifications} unreadMessages={unreadMessages} onLogout={onLogout} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar role={role} view={view} notifications={notifications} unreadNotif={unreadNotif} onNav={onNav} searchQuery={searchQuery} onSearch={onSearch} />
        <main className="flex-1 overflow-y-auto p-6 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
