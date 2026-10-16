export type Role = 'student' | 'admin';
export type Section = 'overview' | 'complaints' | 'rooms' | 'mess' | 'announcements';
export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high';
export type ComplaintCategory = 'maintenance' | 'cleanliness' | 'electricity' | 'mess' | 'other';
export type AnnouncementLabel = 'notice' | 'event' | 'maintenance' | 'urgent';
export type ActivityType = 'complaint' | 'room' | 'notice' | 'feedback';

export interface HostelSession {
  role: Role;
  studentId?: string;
  displayName: string;
}

export interface ComplaintUpdate {
  id: string;
  status: ComplaintStatus;
  note: string;
  actor: 'student' | 'admin';
  at: string;
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  course: string;
  year: string;
  roomId: string;
}

export interface Room {
  id: string;
  block: string;
  floor: number;
  number: string;
  capacity: number;
  occupantIds: string[];
  type: 'double' | 'triple';
}

export interface Complaint {
  id: string;
  studentId: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  dueAt?: string;
  timeline?: ComplaintUpdate[];
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  label: AnnouncementLabel;
  publishedAt: string;
  expiresAt?: string;
}

export interface MealPlan {
  id: string;
  day: string;
  date: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface Feedback {
  id: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface HostelState {
  students: Student[];
  rooms: Room[];
  complaints: Complaint[];
  announcements: Announcement[];
  meals: MealPlan[];
  feedback: Feedback[];
  activities: Activity[];
}

export const storageKeys = {
  state: 'hostelhub:state',
  version: 'hostelhub:version',
  session: 'hostelhub:session',
} as const;

export function isHostelState(value: unknown): value is HostelState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<HostelState>;
  return Array.isArray(candidate.students)
    && candidate.students.length > 0
    && Array.isArray(candidate.rooms)
    && candidate.rooms.length > 0
    && Array.isArray(candidate.complaints)
    && Array.isArray(candidate.announcements)
    && Array.isArray(candidate.meals)
    && Array.isArray(candidate.feedback)
    && Array.isArray(candidate.activities);
}

export function getFeedbackAverage(feedback: Feedback[]) {
  if (!feedback.length) return null;
  return Math.round((feedback.reduce((total, item) => total + item.rating, 0) / feedback.length) * 10) / 10;
}

export function getSeedState(): HostelState {
  return {
    students: [
      { id: 'student-aanya', name: 'Aanya Mehta', initials: 'AM', course: 'Computer Science', year: '3rd year', roomId: 'room-a-204' },
      { id: 'student-kabir', name: 'Kabir Singh', initials: 'KS', course: 'Mechanical Engineering', year: '2nd year', roomId: 'room-a-204' },
      { id: 'student-isha', name: 'Isha Verma', initials: 'IV', course: 'Electrical Engineering', year: '4th year', roomId: 'room-b-112' },
      { id: 'student-zoya', name: 'Zoya Khan', initials: 'ZK', course: 'Civil Engineering', year: '1st year', roomId: 'room-b-112' },
      { id: 'student-vihaan', name: 'Vihaan Rao', initials: 'VR', course: 'Chemical Engineering', year: '3rd year', roomId: 'room-c-018' },
    ],
    rooms: [
      { id: 'room-a-204', block: 'A Block', floor: 2, number: '204', capacity: 3, occupantIds: ['student-aanya', 'student-kabir'], type: 'triple' },
      { id: 'room-a-205', block: 'A Block', floor: 2, number: '205', capacity: 3, occupantIds: [], type: 'triple' },
      { id: 'room-b-112', block: 'B Block', floor: 1, number: '112', capacity: 2, occupantIds: ['student-isha', 'student-zoya'], type: 'double' },
      { id: 'room-c-018', block: 'C Block', floor: 0, number: '018', capacity: 2, occupantIds: ['student-vihaan'], type: 'double' },
      { id: 'room-c-019', block: 'C Block', floor: 0, number: '019', capacity: 2, occupantIds: [], type: 'double' },
    ],
    complaints: [
      { id: 'complaint-1', studentId: 'student-aanya', category: 'maintenance', title: 'Study lamp flickering', description: 'The desk lamp has been flickering since last evening.', priority: 'medium', status: 'in-progress', createdAt: '2026-10-15T09:30:00.000Z', updatedAt: '2026-10-16T08:20:00.000Z', dueAt: '2026-10-18T08:20:00.000Z', timeline: [{ id: 'update-1a', status: 'pending', note: 'Request submitted from Room 204.', actor: 'student', at: '2026-10-15T09:30:00.000Z' }, { id: 'update-1b', status: 'in-progress', note: 'Maintenance team assigned to A Block.', actor: 'admin', at: '2026-10-16T08:20:00.000Z' }] },
      { id: 'complaint-2', studentId: 'student-kabir', category: 'mess', title: 'Breakfast timing feedback', description: 'Requesting a ten-minute extension on busy lab days.', priority: 'low', status: 'pending', createdAt: '2026-10-16T06:45:00.000Z', updatedAt: '2026-10-16T06:45:00.000Z', dueAt: '2026-10-17T06:45:00.000Z', timeline: [{ id: 'update-2a', status: 'pending', note: 'Request submitted from A Block.', actor: 'student', at: '2026-10-16T06:45:00.000Z' }] },
      { id: 'complaint-3', studentId: 'student-isha', category: 'cleanliness', title: 'Common room needs attention', description: 'The common room floor needs cleaning before the evening study rush.', priority: 'high', status: 'resolved', createdAt: '2026-10-13T14:10:00.000Z', updatedAt: '2026-10-14T10:00:00.000Z', dueAt: '2026-10-15T10:00:00.000Z', timeline: [{ id: 'update-3a', status: 'pending', note: 'Request submitted from B Block.', actor: 'student', at: '2026-10-13T14:10:00.000Z' }, { id: 'update-3b', status: 'in-progress', note: 'Housekeeping team notified.', actor: 'admin', at: '2026-10-13T16:25:00.000Z' }, { id: 'update-3c', status: 'resolved', note: 'Common room cleaned and checked by the floor warden.', actor: 'admin', at: '2026-10-14T10:00:00.000Z' }] },
    ],
    announcements: [
      { id: 'announcement-1', title: 'Quiet hours start at 10:30 PM', body: 'Keep corridors calm after the evening study bell so every block can rest well.', label: 'notice', publishedAt: 'Today' },
      { id: 'announcement-2', title: 'Water tank maintenance · Saturday', body: 'B Block water supply will pause between 11:00 AM and 1:00 PM this Saturday.', label: 'maintenance', publishedAt: 'Yesterday' },
      { id: 'announcement-3', title: 'Inter-hostel badminton registrations', body: 'Build your doubles pair and register at the recreation desk before Friday.', label: 'event', publishedAt: 'Oct 14' },
    ],
    meals: [
      { id: 'meal-mon', day: 'Mon', date: 'Oct 19', breakfast: 'Poha, banana & chai', lunch: 'Dal tadka, rice & salad', snacks: 'Lemon tea & biscuits', dinner: 'Paneer tikka, roti & raita' },
      { id: 'meal-tue', day: 'Tue', date: 'Oct 20', breakfast: 'Aloo paratha & curd', lunch: 'Rajma, jeera rice & salad', snacks: 'Sprouts chaat', dinner: 'Veg noodles & manchurian' },
      { id: 'meal-wed', day: 'Wed', date: 'Oct 21', breakfast: 'Idli, sambar & chutney', lunch: 'Chole, roti & onion salad', snacks: 'Fruit bowl', dinner: 'Egg curry, rice & seasonal veg' },
      { id: 'meal-thu', day: 'Thu', date: 'Oct 22', breakfast: 'Upma, toast & chai', lunch: 'Kadhi, rice & papad', snacks: 'Corn cups', dinner: 'Masala dosa & coconut chutney' },
      { id: 'meal-fri', day: 'Fri', date: 'Oct 23', breakfast: 'Stuffed sandwich & milk', lunch: 'Veg biryani & raita', snacks: 'Samosa & tea', dinner: 'Dal makhani, roti & kheer' },
    ],
    feedback: [
      { id: 'feedback-seed-1', studentId: 'student-isha', rating: 5, comment: 'The paneer dinner was a hit.', createdAt: '2026-10-16T19:20:00.000Z' },
      { id: 'feedback-seed-2', studentId: 'student-kabir', rating: 4, comment: 'Good variety this week.', createdAt: '2026-10-16T18:10:00.000Z' },
      { id: 'feedback-seed-3', studentId: 'student-zoya', rating: 5, comment: 'Breakfast was fresh today.', createdAt: '2026-10-16T08:20:00.000Z' },
    ],
    activities: [
      { id: 'activity-1', type: 'complaint', title: 'Study lamp updated', detail: 'Aanya · A-204', at: '2026-10-16T08:20:00.000Z' },
      { id: 'activity-2', type: 'room', title: 'Room B-112 checked', detail: '2 of 2 beds occupied', at: '2026-10-16T07:45:00.000Z' },
      { id: 'activity-3', type: 'feedback', title: 'New mess rating', detail: 'Zoya gave breakfast 5/5', at: '2026-10-16T08:20:00.000Z' },
      { id: 'activity-4', type: 'notice', title: 'Water work notice posted', detail: 'B Block · Saturday', at: '2026-10-15T11:00:00.000Z' },
    ],
  };
}

export function getOccupancy(rooms: Room[]) {
  const occupied = rooms.reduce((total, room) => total + room.occupantIds.length, 0);
  const capacity = rooms.reduce((total, room) => total + room.capacity, 0);
  return { occupied, capacity, vacant: capacity - occupied, percent: Math.round((occupied / capacity) * 100) };
}

export function isComplaintOverdue(complaint: Complaint, now = new Date()) {
  return complaint.status !== 'resolved' && Boolean(complaint.dueAt && new Date(complaint.dueAt) < now);
}

export function addActivity(state: HostelState, activity: Activity): HostelState {
  return { ...state, activities: [activity, ...state.activities].slice(0, 20) };
}

export function updateComplaintStatus(state: HostelState, complaintId: string, status: ComplaintStatus, note = '', updatedAt = new Date().toISOString()): HostelState {
  const nextState = {
    ...state,
    complaints: state.complaints.map((complaint) => complaint.id === complaintId ? {
      ...complaint,
      status,
      updatedAt,
      timeline: [...(complaint.timeline ?? []), { id: `update-${Date.now()}`, status, note: note.trim() || `Status changed to ${status.replace('-', ' ')}.`, actor: 'admin' as const, at: updatedAt }],
    } : complaint),
  };
  const complaint = state.complaints.find((item) => item.id === complaintId);
  return complaint ? addActivity(nextState, { id: `activity-${Date.now()}`, type: 'complaint', title: `Complaint ${status.replace('-', ' ')}`, detail: complaint.title, at: updatedAt }) : nextState;
}

export function addAnnouncement(state: HostelState, announcement: Announcement): HostelState {
  return addActivity({ ...state, announcements: [announcement, ...state.announcements] }, { id: `activity-${Date.now()}`, type: 'notice', title: 'New notice published', detail: announcement.title, at: new Date().toISOString() });
}

export function addComplaint(state: HostelState, complaint: Complaint): HostelState {
  return addActivity({ ...state, complaints: [complaint, ...state.complaints] }, { id: `activity-${Date.now()}`, type: 'complaint', title: 'New complaint submitted', detail: complaint.title, at: complaint.createdAt });
}

export function allocateStudent(state: HostelState, roomId: string, studentId: string): HostelState {
  const student = state.students.find((candidate) => candidate.id === studentId);
  const target = state.rooms.find((room) => room.id === roomId);
  if (!student || !target || target.occupantIds.length >= target.capacity) return state;

  return addActivity({
    ...state,
    students: state.students.map((candidate) => candidate.id === studentId ? { ...candidate, roomId } : candidate),
    rooms: state.rooms.map((room) => ({
      ...room,
      occupantIds: room.id === roomId
        ? [...room.occupantIds.filter((id) => id !== studentId), studentId]
        : room.occupantIds.filter((id) => id !== studentId),
    })),
  }, { id: `activity-${Date.now()}`, type: 'room', title: 'Room allocation updated', detail: `${target.block} · Room ${target.number}`, at: new Date().toISOString() });
}
