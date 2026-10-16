# HostelHub — Pixel Wizard Project Report

## 1. Executive summary

HostelHub is a responsive hostel management experience designed for students and hostel administrators. It converts fragmented hostel tasks—complaints, room information, mess menus, and announcements—into one clear, visual campus interface.

The project selects **Problem Statement 3: Hostel Management System**. It uses mock data and browser `localStorage`, as permitted by the competition rules. The product is intentionally frontend-only so the team can spend the 24-hour competition window on usability, visual polish, responsive behavior, and reliable interactions.

## 2. Why this problem statement

The judging rubric gives the highest weight to functionality and interactivity (30%), followed by UI/UX (25%). A hostel system naturally supports multiple demonstrable flows without requiring a real backend:

- A student can submit and track a complaint.
- An admin can update the complaint status.
- An admin can allocate a room.
- A student can view the mess menu and submit feedback.
- Both views can use the same seeded browser data.

This gives the project more interaction depth than a mostly informational event page while leaving enough time for a distinctive design system.

## 3. Product concept

### Working name

**HostelHub**

### Positioning

> A vibrant student living dashboard that makes every hostel task easier to see, action, and track.

### Target users

1. **Students** — need quick access to room details, complaints, announcements, menus, and help.
2. **Hostel administrators** — need a compact operational view of occupancy, complaints, rooms, menus, and notices.

## 4. Feature scope

### Student MVP

- Personal overview
- Room and roommate information
- Raise a complaint
- Complaint status timeline
- Complaint detail view with admin progress notes
- Today's mess menu
- Mess feedback
- Announcements

### Admin MVP

- Occupancy summary
- Room availability
- Complaint queue
- Complaint filtering and status updates
- Room search, availability filtering, and confirmed allocation
- Mess menu feedback with optional comment
- Announcement publishing and detail view
- Hostel Pulse across blocks

### Explicit non-goals

- Real authentication or authorization
- Online payments or fee management
- Cross-device synchronization
- Push notifications
- Real-time multi-user collaboration
- Backend APIs or a database

## 5. Design strategy

The experience uses a **Bold Campus Editorial** visual language instead of a generic administrative dashboard:

- Oversized editorial headings
- High-contrast ink, paper, and electric accent colors
- Strong borders and structured card compositions
- Asymmetric feature blocks
- Direct, student-friendly copy
- A clear visual distinction between information, action, and status

The design must remain readable and usable. Bold visual treatment will never replace labels, focus states, sufficient contrast, or responsive layout behavior.

## 6. Judging criteria alignment

| Criterion | Weight | Evidence planned |
|---|---:|---|
| Functionality and interactivity | 30% | Complaint lifecycle, room allocation, filters, menu feedback, persistent local data |
| UI/UX and visual design | 25% | Custom editorial design system, clear hierarchy, purposeful states, polished dashboard |
| Creativity and originality | 20% | Student-first hostel operating experience rather than a generic CRUD panel |
| Responsive design | 15% | Mobile-first layouts, compact navigation, responsive tables and forms |
| Code quality and compliance | 10% | Typed data models, separated storage layer, reusable components, public repository, original work |

## 7. Judge demonstration script

1. Introduce the hostel problem in one sentence.
2. Open Student View and show the overview.
3. Submit a maintenance complaint.
4. Switch to Admin View and update that complaint.
5. Return to Student View and show the persisted status.
6. Open room allocation and show occupancy information.
7. Open the mess menu and submit a feedback rating.
8. Show the responsive mobile layout.
9. Refresh the browser to demonstrate `localStorage` persistence.
10. Close with the original design rationale and rule-compliant scope.

## 8. Risk controls

| Risk | Mitigation |
|---|---|
| Too many features remain unfinished | Freeze MVP around complaints, rooms, menu, and announcements |
| App looks like a generic admin panel | Implement the editorial design system before adding secondary features |
| Local data appears to be real backend data | Keep frontend-only login and local data clearly labelled |
| Hydration errors in Next.js | Read `localStorage` only inside client-side effects/hooks |
| Demo data becomes inconsistent | Add deterministic seed data and a visible reset action |
| Mobile layout is left until the end | Test mobile after every major UI slice |

## 9. Definition of done

- Student and Admin views are both usable.
- The complaint flow works from creation to status update.
- Room allocation changes are visible after refresh.
- Mess menu and announcements have meaningful empty and populated states.
- Data persists in the same browser through reload.
- Navigation and interactive controls work at mobile and desktop widths.
- The project builds without errors and has a documented test command.
- Repository and demo submission follow the official rules.
