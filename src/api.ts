import { ConsultationRequest, ScheduleEvent } from './types';

const ENV_URL = import.meta.env.VITE_API_URL;
const API_BASE = ENV_URL ? `${ENV_URL}/api` : 'http://localhost:3001/api';

export const api = {
  // Requests
  getRequests: async (): Promise<ConsultationRequest[]> => {
    const res = await fetch(`${API_BASE}/requests`);
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },
  
  submitRequest: async (req: Partial<ConsultationRequest>): Promise<ConsultationRequest> => {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error('Failed to submit request');
    return res.json();
  },

  updateRequest: async (id: string, updates: Partial<ConsultationRequest>): Promise<void> => {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update request');
  },

  // Schedule
  getSchedule: async (): Promise<ScheduleEvent[]> => {
    const res = await fetch(`${API_BASE}/schedule`);
    if (!res.ok) throw new Error('Failed to fetch schedule');
    return res.json();
  },

  addScheduleEvent: async (event: Partial<ScheduleEvent>): Promise<ScheduleEvent> => {
    const res = await fetch(`${API_BASE}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Failed to add schedule event');
    return res.json();
  },

  updateScheduleEvent: async (id: string, updates: Partial<ScheduleEvent>): Promise<void> => {
    const res = await fetch(`${API_BASE}/schedule/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update schedule event');
  },

  deleteScheduleEvent: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/schedule/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete schedule event');
  }
};
