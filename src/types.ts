export type ViewType =
  | "login"
  | "faculty-dashboard"
  | "faculty-schedule"
  | "faculty-requests"
  | "faculty-students"
  | "faculty-availability"
  | "faculty-messages"
  | "faculty-history"
  | "faculty-notifications"
  | "faculty-profile"
  | "student-dashboard"
  | "student-request"
  | "student-consultations"
  | "student-messages"
  | "student-notifications"
  | "student-profile";

export type ConsultationStatus =
  | "Pending"
  | "Approved"
  | "Declined"
  | "Info Requested"
  | "Alternative Proposed"
  | "Confirmed"
  | "Waitlisted"
  | "Completed"
  | "Cancelled"
  | "No-show";

export type ConsultationMode = "Online" | "Face-to-Face";

export type ConcernType =
  | "Lesson Clarification"
  | "Assignment Guidance"
  | "Exam Review"
  | "Grade Concern"
  | "Project Help"
  | "Thesis / Capstone"
  | "Research"
  | "Academic Advising"
  | "Other";

export type EventType = "class" | "meeting" | "blocked" | "consultation" | "availability";

export interface ConsultationRequest {
  id: string;
  studentId: string;
  studentName: string;
  section: string;
  subject: string;
  concern: ConcernType;
  description: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  deadline?: string;
  mode: ConsultationMode;
  status: ConsultationStatus;
  priorityScore: number;
  waitDays: number;
  displacementCount: number;
  createdAt: string;
  facultyNotes?: string;
  alternativeDate?: string;
  alternativeTime?: string;
  outcome?: string;
  completedAt?: string;
}

export interface ScheduleEvent {
  id: string;
  type: EventType;
  title: string;
  days: string[];
  startTime: string;
  endTime: string;
  recurring: boolean;
  location?: string;
  mode?: ConsultationMode;
  studentName?: string;
  section?: string;
}

export interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  type: "available" | "blocked";
  note?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantSection?: string;
  subject: string;
  consultationId?: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: number;
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  type: "request" | "approval" | "decline" | "info" | "alternative" | "reminder" | "reschedule" | "system";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  section: string;
  email: string;
  totalConsultations: number;
  pendingRequests: number;
  lastConsultation?: string;
  subjects: string[];
}

export interface AppState {
  view: ViewType;
  role: "faculty" | "student" | null;
  requests: ConsultationRequest[];
  schedule: ScheduleEvent[];
  availability: AvailabilitySlot[];
  facultyConversations: Conversation[];
  studentConversations: Conversation[];
  facultyNotifications: AppNotification[];
  studentNotifications: AppNotification[];
  students: StudentRecord[];
  selectedConversationId: string | null;
  selectedRequestId: string | null;
}
