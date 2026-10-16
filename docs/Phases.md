# HostelHub 24-Hour Execution Phases

This plan is optimized for a design-led judging rubric. A complete, polished core flow is more valuable than a large unfinished feature list.

## Phase 0 — Scope lock | 30 minutes

### Deliverables

- Confirm Problem Statement 3.
- Confirm Student and Admin login paths.
- Freeze the MVP: complaints, rooms, mess menu, announcements.
- Agree on the demo story and seeded data.

### Exit criteria

The team can explain the product in one sentence and no new core module is added after this phase.

## Phase 1 — Visual foundation | 1 hour

### Deliverables

- Color variables
- Typography hierarchy
- Spacing and border rules
- App shell wireframe
- Mobile navigation decision
- Button, card, badge, form, and modal states

### Exit criteria

One polished shell screen exists at mobile and desktop widths.

## Phase 2 — App shell and seed data | 1.5 hours

### Deliverables

- Next.js app shell
- Student/Admin login flow
- Navigation
- Seed data
- Typed domain models
- Local storage adapter skeleton

### Exit criteria

Both views can be opened and the app remains usable after a refresh.

## Phase 3 — Student experience | 3 hours

### Deliverables

- Student overview
- Room summary
- Quick actions
- Complaint list and detail
- Mess menu
- Announcements

### Exit criteria

A student can find all important information without needing the Admin view.

## Phase 4 — Complaint workflow | 2.5 hours

### Deliverables

- Complaint form
- Validation
- Priority and category
- Status timeline
- Admin queue
- Filters
- Status mutation

### Exit criteria

The complete complaint flow works from Student View to Admin View and back.

## Phase 5 — Room workflow | 2 hours

### Deliverables

- Room grid/list
- Occupancy metrics
- Search/filter
- Allocation dialog
- Persistence

### Exit criteria

An admin can allocate a student to a room and see metrics update.

## Phase 6 — Mess and announcements | 2 hours

### Deliverables

- Day-wise menu
- Feedback form
- Announcement cards
- Admin menu/announcement controls if time permits

### Exit criteria

Student-facing content feels complete and has meaningful populated and empty states.

## Phase 7 — Responsive refinement | 2 hours

### Deliverables

- Mobile navigation
- Responsive cards
- Stacked forms and tables
- Touch-friendly controls
- Text wrapping fixes

### Exit criteria

No horizontal overflow or unusable controls at 320px, tablet, and desktop widths.

## Phase 8 — Visual polish | 2 hours

### Deliverables

- Editorial hero blocks
- Strong metric treatments
- Empty/success/error states
- Toast feedback
- Focus states
- Reduced-motion handling

### Exit criteria

Every major screen follows the same visual language and feels intentionally designed.

## Phase 9 — QA and demo hardening | 2 hours

### Checks

- Complaint creation
- Validation failures
- Complaint status updates
- Room allocation
- Refresh persistence
- Reset Demo
- Student/Admin switching
- Navigation
- Mobile and desktop layouts
- Console errors

### Exit criteria

The entire judge demo can be repeated from a known reset state without improvisation.

## Phase 10 — Submission buffer | 30 minutes

### Deliverables

- Public repository
- Correct official repository name
- README setup instructions
- Demo link
- Final compliance checklist
- Backup screen recording or screenshots if permitted

### Fallback rule

If time is lost, remove secondary admin editing screens before compromising the complaint flow, visual polish, or responsive quality.
