import type {
  ConsultationRequest,
  ScheduleEvent,
  AvailabilitySlot,
  Conversation,
  AppNotification,
  StudentRecord,
} from "./types";

export const FACULTY = {
  id: "f1",
  name: "Dr. Maria Santos",
  title: "Faculty Member",
  department: "College of Information Technology",
  email: "m.santos@unorinc.edu.ph",
  initials: "MS",
};

export const STUDENT = {
  id: "s1",
  name: "Juan Dela Cruz",
  section: "BSCS 2A",
  email: "j.delacruz@student.unorinc.edu.ph",
  initials: "JD",
};

export const INITIAL_REQUESTS: ConsultationRequest[] = [
  {
    id: "r1",
    studentId: "s2",
    studentName: "Miguel Torres",
    section: "BSCS 2A",
    subject: "Data Structures",
    concern: "Project Help",
    description: "I need help understanding binary search trees and how to implement the delete operation for my project. I have been stuck on this for three days and my deadline is approaching.",
    preferredDate: "2026-09-17",
    preferredTime: "14:00",
    duration: 60,
    deadline: "2026-09-20",
    mode: "Online",
    status: "Pending",
    priorityScore: 87,
    waitDays: 3,
    displacementCount: 0,
    createdAt: "2026-09-12T09:15:00",
  },
  {
    id: "r2",
    studentId: "s3",
    studentName: "Ana Lising",
    section: "BSCS 3B",
    subject: "Algorithms",
    concern: "Assignment Guidance",
    description: "I am confused about dynamic programming and memoization. The assignment requires implementing the knapsack problem but I cannot figure out the recurrence relation.",
    preferredDate: "2026-09-18",
    preferredTime: "10:00",
    duration: 60,
    deadline: "2026-09-22",
    mode: "Face-to-Face",
    status: "Pending",
    priorityScore: 74,
    waitDays: 2,
    displacementCount: 0,
    createdAt: "2026-09-13T11:30:00",
  },
  {
    id: "r3",
    studentId: "s4",
    studentName: "Rafael Cruz",
    section: "BSCS 1A",
    subject: "Programming Fundamentals",
    concern: "Lesson Clarification",
    description: "I need clarification on pointers in C. I do not understand the difference between passing by value and passing by reference.",
    preferredDate: "2026-09-19",
    preferredTime: "13:00",
    duration: 30,
    mode: "Online",
    status: "Pending",
    priorityScore: 58,
    waitDays: 1,
    displacementCount: 0,
    createdAt: "2026-09-14T14:00:00",
  },
  {
    id: "r4",
    studentId: "s5",
    studentName: "Carla Mendoza",
    section: "BSCS 4A",
    subject: "Thesis",
    concern: "Thesis / Capstone",
    description: "I need guidance on my thesis methodology chapter. My adviser recommended I consult with you regarding the data collection instrument.",
    preferredDate: "2026-09-16",
    preferredTime: "09:00",
    duration: 90,
    deadline: "2026-09-25",
    mode: "Face-to-Face",
    status: "Waitlisted",
    priorityScore: 92,
    waitDays: 5,
    displacementCount: 1,
    createdAt: "2026-09-10T08:00:00",
  },
  {
    id: "r5",
    studentId: "s6",
    studentName: "Ben Villanueva",
    section: "BSCS 3A",
    subject: "Operating Systems",
    concern: "Exam Review",
    description: "I need help reviewing for the upcoming midterm exam, especially on process scheduling algorithms and memory management.",
    preferredDate: "2026-09-20",
    preferredTime: "15:00",
    duration: 60,
    deadline: "2026-09-23",
    mode: "Online",
    status: "Approved",
    priorityScore: 81,
    waitDays: 4,
    displacementCount: 0,
    createdAt: "2026-09-11T10:30:00",
    facultyNotes: "Approved. Please prepare a list of specific topics you are struggling with.",
  },
  {
    id: "r6",
    studentId: "s1",
    studentName: "Juan Dela Cruz",
    section: "BSCS 2A",
    subject: "Data Structures",
    concern: "Project Help",
    description: "I need assistance with the project clarification for Data Structures - specifically about the linked list implementation requirements.",
    preferredDate: "2026-09-15",
    preferredTime: "08:00",
    duration: 30,
    mode: "Online",
    status: "Completed",
    priorityScore: 65,
    waitDays: 1,
    displacementCount: 0,
    createdAt: "2026-09-08T07:30:00",
    outcome: "Resolved",
    completedAt: "2026-09-15T08:30:00",
    facultyNotes: "Project requirements clarified. Student understands the linked list traversal algorithm now.",
  },
  {
    id: "r7",
    studentId: "s7",
    studentName: "Maria Reyes",
    section: "BSCS 3B",
    subject: "Algorithms",
    concern: "Assignment Guidance",
    description: "Assignment guidance for sorting algorithms comparison — specifically comparing merge sort and quicksort performance.",
    preferredDate: "2026-09-15",
    preferredTime: "09:00",
    duration: 30,
    mode: "Face-to-Face",
    status: "Completed",
    priorityScore: 70,
    waitDays: 2,
    displacementCount: 0,
    createdAt: "2026-09-09T09:00:00",
    outcome: "Resolved",
    completedAt: "2026-09-15T09:30:00",
  },
  {
    id: "r8",
    studentId: "s8",
    studentName: "Kyle Barrera",
    section: "BSCS 2A",
    subject: "Data Structures",
    concern: "Exam Review",
    description: "Midterm exam review for Data Structures covering trees, graphs, and hash tables.",
    preferredDate: "2026-09-15",
    preferredTime: "10:00",
    duration: 30,
    mode: "Online",
    status: "Confirmed",
    priorityScore: 76,
    waitDays: 2,
    displacementCount: 0,
    createdAt: "2026-09-10T11:00:00",
  },
  {
    id: "r9",
    studentId: "s9",
    studentName: "Erika Santos",
    section: "BSCS 1A",
    subject: "Programming Fundamentals",
    concern: "Lesson Clarification",
    description: "Need help with understanding errors and exception handling in C programming.",
    preferredDate: "2026-09-15",
    preferredTime: "15:00",
    duration: 30,
    mode: "Face-to-Face",
    status: "Confirmed",
    priorityScore: 60,
    waitDays: 1,
    displacementCount: 0,
    createdAt: "2026-09-12T13:00:00",
  },
  {
    id: "r10",
    studentId: "s10",
    studentName: "Leo Tan",
    section: "BSCS 4B",
    subject: "Research Methods",
    concern: "Research",
    description: "I need guidance on statistical analysis for my thesis research — specifically on choosing between parametric and non-parametric tests.",
    preferredDate: "2026-09-22",
    preferredTime: "14:00",
    duration: 60,
    deadline: "2026-09-30",
    mode: "Face-to-Face",
    status: "Alternative Proposed",
    priorityScore: 79,
    waitDays: 3,
    displacementCount: 1,
    createdAt: "2026-09-09T15:00:00",
    alternativeDate: "2026-09-24",
    alternativeTime: "10:00",
    facultyNotes: "I am unavailable on Sept 22. Proposing Sept 24 at 10 AM instead.",
  },
];

export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: "e1",
    type: "class",
    title: "Data Structures (BSCS 2A)",
    days: ["Monday", "Wednesday", "Friday"],
    startTime: "07:30",
    endTime: "09:00",
    recurring: true,
    location: "Room 201",
  },
  {
    id: "e2",
    type: "class",
    title: "Algorithms (BSCS 3B)",
    days: ["Tuesday", "Thursday"],
    startTime: "10:00",
    endTime: "11:30",
    recurring: true,
    location: "Room 304",
  },
  {
    id: "e3",
    type: "class",
    title: "Programming Fundamentals (BSCS 1A)",
    days: ["Monday", "Wednesday"],
    startTime: "13:00",
    endTime: "14:30",
    recurring: true,
    location: "Lab 1",
  },
  {
    id: "e4",
    type: "meeting",
    title: "Faculty Meeting",
    days: ["Monday"],
    startTime: "13:00",
    endTime: "14:00",
    recurring: false,
    location: "Conference Room",
  },
  {
    id: "e5",
    type: "consultation",
    title: "Consultation — Juan Dela Cruz",
    days: ["Monday"],
    startTime: "08:00",
    endTime: "08:30",
    recurring: false,
    mode: "Online",
    studentName: "Juan Dela Cruz",
    section: "BSCS 2A",
  },
  {
    id: "e6",
    type: "consultation",
    title: "Consultation — Maria Reyes",
    days: ["Monday"],
    startTime: "09:00",
    endTime: "09:30",
    recurring: false,
    mode: "Face-to-Face",
    studentName: "Maria Reyes",
    section: "BSCS 3B",
  },
  {
    id: "e7",
    type: "consultation",
    title: "Consultation — Kyle Barrera",
    days: ["Monday"],
    startTime: "10:00",
    endTime: "10:30",
    recurring: false,
    mode: "Online",
    studentName: "Kyle Barrera",
    section: "BSCS 2A",
  },
  {
    id: "e8",
    type: "consultation",
    title: "Consultation — Erika Santos",
    days: ["Monday"],
    startTime: "15:00",
    endTime: "15:30",
    recurring: false,
    mode: "Face-to-Face",
    studentName: "Erika Santos",
    section: "BSCS 1A",
  },
  {
    id: "e9",
    type: "blocked",
    title: "Faculty Meeting",
    days: ["Monday"],
    startTime: "13:00",
    endTime: "14:00",
    recurring: false,
    location: "Conference Room A",
  },
];

export const INITIAL_AVAILABILITY: AvailabilitySlot[] = [
  { id: "a1", day: "Monday", startTime: "08:00", endTime: "11:00", type: "available" },
  { id: "a2", day: "Monday", startTime: "14:30", endTime: "17:00", type: "available" },
  { id: "a3", day: "Tuesday", startTime: "08:00", endTime: "10:00", type: "available" },
  { id: "a4", day: "Tuesday", startTime: "12:00", endTime: "16:00", type: "available" },
  { id: "a5", day: "Wednesday", startTime: "09:00", endTime: "12:00", type: "available" },
  { id: "a6", day: "Thursday", startTime: "08:00", endTime: "10:00", type: "available" },
  { id: "a7", day: "Thursday", startTime: "13:00", endTime: "17:00", type: "available" },
  { id: "a8", day: "Friday", startTime: "10:00", endTime: "12:00", type: "available" },
  { id: "a9", day: "Friday", startTime: "14:00", endTime: "16:00", type: "available" },
  { id: "a10", day: "Wednesday", startTime: "14:00", endTime: "15:30", type: "blocked", note: "Department work" },
];

export const INITIAL_FACULTY_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    participantId: "s2",
    participantName: "Miguel Torres",
    participantSection: "BSCS 2A",
    subject: "Data Structures — Project Help",
    consultationId: "r1",
    lastMessage: "Thank you, Dr. Santos! I will prepare my code for the consultation.",
    lastTimestamp: "2026-09-14T16:30:00",
    unread: 1,
    messages: [
      { id: "m1", senderId: "s2", senderName: "Miguel Torres", content: "Good afternoon, Dr. Santos. I submitted a consultation request for my Data Structures project. I am really struggling with the BST delete operation.", timestamp: "2026-09-12T14:00:00" },
      { id: "m2", senderId: "f1", senderName: "Dr. Maria Santos", content: "Hello Miguel, I received your request. Can you share the specific part of the algorithm you are stuck on? That way we can make the most of our consultation time.", timestamp: "2026-09-12T14:45:00" },
      { id: "m3", senderId: "s2", senderName: "Miguel Torres", content: "I understand the base cases for leaf nodes and nodes with one child, but the case with two children confuses me especially finding the in-order successor.", timestamp: "2026-09-13T09:00:00" },
      { id: "m4", senderId: "f1", senderName: "Dr. Maria Santos", content: "That is a common difficulty. The in-order successor is the leftmost node in the right subtree. Bring your implementation and we will trace through it together.", timestamp: "2026-09-13T10:30:00" },
      { id: "m5", senderId: "s2", senderName: "Miguel Torres", content: "Thank you, Dr. Santos! I will prepare my code for the consultation.", timestamp: "2026-09-14T16:30:00" },
    ],
  },
  {
    id: "c2",
    participantId: "s5",
    participantName: "Ben Villanueva",
    participantSection: "BSCS 3A",
    subject: "Operating Systems — Exam Review",
    consultationId: "r5",
    lastMessage: "I have prepared the list. See you on the 20th!",
    lastTimestamp: "2026-09-13T11:00:00",
    unread: 0,
    messages: [
      { id: "m6", senderId: "f1", senderName: "Dr. Maria Santos", content: "Your consultation request has been approved for September 20 at 3 PM. Please prepare a list of specific topics you need help with.", timestamp: "2026-09-12T09:00:00" },
      { id: "m7", senderId: "s5", senderName: "Ben Villanueva", content: "Thank you Dr. Santos. I will focus on Round Robin, Priority Scheduling, and page replacement algorithms.", timestamp: "2026-09-12T10:00:00" },
      { id: "m8", senderId: "f1", senderName: "Dr. Maria Santos", content: "Good choices. Also review memory segmentation vs. paging. See you then.", timestamp: "2026-09-12T10:30:00" },
      { id: "m9", senderId: "s5", senderName: "Ben Villanueva", content: "I have prepared the list. See you on the 20th!", timestamp: "2026-09-13T11:00:00" },
    ],
  },
  {
    id: "c3",
    participantId: "s10",
    participantName: "Leo Tan",
    participantSection: "BSCS 4B",
    subject: "Research Methods — Alternative Schedule",
    consultationId: "r10",
    lastMessage: "Sept 24 at 10 AM works for me. Thank you!",
    lastTimestamp: "2026-09-14T08:00:00",
    unread: 0,
    messages: [
      { id: "m10", senderId: "f1", senderName: "Dr. Maria Santos", content: "Hi Leo, I am sorry but I have a conflict on September 22. I am proposing September 24 at 10 AM instead. Would that work for you?", timestamp: "2026-09-13T16:00:00" },
      { id: "m11", senderId: "s10", senderName: "Leo Tan", content: "Sept 24 at 10 AM works for me. Thank you!", timestamp: "2026-09-14T08:00:00" },
    ],
  },
];

export const INITIAL_STUDENT_CONVERSATIONS: Conversation[] = [
  {
    id: "sc1",
    participantId: "f1",
    participantName: "Dr. Maria Santos",
    subject: "Data Structures — Project Help (r6)",
    consultationId: "r6",
    lastMessage: "Project requirements clarified. Good luck with your implementation!",
    lastTimestamp: "2026-09-15T08:35:00",
    unread: 0,
    messages: [
      { id: "sm1", senderId: "s1", senderName: "Juan Dela Cruz", content: "Good morning Dr. Santos. I submitted a consultation request for the Data Structures project. I need clarification on the linked list requirements.", timestamp: "2026-09-08T08:00:00" },
      { id: "sm2", senderId: "f1", senderName: "Dr. Maria Santos", content: "Good morning Juan. Your request is approved. Please bring your current implementation to the consultation.", timestamp: "2026-09-09T09:00:00" },
      { id: "sm3", senderId: "s1", senderName: "Juan Dela Cruz", content: "Thank you Dr. Santos! I will prepare my code.", timestamp: "2026-09-09T09:30:00" },
      { id: "sm4", senderId: "f1", senderName: "Dr. Maria Santos", content: "Project requirements clarified. Good luck with your implementation!", timestamp: "2026-09-15T08:35:00" },
    ],
  },
];

export const INITIAL_FACULTY_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", type: "request", title: "New Consultation Request", message: "Miguel Torres (BSCS 2A) submitted a new consultation request for Data Structures.", read: false, timestamp: "2026-09-12T09:15:00" },
  { id: "n2", type: "request", title: "New Consultation Request", message: "Ana Lising (BSCS 3B) submitted a new consultation request for Algorithms.", read: false, timestamp: "2026-09-13T11:30:00" },
  { id: "n3", type: "request", title: "New Consultation Request", message: "Rafael Cruz (BSCS 1A) submitted a new consultation request for Programming Fundamentals.", read: false, timestamp: "2026-09-14T14:00:00" },
  { id: "n4", type: "reminder", title: "Consultation Reminder", message: "You have a consultation with Kyle Barrera today at 10:00 AM (Online).", read: true, timestamp: "2026-09-15T07:00:00" },
  { id: "n5", type: "reminder", title: "Consultation Reminder", message: "Upcoming consultation: Erika Santos at 3:00 PM today (Face-to-Face).", read: true, timestamp: "2026-09-15T07:00:00" },
  { id: "n6", type: "system", title: "Capstone Consultation Deadline", message: "3 days remaining before the Capstone Project Consultation deadline (Sept 18, 2026).", read: false, timestamp: "2026-09-15T06:00:00" },
  { id: "n7", type: "reschedule", title: "Schedule Conflict Detected", message: "A schedule change may affect Carla Mendoza's consultation on Sept 16. Please review.", read: false, timestamp: "2026-09-14T17:00:00" },
  { id: "n8", type: "alternative", title: "Student Accepted Alternative", message: "Leo Tan accepted the alternative schedule for Sept 24 at 10 AM.", read: true, timestamp: "2026-09-14T08:00:00" },
];

export const INITIAL_STUDENT_NOTIFICATIONS: AppNotification[] = [
  { id: "sn1", type: "approval", title: "Consultation Approved", message: "Your consultation request for Data Structures has been completed. Outcome: Resolved.", read: false, timestamp: "2026-09-15T08:35:00" },
  { id: "sn2", type: "reminder", title: "Consultation Completed", message: "Your consultation session with Dr. Maria Santos has ended. Please check the consultation history.", read: true, timestamp: "2026-09-15T08:30:00" },
  { id: "sn3", type: "system", title: "Welcome to SerMax SYNAPSE", message: "Your account has been activated. You can now submit consultation requests to faculty members.", read: true, timestamp: "2026-09-01T08:00:00" },
];

export const INITIAL_STUDENTS: StudentRecord[] = [
  { id: "s2", name: "Miguel Torres", section: "BSCS 2A", email: "m.torres@student.unorinc.edu.ph", totalConsultations: 3, pendingRequests: 1, lastConsultation: "2026-09-01", subjects: ["Data Structures"] },
  { id: "s3", name: "Ana Lising", section: "BSCS 3B", email: "a.lising@student.unorinc.edu.ph", totalConsultations: 5, pendingRequests: 1, lastConsultation: "2026-08-28", subjects: ["Algorithms"] },
  { id: "s4", name: "Rafael Cruz", section: "BSCS 1A", email: "r.cruz@student.unorinc.edu.ph", totalConsultations: 1, pendingRequests: 1, lastConsultation: undefined, subjects: ["Programming Fundamentals"] },
  { id: "s5", name: "Ben Villanueva", section: "BSCS 3A", email: "b.villanueva@student.unorinc.edu.ph", totalConsultations: 4, pendingRequests: 0, lastConsultation: "2026-08-20", subjects: ["Operating Systems"] },
  { id: "s6", name: "Carla Mendoza", section: "BSCS 4A", email: "c.mendoza@student.unorinc.edu.ph", totalConsultations: 8, pendingRequests: 1, lastConsultation: "2026-09-05", subjects: ["Thesis"] },
  { id: "s7", name: "Maria Reyes", section: "BSCS 3B", email: "m.reyes@student.unorinc.edu.ph", totalConsultations: 6, pendingRequests: 0, lastConsultation: "2026-09-15", subjects: ["Algorithms"] },
  { id: "s8", name: "Kyle Barrera", section: "BSCS 2A", email: "k.barrera@student.unorinc.edu.ph", totalConsultations: 2, pendingRequests: 0, lastConsultation: "2026-09-15", subjects: ["Data Structures"] },
  { id: "s9", name: "Erika Santos", section: "BSCS 1A", email: "e.santos@student.unorinc.edu.ph", totalConsultations: 1, pendingRequests: 0, lastConsultation: "2026-09-15", subjects: ["Programming Fundamentals"] },
  { id: "s10", name: "Leo Tan", section: "BSCS 4B", email: "l.tan@student.unorinc.edu.ph", totalConsultations: 7, pendingRequests: 0, lastConsultation: "2026-09-05", subjects: ["Research Methods"] },
  { id: "s1", name: "Juan Dela Cruz", section: "BSCS 2A", email: "j.delacruz@student.unorinc.edu.ph", totalConsultations: 1, pendingRequests: 0, lastConsultation: "2026-09-15", subjects: ["Data Structures"] },
];

export const UPCOMING_DEADLINES = [
  { title: "Capstone Consultation Deadline", date: "Sep 18, 2026", daysLeft: 3, color: "red" },
  { title: "Midterm Exam Review Requests", date: "Sep 21, 2026", daysLeft: 6, color: "yellow" },
  { title: "Advising Period Ends", date: "Sep 28, 2026", daysLeft: 13, color: "blue" },
];

export const QUOTES = [
  { text: "Education is not just about answers, but about better questions.", author: "Unknown" },
  { text: "The goal of education is not to increase the amount of knowledge but to create the possibilities for a child to invent and discover.", author: "Jean Piaget" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
];

export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatTimestamp(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export function getStatusClass(status: string) {
  const map: Record<string, string> = {
    "Pending": "status-pending",
    "Approved": "status-approved",
    "Confirmed": "status-confirmed",
    "Declined": "status-declined",
    "Waitlisted": "status-waitlisted",
    "Completed": "status-completed",
    "Cancelled": "status-cancelled",
    "Info Requested": "status-info",
    "Alternative Proposed": "status-alternative",
    "No-show": "status-noshow",
  };
  return map[status] || "status-pending";
}

export function getPriorityLabel(score: number) {
  if (score >= 80) return { label: "High", cls: "priority-high" };
  if (score >= 60) return { label: "Medium", cls: "priority-medium" };
  return { label: "Low", cls: "priority-low" };
}

export const CONCERN_TYPES = [
  "Lesson Clarification",
  "Assignment Guidance",
  "Exam Review",
  "Grade Concern",
  "Project Help",
  "Thesis / Capstone",
  "Research",
  "Academic Advising",
  "Other",
];

export const SUBJECTS = [
  "Data Structures",
  "Algorithms",
  "Programming Fundamentals",
  "Operating Systems",
  "Database Management",
  "Software Engineering",
  "Computer Networks",
  "Research Methods",
  "Thesis",
  "Capstone Project",
];

export const TODAY_WEEKDAY = "Monday";

export const TODAYS_EVENTS = [
  { time: "8:00 AM", endTime: "8:30 AM", type: "consultation" as const, label: "Consultation", student: "Juan Dela Cruz (BSCS 2A)", topic: "Data Structures – Project Clarification", mode: "Online" as const },
  { time: "9:00 AM", endTime: "9:30 AM", type: "consultation" as const, label: "Consultation", student: "Maria Reyes (BSCS 3B)", topic: "Algorithms – Assignment Guidance", mode: "Face-to-Face" as const },
  { time: "10:00 AM", endTime: "10:30 AM", type: "consultation" as const, label: "Consultation", student: "Kyle Barrera (BSCS 2A)", topic: "Data Structures – Exam Review", mode: "Online" as const },
  { time: "1:00 PM", endTime: "2:00 PM", type: "blocked" as const, label: "Blocked Time", student: "Faculty Meeting", topic: "", mode: undefined },
  { time: "3:00 PM", endTime: "3:30 PM", type: "consultation" as const, label: "Consultation", student: "Erika Santos (BSCS 1A)", topic: "Programming Fundamentals – Errors", mode: "Face-to-Face" as const },
];
