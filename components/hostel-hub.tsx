'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  addComplaint,
  addAnnouncement,
  addActivity,
  Announcement,
  allocateStudent,
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
  getOccupancy,
  getFeedbackAverage,
  isComplaintOverdue,
  getSeedState,
  HostelState,
  HostelSession,
  isHostelState,
  Role,
  Section,
  storageKeys,
  updateComplaintStatus,
} from '@/lib/hostel-data';
import { Icon, IconName } from '@/components/ui/icon';

const navItems: { id: Section; label: string; glyph: IconName }[] = [
  { id: 'overview', label: 'Overview', glyph: 'spark' },
  { id: 'complaints', label: 'Complaints', glyph: 'complaint' },
  { id: 'rooms', label: 'Rooms', glyph: 'room' },
  { id: 'mess', label: 'Mess menu', glyph: 'meal' },
  { id: 'announcements', label: 'Notices', glyph: 'notice' },
];

const categoryLabels: Record<ComplaintCategory, string> = {
  maintenance: 'Maintenance',
  cleanliness: 'Cleanliness',
  electricity: 'Electricity',
  mess: 'Mess',
  other: 'Other',
};

const statusLabels: Record<ComplaintStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In progress',
  resolved: 'Resolved',
};

type RoomFilter = 'all' | 'available' | 'full';
type AllocationRequest = { roomId: string; studentId: string };
type SearchResult = { type: 'student' | 'room' | 'complaint' | 'notice'; id: string; title: string; detail: string };

function shortDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(value));
}

function getStudentName(state: HostelState, id: string) {
  return state.students.find((student) => student.id === id)?.name ?? 'Unknown student';
}

function MetricCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: string }) {
  return (
    <article className={`metric-card ${accent}`}>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      <span className="metric-detail">{detail}</span>
    </article>
  );
}

function StatusBadge({ status }: { status: ComplaintStatus }) {
  return <span className={`status-badge status-${status}`}>{statusLabels[status]}</span>;
}

function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  return <span className={`priority-badge priority-${priority}`}>{priority} priority</span>;
}

export default function HostelHub() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('student');
  const [section, setSection] = useState<Section>('overview');
  const [data, setData] = useState<HostelState>(() => getSeedState());
  const [hydrated, setHydrated] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [mealIndex, setMealIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');
  const [roomSearch, setRoomSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ComplaintCategory>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'overdue'>('all');
  const [allocationRequest, setAllocationRequest] = useState<AllocationRequest | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [session, setSession] = useState<HostelSession>({ role: 'student', studentId: 'student-aanya', displayName: 'Aanya Mehta' });
  const [sessionChecked, setSessionChecked] = useState(false);

  const currentStudent = data.students.find((student) => student.id === session.studentId) ?? data.students[0];
  const occupancy = useMemo(() => getOccupancy(data.rooms), [data.rooms]);
  const myRoom = data.rooms.find((room) => room.id === currentStudent.roomId);
  const myComplaints = data.complaints.filter((complaint) => complaint.studentId === currentStudent.id);
  const openComplaints = data.complaints.filter((complaint) => complaint.status !== 'resolved');
  const activeMeal = data.meals[mealIndex] ?? data.meals[0];
  const feedbackAverage = getFeedbackAverage(data.feedback);
  const activeComplaint = selectedComplaint ? data.complaints.find((complaint) => complaint.id === selectedComplaint.id) ?? selectedComplaint : null;
  const allocationRoom = allocationRequest ? data.rooms.find((room) => room.id === allocationRequest.roomId) : null;
  const allocationStudent = allocationRequest ? data.students.find((student) => student.id === allocationRequest.studentId) : null;
  const searchResults = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    if (!query) return [];
    return [
      ...data.students.filter((student) => `${student.name} ${student.course} ${student.roomId}`.toLowerCase().includes(query)).map((student) => ({ type: 'student' as const, id: student.id, title: student.name, detail: `Student · Room ${student.roomId.replace('room-', '').replaceAll('-', ' ')}` })),
      ...data.rooms.filter((room) => `${room.block} ${room.number}`.toLowerCase().includes(query)).map((room) => ({ type: 'room' as const, id: room.id, title: `${room.block} · ${room.number}`, detail: `${room.occupantIds.length}/${room.capacity} beds occupied` })),
      ...data.complaints.filter((complaint) => complaint.title.toLowerCase().includes(query)).map((complaint) => ({ type: 'complaint' as const, id: complaint.id, title: complaint.title, detail: `Complaint · ${statusLabels[complaint.status]}` })),
      ...data.announcements.filter((announcement) => `${announcement.title} ${announcement.body}`.toLowerCase().includes(query)).map((announcement) => ({ type: 'notice' as const, id: announcement.id, title: announcement.title, detail: `Notice · ${announcement.publishedAt}` })),
    ].slice(0, 7);
  }, [data, globalSearch]);

  useEffect(() => {
    let hasSession = false;
    try {
      const savedState = window.localStorage.getItem(storageKeys.state);
      const savedSession = window.localStorage.getItem(storageKeys.session);
      hasSession = Boolean(savedSession);
      if (savedSession) {
        const parsedSession: unknown = JSON.parse(savedSession);
        if (parsedSession && typeof parsedSession === 'object' && 'role' in parsedSession && (parsedSession.role === 'student' || parsedSession.role === 'admin')) {
          const nextSession = parsedSession as HostelSession;
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSession(nextSession);
          setRole(nextSession.role);
        }
      }
      if (savedState) {
        const parsed: unknown = JSON.parse(savedState);
        if (isHostelState(parsed)) {
          setData(parsed);
        } else {
          setNotice('Saved data was incomplete. Fresh data is being used.');
        }
      }
    } catch {
      setNotice('Data could not be loaded. Fresh data is being used.');
    } finally {
      setHydrated(true);
      if (!hasSession) router.replace('/login');
      setSessionChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKeys.state, JSON.stringify(data));
      window.localStorage.setItem(storageKeys.version, '1');
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotice('The latest change could not be saved.');
    }
  }, [data, hydrated]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const modalOpen = Boolean(showComplaintForm || activeComplaint || selectedAnnouncement || showAnnouncementForm || allocationRequest || showResetConfirm);
    if (!modalOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setShowComplaintForm(false);
      setSelectedComplaint(null);
      setSelectedAnnouncement(null);
      setShowAnnouncementForm(false);
      setAllocationRequest(null);
      setShowResetConfirm(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showComplaintForm, activeComplaint, selectedAnnouncement, showAnnouncementForm, allocationRequest, showResetConfirm]);

  function showNotice(message: string) {
    setNotice(message);
  }

  function resetDemo() {
    window.localStorage.removeItem(storageKeys.state);
    setData(getSeedState());
    setSection('overview');
    setMealIndex(0);
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setRoomSearch('');
    setStudentSearch('');
    setSelectedRoomId(null);
    setGlobalSearch('');
    setProfileOpen(false);
    showNotice('Data reset.');
  }

  function logout() {
    window.localStorage.removeItem(storageKeys.session);
    router.push('/login');
  }

  function submitComplaint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') ?? '').trim();
    const description = String(form.get('description') ?? '').trim();
    if (!title || !description) {
      showNotice('Add a short title and description before submitting.');
      return;
    }
    const now = new Date().toISOString();
    const complaint: Complaint = {
      id: `complaint-${Date.now()}`,
      studentId: currentStudent.id,
      category: String(form.get('category') ?? 'other') as ComplaintCategory,
      title,
      description,
      priority: String(form.get('priority') ?? 'medium') as ComplaintPriority,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      timeline: [{ id: `update-${Date.now()}`, status: 'pending', note: 'Request submitted from the Student View.', actor: 'student', at: now }],
    };
    setData((previous) => addComplaint(previous, complaint));
    setShowComplaintForm(false);
    setSection('complaints');
    showNotice('Complaint submitted.');
  }

  function changeComplaintStatus(complaintId: string, status: ComplaintStatus, note = '') {
    setData((previous) => updateComplaintStatus(previous, complaintId, status, note));
    showNotice(`Complaint marked ${statusLabels[status].toLowerCase()}.`);
  }

  function submitFeedback(rating: number) {
    const now = new Date().toISOString();
    setData((previous) => addActivity({
      ...previous,
      feedback: [{ id: `feedback-${Date.now()}`, studentId: currentStudent.id, rating, comment: feedbackComment.trim(), createdAt: now }, ...previous.feedback],
    }, { id: `activity-${Date.now()}`, type: 'feedback', title: 'New mess rating', detail: `${currentStudent.name} gave ${rating}/5`, at: now }));
    setFeedbackComment('');
    showNotice(`Thanks. You gave today's mess ${rating}/5.`);
  }

  function requestAllocation(roomId: string, studentId: string) {
    const room = data.rooms.find((candidate) => candidate.id === roomId);
    if (!room || room.occupantIds.length >= room.capacity) {
      showNotice('That room is currently full. Try a room with an open bed.');
      return;
    }
    setAllocationRequest({ roomId, studentId });
  }

  function confirmAllocation() {
    if (!allocationRequest) return;
    setData((previous) => allocateStudent(previous, allocationRequest.roomId, allocationRequest.studentId));
    setAllocationRequest(null);
    showNotice('Room allocation updated.');
  }

  function submitAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') ?? '').trim();
    const body = String(form.get('body') ?? '').trim();
    if (!title || !body) {
      showNotice('Add a title and message before publishing.');
      return;
    }
    const announcement: Announcement = {
      id: `announcement-${Date.now()}`,
      title,
      body,
      label: String(form.get('label') ?? 'notice') as Announcement['label'],
      publishedAt: 'Just now',
      expiresAt: String(form.get('expiresAt') ?? '').trim() || undefined,
    };
    setData((previous) => addAnnouncement(previous, announcement));
    setShowAnnouncementForm(false);
    setSection('announcements');
    showNotice('Notice published.');
  }

  function openSearchResult(result: SearchResult) {
    setGlobalSearch('');
    if (result.type === 'complaint') {
      const complaint = data.complaints.find((item) => item.id === result.id);
      if (complaint) setSelectedComplaint(complaint);
      return;
    }
    if (result.type === 'notice') {
      const announcement = data.announcements.find((item) => item.id === result.id);
      if (announcement) setSelectedAnnouncement(announcement);
      return;
    }
    setSection(result.type === 'room' ? 'rooms' : 'overview');
    if (result.type === 'room') setSelectedRoomId(result.id);
    showNotice(`${result.title} opened.`);
  }

  function renderOverview() {
    if (role === 'student') {
      return (
        <>
          <section className="editorial-hero student-hero">
            <div>
              <span className="eyebrow">Today</span>
              <h1>A calmer hostel day starts here.</h1>
              <p>Good morning, {currentStudent.name.split(' ')[0]}. Find your room, complaints, meals, and notices here.</p>
              <div className="hero-actions">
                <button className="button button-electric" onClick={() => setShowComplaintForm(true)}>Raise a complaint <span>↗</span></button>
                <button className="text-button" onClick={() => setSection('rooms')}>View room {myRoom?.number} <span>→</span></button>
              </div>
            </div>
            <div className="hero-aside">
              <div className="hero-mark">HH<span>+</span></div>
              <span className="hero-aside-label">HOSTEL STATUS</span>
              <strong>{occupancy.percent}%</strong>
              <span>beds filled</span>
            </div>
          </section>

          <div className="metric-grid">
            <MetricCard label="Your room" value={myRoom?.number ?? '—'} detail={`${myRoom?.block ?? 'Unassigned'} · ${myRoom?.type ?? 'room'}`} accent="metric-lime" />
            <MetricCard label="Open requests" value={String(myComplaints.filter((item) => item.status !== 'resolved').length).padStart(2, '0')} detail="Tracked by your hostel team" accent="metric-blue" />
            <MetricCard label="Today's menu" value="4 meals" detail="Breakfast → dinner" accent="metric-yellow" />
            <MetricCard label="Notice board" value={String(data.announcements.length).padStart(2, '0')} detail="Latest from the warden" accent="metric-coral" />
          </div>

          <HostelPulse state={data} feedbackAverage={feedbackAverage} />

          <div className="content-grid two-one">
            <section className="panel complaint-panel">
              <div className="panel-heading">
                <div><span className="section-kicker">Your complaints</span><h2>Complaint tracker</h2></div>
                <button className="link-button" onClick={() => setSection('complaints')}>See all ↗</button>
              </div>
              {myComplaints.length ? myComplaints.slice(0, 2).map((complaint) => <ComplaintRow key={complaint.id} complaint={complaint} state={data} onOpenDetails={setSelectedComplaint} />) : <EmptyState title="No complaints" body="You have no open complaints." />}
              <button className="add-row" onClick={() => setShowComplaintForm(true)}><span>+</span> Raise a new complaint</button>
            </section>
            <section className="panel menu-mini-panel">
              <div className="panel-heading"><div><span className="section-kicker">On the menu</span><h2>{activeMeal.day}, {activeMeal.date}</h2></div><button className="link-button" onClick={() => setSection('mess')}>Full menu ↗</button></div>
              <div className="meal-stack"><MealLine label="Breakfast" value={activeMeal.breakfast} /><MealLine label="Lunch" value={activeMeal.lunch} /><MealLine label="Dinner" value={activeMeal.dinner} /></div>
              <div className="menu-note"><span className="sun-dot">✦</span> Mess feedback is open until 9 PM</div>
            </section>
          </div>

          <section className="panel notice-strip">
            {data.announcements[0] ? <div><span className="section-kicker">From the notice board</span><h2>{data.announcements[0].title}</h2><p>{data.announcements[0].body}</p></div> : <EmptyState title="No notices" body="There are no hostel notices right now." />}
            <button className="button button-ink" onClick={() => setSection('announcements')}>Read notices <span>↗</span></button>
          </section>
          <ActivityFeed activities={data.activities} />
        </>
      );
    }

    return (
      <>
        <section className="editorial-hero admin-hero">
          <div><span className="eyebrow">Admin · Today</span><h1>Admin dashboard.</h1><p>See rooms, complaints, meals, and notices in one place.</p><div className="hero-actions"><button className="button button-electric" onClick={() => setSection('complaints')}>Review complaints <span>↗</span></button><button className="text-button" onClick={() => setSection('rooms')}>Manage rooms <span>→</span></button></div></div>
          <div className="admin-hero-stat"><span className="hero-aside-label">OPEN WORKLOAD</span><strong>{String(openComplaints.length).padStart(2, '0')}</strong><span>requests need a next step</span><div className="mini-progress"><span style={{ width: `${Math.max(16, Math.min(100, openComplaints.length * 23))}%` }} /></div></div>
        </section>
        <div className="metric-grid">
          <MetricCard label="Occupied beds" value={`${occupancy.occupied}/${occupancy.capacity}`} detail={`${occupancy.percent}% campus occupancy`} accent="metric-lime" />
          <MetricCard label="Open complaints" value={String(openComplaints.length).padStart(2, '0')} detail="Across all blocks" accent="metric-coral" />
          <MetricCard label="Rooms available" value={String(data.rooms.filter((room) => room.occupantIds.length < room.capacity).length).padStart(2, '0')} detail="Ready for allocation" accent="metric-blue" />
          <MetricCard label="Mess rating" value={feedbackAverage ? `${feedbackAverage}/5` : '—'} detail={`${data.feedback.length} ratings`} accent="metric-yellow" />
        </div>
        <HostelPulse state={data} feedbackAverage={feedbackAverage} admin />
         <div className="content-grid two-one">
          <section className="panel complaint-panel"><div className="panel-heading"><div><span className="section-kicker">Needs attention</span><h2>Complaint queue</h2></div><button className="link-button" onClick={() => setSection('complaints')}>Open queue ↗</button></div>{openComplaints.slice(0, 3).map((complaint) => <ComplaintRow key={complaint.id} complaint={complaint} state={data} admin onStatusChange={changeComplaintStatus} onOpenDetails={setSelectedComplaint} />)}</section>
          <section className="panel occupancy-panel"><div className="panel-heading"><div><span className="section-kicker">The numbers</span><h2>Occupancy</h2></div><button className="link-button" onClick={() => setSection('rooms')}>All rooms ↗</button></div><div className="occupancy-ring" style={{ '--ring-progress': `${occupancy.percent}%` } as CSSProperties}><strong>{occupancy.percent}<small>%</small></strong><span>occupied</span></div><div className="occupancy-legend"><span><i className="legend-dot dot-lime" />Occupied <b>{occupancy.occupied}</b></span><span><i className="legend-dot dot-paper" />Available <b>{occupancy.vacant}</b></span></div></section>
         </div>
         <ActivityFeed activities={data.activities} />
      </>
    );
  }

  function renderComplaints() {
    const visibleComplaints = role === 'student' ? myComplaints : data.complaints;
    const filteredComplaints = visibleComplaints.filter((complaint) => (statusFilter === 'all' || complaint.status === statusFilter) && (categoryFilter === 'all' || complaint.category === categoryFilter) && (priorityFilter === 'all' || (priorityFilter === 'high' && complaint.priority === 'high') || (priorityFilter === 'overdue' && isComplaintOverdue(complaint)))).sort((first, second) => Number(isComplaintOverdue(second)) - Number(isComplaintOverdue(first)) || ({ high: 0, medium: 1, low: 2 }[first.priority] - { high: 0, medium: 1, low: 2 }[second.priority]));
    return <section className="page-section"><PageIntro eyebrow={role === 'student' ? 'Your complaints' : 'Complaint list'} title={role === 'student' ? 'Your complaints.' : 'Review complaints.'} body={role === 'student' ? 'See what you reported and its current status.' : 'Filter complaints and update their status.'} action={role === 'student' ? <button className="button button-electric" onClick={() => setShowComplaintForm(true)}>New complaint <span>+</span></button> : undefined} />
      <div className="filter-row"><span className="filter-label">{filteredComplaints.length} total</span>{role === 'admin' && <><button className={`filter-chip ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All</button><button className={`filter-chip ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>Pending</button><button className={`filter-chip ${statusFilter === 'in-progress' ? 'active' : ''}`} onClick={() => setStatusFilter('in-progress')}>In progress</button><button className={`filter-chip ${statusFilter === 'resolved' ? 'active' : ''}`} onClick={() => setStatusFilter('resolved')}>Resolved</button><button className={`filter-chip ${priorityFilter === 'high' ? 'active' : ''}`} onClick={() => setPriorityFilter(priorityFilter === 'high' ? 'all' : 'high')}>High</button><button className={`filter-chip ${priorityFilter === 'overdue' ? 'active' : ''}`} onClick={() => setPriorityFilter(priorityFilter === 'overdue' ? 'all' : 'overdue')}>Overdue</button><select className="filter-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as 'all' | ComplaintCategory)} aria-label="Filter complaints by category"><option value="all">All categories</option>{Object.entries(categoryLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></>}</div>
      <section className="panel list-panel">{filteredComplaints.length ? filteredComplaints.map((complaint) => <ComplaintRow key={complaint.id} complaint={complaint} state={data} admin={role === 'admin'} expanded onStatusChange={role === 'admin' ? changeComplaintStatus : undefined} onOpenDetails={setSelectedComplaint} />) : <EmptyState title="Your queue is clear" body="New requests will show up here when they arrive." />}</section>
    </section>;
  }

  function renderRooms() {
    const filteredRooms = data.rooms.filter((room) => {
      const matchesSearch = `${room.block} ${room.number}`.toLowerCase().includes(roomSearch.toLowerCase().trim());
      const matchesFilter = roomFilter === 'all' || (roomFilter === 'available' && room.occupantIds.length < room.capacity) || (roomFilter === 'full' && room.occupantIds.length === room.capacity);
      return matchesSearch && matchesFilter && (role === 'admin' || room.id === myRoom?.id);
    });
    return <section className="page-section"><PageIntro eyebrow={role === 'student' ? 'Your room' : 'Room management'} title={role === 'student' ? `Room ${myRoom?.number ?? 'unassigned'}.` : 'Rooms and beds.'} body={role === 'student' ? `${myRoom?.block ?? 'Your block'} · ${myRoom?.type ?? 'room'} · ${myRoom?.occupantIds.length ?? 0} of ${myRoom?.capacity ?? 0} beds occupied.` : 'Search rooms, check beds, and move students.'} />
      <div className="room-summary-row"><MetricCard label="Occupied beds" value={`${occupancy.occupied}/${occupancy.capacity}`} detail="Across all blocks" accent="metric-lime" /><MetricCard label="Open beds" value={String(occupancy.vacant).padStart(2, '0')} detail="Ready for allocation" accent="metric-blue" /><MetricCard label="Blocks" value="03" detail="A, B and C" accent="metric-yellow" /></div>
      <RoomMap rooms={role === 'admin' ? data.rooms : (myRoom ? [myRoom] : [])} selectedRoomId={selectedRoomId} onSelect={(roomId) => { setSelectedRoomId(roomId); setRoomSearch(data.rooms.find((room) => room.id === roomId)?.number ?? ''); }} />
      {role === 'admin' && <div className="room-toolbar"><label className="search-field"><Icon name="search" size={15} /><input value={roomSearch} onChange={(event) => setRoomSearch(event.target.value)} placeholder="Search block or room" aria-label="Search rooms" /></label><label className="search-field"><Icon name="search" size={15} /><input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Find student to move" aria-label="Search students" /></label><div className="filter-row room-filters"><button className={`filter-chip ${roomFilter === 'all' ? 'active' : ''}`} onClick={() => setRoomFilter('all')}>All rooms</button><button className={`filter-chip ${roomFilter === 'available' ? 'active' : ''}`} onClick={() => setRoomFilter('available')}>Available</button><button className={`filter-chip ${roomFilter === 'full' ? 'active' : ''}`} onClick={() => setRoomFilter('full')}>Full</button></div></div>}
      <div className="room-grid">{filteredRooms.map((room) => <RoomCard key={room.id} room={room} state={data} admin={role === 'admin'} selected={selectedRoomId === room.id} studentSearch={studentSearch} onAllocate={requestAllocation} />)}</div>
      {!filteredRooms.length && <section className="panel"><EmptyState title="No rooms match that view" body="Try another block, room number, or availability filter." /></section>}
    </section>;
  }

  function renderMess() {
    return <section className="page-section"><PageIntro eyebrow="Mess menu" title="This week&apos;s menu." body="Check meals and leave feedback for the mess team." />
      <div className="meal-tabs">{data.meals.map((meal, index) => <button className={`meal-tab ${index === mealIndex ? 'active' : ''}`} key={meal.id} onClick={() => setMealIndex(index)}><strong>{meal.day}</strong><span>{meal.date}</span></button>)}</div>
      <section className="meal-board"><div className="meal-board-heading"><span className="section-kicker">Today&apos;s food</span><h2>{activeMeal.day}, {activeMeal.date}</h2><p>Check the meals and tell the mess team what you think.</p></div><div className="meal-columns"><MealLine label="Breakfast" value={activeMeal.breakfast} /><MealLine label="Lunch" value={activeMeal.lunch} /><MealLine label="Snacks" value={activeMeal.snacks} /><MealLine label="Dinner" value={activeMeal.dinner} /></div><div className="feedback-block"><div><span className="section-kicker">Feedback</span><strong>How was today&apos;s food?</strong><textarea className="feedback-input" value={feedbackComment} onChange={(event) => setFeedbackComment(event.target.value)} placeholder="Write a short note (optional)" rows={2} /></div><div className="star-row">{[1, 2, 3, 4, 5].map((star) => <button key={star} onClick={() => submitFeedback(star)} aria-label={`Rate ${star} out of 5`}>★</button>)}</div></div></section>
      <MessSummary feedback={data.feedback} average={feedbackAverage} />
    </section>;
  }

  function renderAnnouncements() {
    return <section className="page-section"><PageIntro eyebrow="Notice board" title="Hostel notices." body="Important updates from the hostel team." action={role === 'admin' ? <button className="button button-electric" onClick={() => setShowAnnouncementForm(true)}>Add notice <Icon name="plus" size={14} /></button> : undefined} />
      <div className="announcement-grid">{data.announcements.map((announcement, index) => <article className={`announcement-card announcement-${announcement.label}`} key={announcement.id}><div className="announcement-top"><span className="announcement-label">{announcement.label}</span><span>{announcement.publishedAt}</span></div><div className="announcement-index">0{index + 1}</div><h2>{announcement.title}</h2><p>{announcement.body}</p><button className="text-button" onClick={() => setSelectedAnnouncement(announcement)}>Open details <Icon name="arrow" size={13} /></button></article>)}</div>
    </section>;
  }

  const content = section === 'overview' ? renderOverview() : section === 'complaints' ? renderComplaints() : section === 'rooms' ? renderRooms() : section === 'mess' ? renderMess() : renderAnnouncements();

  if (!sessionChecked) return <main className="auth-loading"><div className="brand-stamp">H</div><strong>Hostel<span>Hub</span></strong></main>;

  return (
    <div className="hostel-app">
      <aside className="side-rail">
        <div className="brand-lockup"><div className="brand-stamp">H</div><div><strong>Hostel<span>Hub</span></strong><small>campus living, clearer</small></div></div>
        <div className="rail-section-label">Workspace</div>
        <nav className="rail-nav" aria-label="Primary navigation">{navItems.map((item) => <button className={section === item.id ? 'active' : ''} key={item.id} onClick={() => setSection(item.id)}><span className="nav-glyph"><Icon name={item.glyph} size={17} /></span>{item.label}{item.id === 'complaints' && openComplaints.length > 0 && <b>{openComplaints.length}</b>}</button>)}</nav>
        <div className="rail-bottom"><button className="reset-link" onClick={() => setShowResetConfirm(true)}>↻ Reset data</button></div>
      </aside>
      <div className="main-stage">
        <header className="top-bar"><div className="mobile-brand"><div className="brand-stamp">H</div><strong>Hostel<span>Hub</span></strong></div><div className="top-context"><span className="context-dot" />{role === 'student' ? 'Student' : 'Admin'}</div><div className="top-actions"><div className="global-search-wrap"><label className="global-search"><Icon name="search" size={15} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Search" aria-label="Search HostelHub" /></label>{globalSearch && <div className="search-results">{searchResults.length ? searchResults.map((result) => <button key={`${result.type}-${result.id}`} onClick={() => openSearchResult(result)}><span><strong>{result.title}</strong><small>{result.detail}</small></span><Icon name="arrow" size={13} /></button>) : <p>No results</p>}</div>}</div><button className="help-button" onClick={() => showNotice('Use the menu to move around HostelHub.')}>?</button><div className="profile-wrap"><button className="avatar-button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-label="Open profile menu"><span className="avatar">{role === 'student' ? currentStudent.initials : 'AD'}</span><Icon name="chevron" size={13} /></button>{profileOpen && <div className="profile-menu"><strong>{role === 'student' ? currentStudent.name : session.displayName}</strong><span>{role === 'student' ? `${currentStudent.course} · ${currentStudent.year}` : 'Hostel admin'}</span>{role === 'student' && <span>Room {myRoom?.number ?? '—'}</span>}<button onClick={logout}>Log out</button></div>}</div></div></header>
        <main className="main-content">{content}</main>
        <div className="mobile-nav">{navItems.map((item) => <button className={section === item.id ? 'active' : ''} key={item.id} onClick={() => setSection(item.id)}><span><Icon name={item.glyph} size={16} /></span>{item.label.split(' ')[0]}</button>)}</div>
      </div>
      {showComplaintForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowComplaintForm(false); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="complaint-title"><div className="modal-top"><div><span className="section-kicker">New complaint</span><h2 id="complaint-title">Report a problem.</h2></div><button className="close-button" onClick={() => setShowComplaintForm(false)} aria-label="Close complaint form"><Icon name="close" size={16} /></button></div><form className="complaint-form" onSubmit={submitComplaint}><label>Short title<input name="title" placeholder="e.g. Corridor light is out" required /></label><div className="form-two"><label>Category<select name="category" defaultValue="maintenance">{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Priority<select name="priority" defaultValue="medium"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label></div><label>What happened?<textarea name="description" placeholder="Write a short description." rows={4} required /></label><div className="form-footer"><span>Your request will be shown to the hostel team.</span><button className="button button-ink" type="submit">Submit complaint <Icon name="arrow" size={14} /></button></div></form></section></div>}
      {activeComplaint && <ComplaintDetailModal complaint={activeComplaint} state={data} admin={role === 'admin'} onClose={() => setSelectedComplaint(null)} onStatusChange={changeComplaintStatus} />}
      {selectedAnnouncement && <AnnouncementDetailModal announcement={selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />}
      {showAnnouncementForm && <AnnouncementForm onClose={() => setShowAnnouncementForm(false)} onSubmit={submitAnnouncement} />}
      {allocationRequest && allocationRoom && allocationStudent && <ConfirmDialog title="Confirm room move" body={`${allocationStudent.name} will be moved to ${allocationRoom.block}, room ${allocationRoom.number}. The change will be saved in this browser.`} confirmLabel="Confirm allocation" onCancel={() => setAllocationRequest(null)} onConfirm={confirmAllocation} />}
      {showResetConfirm && <ConfirmDialog title="Reset data?" body="This removes your changes and restores the starting data." confirmLabel="Reset data" onCancel={() => setShowResetConfirm(false)} onConfirm={() => { setShowResetConfirm(false); resetDemo(); }} />}
      {notice && <div className="toast" role="status"><span>✦</span>{notice}</div>}
    </div>
  );
}

function PageIntro({ eyebrow, title, body, action }: { eyebrow: string; title: string; body: string; action?: ReactNode }) {
  return <div className="page-intro"><div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{body}</p></div>{action}</div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><span>✦</span><strong>{title}</strong><p>{body}</p></div>;
}

function MealLine({ label, value }: { label: string; value: string }) {
  return <div className="meal-line"><span>{label}</span><strong>{value}</strong></div>;
}

function ComplaintRow({ complaint, state, admin = false, expanded = false, onStatusChange, onOpenDetails }: { complaint: Complaint; state: HostelState; admin?: boolean; expanded?: boolean; onStatusChange?: (complaintId: string, status: ComplaintStatus) => void; onOpenDetails?: (complaint: Complaint) => void }) {
  return <article className={`complaint-row ${expanded ? 'expanded' : ''}`}><div className="complaint-icon"><Icon name={complaint.category === 'mess' ? 'meal' : complaint.category === 'maintenance' ? 'pulse' : 'complaint'} size={16} /></div><div className="complaint-copy"><div className="complaint-row-top"><strong>{complaint.title}</strong><span>{shortDate(complaint.createdAt)}</span></div><p>{expanded ? complaint.description : admin ? getStudentName(state, complaint.studentId) : complaint.description}</p><div className="complaint-meta"><PriorityBadge priority={complaint.priority} />{isComplaintOverdue(complaint) && <span className="overdue-badge">Overdue</span>}<span className="category-label">{categoryLabels[complaint.category]}</span></div></div><div className="complaint-actions"><StatusBadge status={complaint.status} />{admin && <select value={complaint.status} aria-label={`Update status for ${complaint.title}`} onChange={(event) => onStatusChange?.(complaint.id, event.target.value as ComplaintStatus)}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select>} {onOpenDetails && <button className="row-detail" onClick={() => onOpenDetails(complaint)}>Details <Icon name="arrow" size={12} /></button>}</div></article>;
}

function RoomCard({ room, state, admin, selected = false, studentSearch = '', onAllocate }: { room: HostelState['rooms'][number]; state: HostelState; admin: boolean; selected?: boolean; studentSearch?: string; onAllocate: (roomId: string, studentId: string) => void }) {
  const occupants = room.occupantIds.map((id) => state.students.find((student) => student.id === id)).filter(Boolean);
  const availableStudents = state.students.filter((student) => student.roomId !== room.id && student.name.toLowerCase().includes(studentSearch.trim().toLowerCase()));
  return <article className={`room-card ${room.occupantIds.length === room.capacity ? 'room-full' : ''} ${selected ? 'room-selected' : ''}`}><div className="room-card-top"><div><span className="section-kicker">{room.block} · floor {room.floor}</span><h2>{room.number}</h2></div><span className="room-type">{room.type}</span></div><div className="bed-row">{Array.from({ length: room.capacity }).map((_, index) => <span className={index < room.occupantIds.length ? 'filled' : ''} key={`${room.id}-bed-${index}`} />)}</div><div className="occupant-list">{occupants.map((student) => student && <span key={student.id}><i>{student.initials}</i>{student.name.split(' ')[0]}</span>)}{room.occupantIds.length < room.capacity && <span className="open-bed">{room.capacity - room.occupantIds.length} open bed{room.capacity - room.occupantIds.length === 1 ? '' : 's'}</span>}</div>{admin && <select className="room-allocate" defaultValue="" onChange={(event) => { if (event.target.value) onAllocate(room.id, event.target.value); }} disabled={room.occupantIds.length >= room.capacity || !availableStudents.length}><option value="">{availableStudents.length ? 'Assign a student…' : 'No students to move'}</option>{availableStudents.map((student) => <option value={student.id} key={student.id}>{student.name} · {student.roomId.replace('room-', '').replaceAll('-', ' ')}</option>)}</select>}</article>;
}

function RoomMap({ rooms, selectedRoomId, onSelect }: { rooms: HostelState['rooms']; selectedRoomId: string | null; onSelect: (roomId: string) => void }) {
  const blocks = Array.from(new Set(rooms.map((room) => room.block)));
  return <section className="room-map-panel"><div className="room-map-heading"><div><span className="section-kicker">Room map</span><h2>Blocks at a glance</h2></div><span className="map-key"><i className="map-dot map-open" />Open <i className="map-dot map-full" />Full</span></div><div className="room-map">{blocks.map((block) => <div className="map-block" key={block}><strong>{block.replace(' Block', '')}</strong><div>{rooms.filter((room) => room.block === block).map((room) => <button key={room.id} className={`map-room ${room.occupantIds.length === room.capacity ? 'map-full' : 'map-open'} ${room.id === selectedRoomId ? 'selected' : ''}`} onClick={() => onSelect(room.id)}>{room.number}</button>)}</div></div>)}</div></section>;
}

function ActivityFeed({ activities }: { activities: HostelState['activities'] }) {
  return <section className="panel activity-panel"><div className="panel-heading"><div><span className="section-kicker">Recent activity</span><h2>Latest updates</h2></div><Icon name="pulse" size={18} /></div>{activities.length ? <div className="activity-list">{activities.slice(0, 5).map((activity) => <div className="activity-item" key={activity.id}><span className={`activity-icon activity-${activity.type}`}><Icon name={activity.type === 'room' ? 'room' : activity.type === 'notice' ? 'notice' : activity.type === 'feedback' ? 'meal' : 'complaint'} size={14} /></span><div><strong>{activity.title}</strong><p>{activity.detail}</p></div><time>{shortDate(activity.at)}</time></div>)}</div> : <EmptyState title="No recent activity" body="New updates will appear here." />}</section>;
}

function MessSummary({ feedback, average }: { feedback: HostelState['feedback']; average: number | null }) {
  const counts = [5, 4, 3, 2, 1].map((rating) => ({ rating, count: feedback.filter((item) => item.rating === rating).length }));
  const max = Math.max(1, ...counts.map((item) => item.count));
  const latest = feedback.slice(0, 2);
  return <section className="panel mess-summary"><div className="panel-heading"><div><span className="section-kicker">Mess feedback</span><h2>How students rate food</h2></div><strong className="summary-score">{average ?? '—'}<small>/5</small></strong></div><div className="mess-summary-grid"><div className="rating-bars">{counts.map((item) => <div className="rating-bar" key={item.rating}><span>{item.rating}</span><i><b style={{ width: `${(item.count / max) * 100}%` }} /></i><small>{item.count}</small></div>)}</div><div className="feedback-list">{latest.length ? latest.map((item) => <div key={item.id}><strong>{'★'.repeat(item.rating)}</strong><p>{item.comment || 'No comment added.'}</p></div>) : <EmptyState title="No feedback yet" body="Ratings will appear here." />}</div></div></section>;
}

function HostelPulse({ state, feedbackAverage, admin = false }: { state: HostelState; feedbackAverage: number | null; admin?: boolean }) {
  const blocks = Array.from(new Set(state.rooms.map((room) => room.block))).map((block) => {
    const rooms = state.rooms.filter((room) => room.block === block);
    const occupied = rooms.reduce((total, room) => total + room.occupantIds.length, 0);
    const capacity = rooms.reduce((total, room) => total + room.capacity, 0);
    return { block, percent: Math.round((occupied / capacity) * 100), occupied, capacity };
  });
  return <section className="pulse-panel"><div className="pulse-heading"><div><span className="section-kicker">Hostel status</span><h2>{admin ? 'Hostel status.' : 'Your hostel status.'}</h2><p>{admin ? 'See beds, complaints, food, and notices.' : 'See the main hostel updates in one place.'}</p></div><div className="pulse-badge"><Icon name="pulse" size={17} /><span>STATUS</span></div></div><div className="pulse-grid"><div className="pulse-big-stat"><span>Open complaints</span><strong>{String(state.complaints.filter((complaint) => complaint.status !== 'resolved').length).padStart(2, '0')}</strong><small>Need attention</small></div><div className="pulse-big-stat"><span>Mess rating</span><strong>{feedbackAverage ? `${feedbackAverage}` : '—'}<small>/5</small></strong><small>{state.feedback.length ? `${state.feedback.length} ratings` : 'No ratings yet'}</small></div><div className="block-pulse"><span>Block beds</span>{blocks.map((item) => <div className="block-bar" key={item.block}><div><strong>{item.block.replace(' Block', '')}</strong><span>{item.occupied}/{item.capacity} beds</span></div><i><b style={{ width: `${item.percent}%` }} /></i></div>)}</div></div></section>;
}

function ComplaintDetailModal({ complaint, state, admin, onClose, onStatusChange }: { complaint: Complaint; state: HostelState; admin: boolean; onClose: () => void; onStatusChange: (complaintId: string, status: ComplaintStatus, note?: string) => void }) {
  const [status, setStatus] = useState(complaint.status);
  const [note, setNote] = useState('');
  const timeline = complaint.timeline ?? [];
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section className="modal-card detail-modal" role="dialog" aria-modal="true" aria-labelledby="complaint-detail-title"><div className="modal-top"><div><span className="section-kicker">{categoryLabels[complaint.category]} · {getStudentName(state, complaint.studentId)}</span><h2 id="complaint-detail-title">{complaint.title}</h2></div><button className="close-button" onClick={onClose} aria-label="Close complaint details"><Icon name="close" size={16} /></button></div><p className="detail-description">{complaint.description}</p><div className="detail-status-line"><StatusBadge status={complaint.status} /><PriorityBadge priority={complaint.priority} />{isComplaintOverdue(complaint) && <span className="overdue-badge">Overdue</span>}<span>{complaint.dueAt ? `Due ${shortDate(complaint.dueAt)}` : `Updated ${shortDate(complaint.updatedAt)}`}</span></div><div className="timeline">{timeline.length ? timeline.map((item) => <div className="timeline-item" key={item.id}><span className={`timeline-dot timeline-${item.status}`}><Icon name={item.status === 'resolved' ? 'check' : item.status === 'pending' ? 'clock' : 'pulse'} size={12} /></span><div><strong>{statusLabels[item.status]}</strong><small>{item.actor === 'admin' ? 'Hostel team' : 'Student'} · {shortDateTime(item.at)}</small><p>{item.note}</p></div></div>) : <EmptyState title="No updates yet" body="Updates will appear here." />}</div>{admin && <form className="detail-update" onSubmit={(event) => { event.preventDefault(); onStatusChange(complaint.id, status, note); setNote(''); }}><span className="section-kicker">Admin action</span><div className="form-two"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as ComplaintStatus)}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select></label><label>Note<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write a short note" /></label></div><button className="button button-ink" type="submit">Save update <Icon name="check" size={14} /></button></form>}</section></div>;
}

function AnnouncementDetailModal({ announcement, onClose }: { announcement: Announcement; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section className={`modal-card announcement-detail-modal announcement-${announcement.label}`} role="dialog" aria-modal="true" aria-labelledby="announcement-detail-title"><div className="modal-top"><div><span className="section-kicker">{announcement.label} · {announcement.publishedAt}</span><h2 id="announcement-detail-title">{announcement.title}</h2></div><button className="close-button" onClick={onClose} aria-label="Close announcement details"><Icon name="close" size={16} /></button></div><p className="detail-description announcement-detail-copy">{announcement.body}</p>{announcement.expiresAt && <p className="expiry-note"><Icon name="clock" size={14} /> Runs until {announcement.expiresAt}</p>}<button className="button button-ink" onClick={onClose}>Back to board <Icon name="arrow" size={14} /></button></section></div>;
}

function AnnouncementForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="announcement-form-title"><div className="modal-top"><div><span className="section-kicker">Add notice</span><h2 id="announcement-form-title">Write a notice.</h2></div><button className="close-button" onClick={onClose} aria-label="Close announcement form"><Icon name="close" size={16} /></button></div><form className="complaint-form" onSubmit={onSubmit}><label>Headline<input name="title" placeholder="e.g. New study room hours" required /></label><div className="form-two"><label>Label<select name="label" defaultValue="notice"><option value="notice">Notice</option><option value="event">Event</option><option value="maintenance">Maintenance</option><option value="urgent">Urgent</option></select></label><label>Expires<input name="expiresAt" placeholder="e.g. Friday, 8 PM" /></label></div><label>Message<textarea name="body" placeholder="Write a short message." rows={5} required /></label><div className="form-footer"><span>The notice will appear on the board.</span><button className="button button-ink" type="submit">Publish notice <Icon name="arrow" size={14} /></button></div></form></section></div>;
}

function ConfirmDialog({ title, body, confirmLabel, onCancel, onConfirm }: { title: string; body: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void }) {
  return <div className="modal-backdrop" role="presentation"><section className="modal-card confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><div className="confirm-mark"><Icon name="pulse" size={22} /></div><h2 id="confirm-title">{title}</h2><p>{body}</p><div className="confirm-actions"><button className="text-button" onClick={onCancel}>Cancel</button><button className="button button-ink" onClick={onConfirm}>{confirmLabel} <Icon name="check" size={14} /></button></div></section></div>;
}

function shortDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}
