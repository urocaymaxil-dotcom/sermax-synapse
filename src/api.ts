import { ConsultationRequest, AvailabilitySlot } from './types';
import { INITIAL_REQUESTS, INITIAL_AVAILABILITY } from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory fallback in case localStorage is blocked by iframe sandboxing
let memoryStorage: Record<string, any> = {};

const getStorage = <T>(key: string, initialData: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  } catch (e) {
    console.warn("localStorage is not available, using in-memory fallback", e);
    if (!memoryStorage[key]) {
      memoryStorage[key] = initialData;
    }
    return memoryStorage[key] as T;
  }
};

const setStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    memoryStorage[key] = data;
  }
};

export const api = {
  // Requests
  getRequests: async (): Promise<ConsultationRequest[]> => {
    await delay(300);
    return getStorage<ConsultationRequest[]>('synapse_requests', INITIAL_REQUESTS);
  },
  
  submitRequest: async (req: Partial<ConsultationRequest>): Promise<ConsultationRequest> => {
    await delay(300);
    const requests = getStorage<ConsultationRequest[]>('synapse_requests', INITIAL_REQUESTS);
    
    const newReq: ConsultationRequest = {
      ...req,
      id: `r${Date.now()}`,
      status: "Pending",
      priorityScore: Math.floor(50 + Math.random() * 40),
      waitDays: 0,
      displacementCount: 0,
      createdAt: new Date().toISOString(),
    } as ConsultationRequest;

    const newRequests = [newReq, ...requests];
    setStorage('synapse_requests', newRequests);
    return newReq;
  },

  updateRequest: async (id: string, updates: Partial<ConsultationRequest>): Promise<void> => {
    await delay(300);
    const requests = getStorage<ConsultationRequest[]>('synapse_requests', INITIAL_REQUESTS);
    const newRequests = requests.map(r => r.id === id ? { ...r, ...updates } : r);
    setStorage('synapse_requests', newRequests);
  },

  // Availability
  getAvailability: async (): Promise<AvailabilitySlot[]> => {
    await delay(300);
    return getStorage<AvailabilitySlot[]>('synapse_availability', INITIAL_AVAILABILITY);
  },

  addAvailability: async (slot: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> => {
    await delay(300);
    const avail = getStorage<AvailabilitySlot[]>('synapse_availability', INITIAL_AVAILABILITY);
    const newSlot: AvailabilitySlot = { ...slot, id: `avail${Date.now()}` } as AvailabilitySlot;
    const newAvail = [...avail, newSlot];
    setStorage('synapse_availability', newAvail);
    return newSlot;
  },

  deleteAvailability: async (id: string): Promise<void> => {
    await delay(300);
    const avail = getStorage<AvailabilitySlot[]>('synapse_availability', INITIAL_AVAILABILITY);
    const newAvail = avail.filter(a => a.id !== id);
    setStorage('synapse_availability', newAvail);
  },
  
  toggleAvailability: async (id: string): Promise<void> => {
    await delay(300);
    const avail = getStorage<AvailabilitySlot[]>('synapse_availability', INITIAL_AVAILABILITY);
    const newAvail = avail.map(a => a.id === id ? { ...a, type: a.type === "available" ? "blocked" : "available" } : a);
    setStorage('synapse_availability', newAvail);
  }
};
