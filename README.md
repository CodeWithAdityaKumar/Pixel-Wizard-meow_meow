# HostelHub

HostelHub is a design-first, frontend-only hostel management experience for the Pixel Wizard competition. It addresses **Problem Statement 3: Hostel Management System** with separate Student and Admin views, seeded demo data, and browser-local persistence.

## Product promise

> Make hostel life visible, organized, and easier to manage from one vibrant campus dashboard.

## Scope

- Student dashboard
- Admin dashboard
- Student login at `/login/student`
- Admin login at `/login/admin`
- Room and occupancy information
- Complaint creation and status tracking
- Complaint detail timeline and admin notes
- Room allocation
- Room search, availability filters, and confirmation
- Mess menu and feedback
- Hostel announcements
- Announcement publishing and details
- Hostel Pulse summary
- Room map and block occupancy
- Recent activity feed
- Profile menu and global search
- Priority and overdue complaint views
- Mess rating summary
- Responsive, mobile-first UI
- `localStorage` persistence only

There is no backend, database, authentication service, API, or cross-device synchronization. Student and Admin access is a frontend-only presentation flow.

## Documentation map

- [`docs/REPORT.md`](docs/REPORT.md) — competition report and judging strategy
- [`docs/PRD.md`](docs/PRD.md) — product requirements and acceptance criteria
- [`docs/TRD.md`](docs/TRD.md) — technical requirements and storage contract
- [`docs/Design.md`](docs/Design.md) — visual system and interaction specifications
- [`docs/architecture.md`](docs/architecture.md) — application structure and data flow
- [`docs/Rules.md`](docs/Rules.md) — competition rules and compliance checklist
- [`docs/Phases.md`](docs/Phases.md) — 24-hour execution plan
- [`docs/Memory.md`](docs/Memory.md) — living decisions and handoff notes

## Development status

The first design foundation is implemented: the responsive app shell, Student/Admin views, seeded domain data, complaint flow, room allocation, mess board, announcements, and local persistence are available. Secondary editing screens and deeper automated browser coverage remain future slices.

## Reproducible setup

The implementation stack is Next.js with TypeScript. From the project root:

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run lint
npm run build
```

Open `http://localhost:3000/login` after `npm run dev`. Choose Student or Admin login, then use **Log out** in the top bar to return to the login page. Use **Reset data** in the left rail to restore the starting data.

The project pins its Node.js version in `.nvmrc` and commits its npm lockfile.

## Deploy on Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Keep the framework preset as **Next.js**.
4. Use the default build settings.
5. Deploy.

Vercel detects the Next.js app automatically. Docker is not part of the normal development or deployment flow; the root `Dockerfile` is retained only as a clean-machine fallback for the repository build requirements.

## Competition compliance

The official PDF prohibits LLMs, AI coding assistants, agentic models, AI-generated code, and AI-generated content during the competition. The team must verify with organizers whether any pre-event planning material may be retained or used during the event. All implementation, copy, assets, and design must be original and created within the official period.
