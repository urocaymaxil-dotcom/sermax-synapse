import { useState, useEffect } from "react";
import type { ViewType, ConsultationRequest, AvailabilitySlot, ChatMessage } from "./types";
import { api } from "./api";
import {
  INITIAL_SCHEDULE,
  INITIAL_FACULTY_CONVERSATIONS,
  INITIAL_STUDENT_CONVERSATIONS,
  INITIAL_FACULTY_NOTIFICATIONS,
  INITIAL_STUDENT_NOTIFICATIONS,
  INITIAL_STUDENTS,
} from "./data";

import Login from "./components/Login";
import Layout from "./components/Layout";

import FacultyDashboard from "./faculty/FacultyDashboard";
import FacultySchedule from "./faculty/FacultySchedule";
import FacultyRequests from "./faculty/FacultyRequests";
import FacultyStudents from "./faculty/FacultyStudents";
import FacultyAvailability from "./faculty/FacultyAvailability";
import FacultyMessages from "./faculty/FacultyMessages";
import FacultyHistory from "./faculty/FacultyHistory";
import FacultyNotifications from "./faculty/FacultyNotifications";
import FacultyProfile from "./faculty/FacultyProfile";

import StudentDashboard from "./student/StudentDashboard";
import StudentRequestForm from "./student/StudentRequestForm";
import StudentConsultations from "./student/StudentConsultations";
import StudentMessages from "./student/StudentMessages";
import StudentNotifications from "./student/StudentNotifications";
import StudentProfile from "./student/StudentProfile";

export default function App() {
  const [view, setView] = useState<ViewType>("login");
  const [role, setRole] = useState<"faculty" | "student" | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Apply theme to body/html
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  
  // Backend State
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [schedule] = useState(INITIAL_SCHEDULE);
  const [facultyConversations, setFacultyConversations] = useState(INITIAL_FACULTY_CONVERSATIONS);
  const [studentConversations, setStudentConversations] = useState(INITIAL_STUDENT_CONVERSATIONS);
  const [facultyNotifications, setFacultyNotifications] = useState(INITIAL_FACULTY_NOTIFICATIONS);
  const [studentNotifications, setStudentNotifications] = useState(INITIAL_STUDENT_NOTIFICATIONS);
  const [students] = useState(INITIAL_STUDENTS);
  
  const [selectedFacultyConvId, setSelectedFacultyConvId] = useState<string | null>(null);
  const [selectedStudentConvId, setSelectedStudentConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load Data on Mount
  useEffect(() => {
    if (role) {
      loadData();
    }
  }, [role]);

  const loadData = async () => {
    try {
      const [fetchedRequests, fetchedAvailability] = await Promise.all([
        api.getRequests(),
        api.getAvailability()
      ]);
      setRequests(fetchedRequests);
      setAvailability(fetchedAvailability);
    } catch (e) {
      console.error("Error loading data from mock backend", e);
    } finally {
      setIsDataLoaded(true);
    }
  };

  const handleLogin = (r: "faculty" | "student") => {
    setRole(r);
    setView(r === "faculty" ? "faculty-dashboard" : "student-dashboard");
  };

  const handleLogout = () => {
    setRole(null);
    setView("login");
    setSearchQuery("");
    setIsDataLoaded(false);
  };

  const handleNav = (v: string) => setView(v as ViewType);

  // --- Faculty request actions ---
  const approveRequest = async (id: string) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Approved" } : r));
    await api.updateRequest(id, { status: "Approved" });
    addFacultyNotification("approval", "Request Approved", `You approved the consultation request. The student has been notified.`);
  };

  const declineRequest = async (id: string) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Declined" } : r));
    await api.updateRequest(id, { status: "Declined" });
  };

  const requestInfo = async (id: string, note: string) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Info Requested", facultyNotes: note } : r));
    await api.updateRequest(id, { status: "Info Requested", facultyNotes: note });
  };

  const proposeAlternative = async (id: string, date: string, time: string, note: string) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Alternative Proposed", alternativeDate: date, alternativeTime: time, facultyNotes: note } : r));
    await api.updateRequest(id, { status: "Alternative Proposed", alternativeDate: date, alternativeTime: time, facultyNotes: note });
  };

  const waitlistRequest = async (id: string) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Waitlisted" } : r));
    await api.updateRequest(id, { status: "Waitlisted" });
  };

  const recordOutcome = async (id: string, outcome: string, notes: string) => {
    const completedAt = new Date().toISOString();
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Completed", outcome, facultyNotes: notes, completedAt } : r));
    await api.updateRequest(id, { status: "Completed", outcome, facultyNotes: notes, completedAt });
  };

  // --- Student actions ---
  const submitRequest = async (req: Omit<ConsultationRequest, "id" | "status" | "priorityScore" | "waitDays" | "displacementCount" | "createdAt">) => {
    const newReq = await api.submitRequest(req);
    setRequests(rs => [newReq, ...rs]);
    addFacultyNotification("request", "New Consultation Request", `${req.studentName} (${req.section}) submitted a new consultation request for ${req.subject}.`);
    addStudentNotification("system", "Request Submitted", `Your consultation request for ${req.subject} has been submitted and is in the queue.`);
    handleNav("student-consultations");
  };

  const acceptAlternative = async (id: string) => {
    const targetReq = requests.find(r => r.id === id);
    if (!targetReq) return;
    const date = targetReq.alternativeDate || targetReq.preferredDate;
    const time = targetReq.alternativeTime || targetReq.preferredTime;
    
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Confirmed", preferredDate: date, preferredTime: time } : r));
    await api.updateRequest(id, { status: "Confirmed", preferredDate: date, preferredTime: time });
    addStudentNotification("approval", "Alternative Accepted", "You accepted the alternative schedule. The consultation is now confirmed.");
  };

  const cancelStudentRequest = async (id: string) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Cancelled" } : r));
    await api.updateRequest(id, { status: "Cancelled" });
  };

  // --- Messaging ---
  const sendFacultyMessage = (convId: string, content: string) => {
    const msg: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: "f1",
      senderName: "Dr. Maria Santos",
      content,
      timestamp: new Date().toISOString(),
    };
    setFacultyConversations(cs => cs.map(c => c.id === convId ? { ...c, messages: [...c.messages, msg], lastMessage: content, lastTimestamp: msg.timestamp, unread: 0 } : c));
  };

  const sendStudentMessage = (convId: string, content: string) => {
    const msg: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: "s1",
      senderName: "Juan Dela Cruz",
      content,
      timestamp: new Date().toISOString(),
    };
    setStudentConversations(cs => cs.map(c => c.id === convId ? { ...c, messages: [...c.messages, msg], lastMessage: content, lastTimestamp: msg.timestamp } : c));
  };

  // --- Notifications ---
  const addFacultyNotification = (type: string, title: string, message: string) => {
    setFacultyNotifications(ns => [{
      id: `fn${Date.now()}`,
      type: type as "request",
      title,
      message,
      read: false,
      timestamp: new Date().toISOString(),
    }, ...ns]);
  };

  const addStudentNotification = (type: string, title: string, message: string) => {
    setStudentNotifications(ns => [{
      id: `sn${Date.now()}`,
      type: type as "system",
      title,
      message,
      read: false,
      timestamp: new Date().toISOString(),
    }, ...ns]);
  };

  const markFacultyNotifRead = (id: string) => setFacultyNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllFacultyNotifsRead = () => setFacultyNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markStudentNotifRead = (id: string) => setStudentNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllStudentNotifsRead = () => setStudentNotifications(ns => ns.map(n => ({ ...n, read: true })));

  // --- Availability ---
  const addAvailability = async (slot: Omit<AvailabilitySlot, "id">) => {
    const newSlot = await api.addAvailability(slot);
    setAvailability(as => [...as, newSlot]);
  };
  
  const deleteAvailability = async (id: string) => {
    setAvailability(as => as.filter(a => a.id !== id));
    await api.deleteAvailability(id);
  };
  
  const toggleAvailability = async (id: string) => {
    setAvailability(as => as.map(a => a.id === id ? { ...a, type: a.type === "available" ? "blocked" : "available" } : a));
    await api.toggleAvailability(id);
  };

  // --- Unread counts ---
  const unreadFacultyMessages = facultyConversations.reduce((sum, c) => sum + c.unread, 0);
  const unreadStudentMessages = studentConversations.reduce((sum, c) => sum + c.unread, 0);

  if (view === "login" || !role) {
    return <Login onLogin={handleLogin} />;
  }

  if (!isDataLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center fade-in">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your data...</p>
        </div>
      </div>
    );
  }

  const renderFacultyView = () => {
    switch (view) {
      case "faculty-dashboard":
        return <FacultyDashboard requests={requests} notifications={facultyNotifications} onNav={handleNav} onApprove={approveRequest} onDecline={declineRequest} />;
      case "faculty-schedule":
        return <FacultySchedule schedule={schedule} />;
      case "faculty-requests":
        return <FacultyRequests requests={requests} onApprove={approveRequest} onDecline={declineRequest} onInfoRequest={requestInfo} onProposeAlternative={proposeAlternative} onWaitlist={waitlistRequest} />;
      case "faculty-students":
        return <FacultyStudents students={students} />;
      case "faculty-availability":
        return <FacultyAvailability availability={availability} onAdd={addAvailability} onDelete={deleteAvailability} onToggle={toggleAvailability} />;
      case "faculty-messages":
        return <FacultyMessages conversations={facultyConversations} selectedId={selectedFacultyConvId} onSelect={setSelectedFacultyConvId} onSend={sendFacultyMessage} />;
      case "faculty-history":
        return <FacultyHistory requests={requests} onRecordOutcome={recordOutcome} />;
      case "faculty-notifications":
        return <FacultyNotifications notifications={facultyNotifications} onMarkRead={markFacultyNotifRead} onMarkAllRead={markAllFacultyNotifsRead} />;
      case "faculty-profile":
        return <FacultyProfile />;
      default:
        return <FacultyDashboard requests={requests} notifications={facultyNotifications} onNav={handleNav} onApprove={approveRequest} onDecline={declineRequest} />;
    }
  };

  const renderStudentView = () => {
    switch (view) {
      case "student-dashboard":
        return <StudentDashboard requests={requests} notifications={studentNotifications} onNav={handleNav} />;
      case "student-request":
        return <StudentRequestForm onSubmit={submitRequest} availability={availability} />;
      case "student-consultations":
        return <StudentConsultations requests={requests} onAcceptAlternative={acceptAlternative} onCancelRequest={cancelStudentRequest} onNav={handleNav} />;
      case "student-messages":
        return <StudentMessages conversations={studentConversations} selectedId={selectedStudentConvId} onSelect={setSelectedStudentConvId} onSend={sendStudentMessage} />;
      case "student-notifications":
        return <StudentNotifications notifications={studentNotifications} onMarkRead={markStudentNotifRead} onMarkAllRead={markAllStudentNotifsRead} />;
      case "student-profile":
        return <StudentProfile />;
      default:
        return <StudentDashboard requests={requests} notifications={studentNotifications} onNav={handleNav} />;
    }
  };

  const notifications = role === "faculty" ? facultyNotifications : studentNotifications;
  const unreadMessages = role === "faculty" ? unreadFacultyMessages : unreadStudentMessages;

  return (
    <Layout
      role={role}
      view={view}
      onNav={handleNav}
      notifications={notifications}
      unreadMessages={unreadMessages}
      onLogout={handleLogout}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      theme={theme}
      onToggleTheme={() => setTheme(t => t === "light" ? "dark" : "light")}
    >
      {role === "faculty" ? renderFacultyView() : renderStudentView()}
    </Layout>
  );
}
