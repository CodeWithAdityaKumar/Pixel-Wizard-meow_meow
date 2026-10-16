# HostelHub Product Requirements Document

## 1. Product definition

HostelHub is a frontend-only hostel management experience for students and hostel administrators. It centralizes everyday hostel information and actions in a visually distinctive, responsive interface.

## 2. Product goals

1. Give students a fast way to understand their hostel status and take action.
2. Give administrators a compact view of operational work.
3. Demonstrate complete interactive flows without requiring a backend.
4. Make the product memorable through a coherent editorial campus identity.
5. Preserve demo changes in the browser with `localStorage`.

## 3. Success criteria

- A first-time visitor understands the purpose within 10 seconds.
- A student can submit a complaint in under one minute.
- An admin can find and update a complaint without leaving the dashboard.
- A room allocation change is visible after a browser refresh.
- A judge can understand the Student/Admin split without real authentication.
- Core screens remain usable from 320px mobile width through desktop widths.

## 4. Personas

### Student: Aanya

- Wants quick answers, not administrative complexity.
- Checks her room, mess menu, announcements, and complaints from her phone.
- Needs visible status and expected next steps after submitting an issue.

### Admin: Rohan

- Needs a prioritized view of unresolved work.
- Wants to find a student, room, or complaint quickly.
- Needs simple controls for status updates, room allocation, menus, and notices.

## 5. Primary user journeys

### Student complaint journey

1. Student opens the dashboard.
2. Student selects **Raise complaint**.
3. Student chooses category and priority.
4. Student enters a short description.
5. Student submits the form.
6. The new complaint appears with a `Pending` status.
7. Student can reopen the complaint timeline later.

### Admin resolution journey

1. Admin opens the complaint queue.
2. Admin filters by status or category.
3. Admin opens a complaint detail view.
4. Admin changes status to `In Progress` or `Resolved`.
5. The update is stored in the browser.
6. Student view reflects the new status.

### Room allocation journey

1. Admin opens room management.
2. Admin searches or filters rooms.
3. Admin opens a vacant or partially occupied room.
4. Admin selects a student from mock data.
5. Admin confirms allocation.
6. Occupancy metrics update immediately and after refresh.

### Mess feedback journey

1. Student opens today's menu.
2. Student views breakfast, lunch, snacks, and dinner.
3. Student submits a rating and optional comment.
4. A confirmation state appears.
5. The feedback is retained locally for the demo.

## 6. Functional requirements

### Navigation

- The user can switch between available sections.
- The active section is visually clear.
- Mobile navigation remains accessible without taking over the whole screen.
- Student and Admin login paths are clear and labelled.

### Student dashboard

- Shows student identity, room, quick actions, complaint summary, today's menu, and announcements.
- Shows useful empty states when there are no complaints or notices.
- Allows creation of a complaint.
- Shows complaint status and timeline.
- Opens complaint details with an admin progress note.
- Allows mess feedback submission.

### Admin dashboard

- Shows total students, occupancy, vacant beds, and unresolved complaints.
- Provides complaint list filtering.
- Allows status changes with confirmation feedback.
- Provides room search, availability filtering, and confirmed allocation controls.
- Provides menu feedback and announcement publishing/detail entry points.
- Shows a Hostel Pulse summary across blocks.
- Shows a room map, recent activity, profile information, and global search.
- Highlights high-priority and overdue complaints.
- Shows rating distribution and recent mess comments.

### Persistence

- Initial data is seeded deterministically when storage is empty.
- Mutations are written to `localStorage`.
- Reloading the page restores intended demo changes.
- A reset-demo action restores the seed state.
- Invalid or unavailable storage falls back to an in-memory session state and shows no broken UI.

## 7. Non-functional requirements

- Responsive from 320px upward.
- Keyboard-accessible controls and visible focus indicators.
- Status cannot be communicated by color alone.
- Clear labels and validation for every form.
- No secrets or absolute machine paths.
- No backend dependency.
- Build and test commands are documented.

## 8. MVP boundaries

### Must have

- App shell and responsive navigation
- Student dashboard
- Admin dashboard
- Complaint create/list/update flow
- Room allocation flow
- Menu and announcements display
- Local persistence and reset

### Should have

- Complaint priority filters
- Feedback summary
- Helpful empty states
- Demo walkthrough hints

### Won't have in the competition MVP

- Real login
- Payments or fees
- Visitor management
- Attendance
- Push notifications
- Multi-user synchronization
- Backend or database

## 9. Acceptance criteria

- **AC-01:** A user can open Student View and see seeded hostel information.
- **AC-02:** A student can submit a valid complaint and receive visible confirmation.
- **AC-03:** Invalid complaint submissions show a clear, non-destructive validation message.
- **AC-04:** Admin View can filter complaints and update a complaint status.
- **AC-04a:** A complaint detail view shows a status timeline and allows an admin progress note.
- **AC-05:** A status update is visible from Student View after switching views.
- **AC-06:** Admin View can allocate a student to an available room.
- **AC-06a:** Admin View can search/filter rooms and confirm an allocation before saving it.
- **AC-06b:** Admin View can publish a notice that appears on the shared announcement board.
- **AC-07:** Complaint and room mutations survive a browser reload.
- **AC-08:** Reset Demo returns the app to deterministic seed data.
- **AC-09:** Primary flows are usable at mobile and desktop widths.
- **AC-10:** The app communicates that login and data are frontend-only.
