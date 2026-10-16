# HostelHub Technical Requirements Document

## 1. Technical direction

HostelHub is a client-side Next.js application. The frontend owns view state and browser-local persistence. There are no API routes, server actions, database calls, or authentication services in the competition MVP.

## 2. Stack

- Next.js with App Router
- TypeScript with strict type checking
- React client components only where browser interaction is required
- CSS variables plus a small custom component layer for the design system
- Optional utility classes may be used for layout, but visual tokens must remain centralized
- `localStorage` for demo persistence
- npm with a committed `package-lock.json`

The project should avoid a large UI kit or prebuilt dashboard template. Reusable components will be authored for this product so the visual result remains original.

## 3. Runtime and reproducibility

- Pin Node.js in `.nvmrc`.
- Keep all dependencies in `package.json` and `package-lock.json`.
- Do not require global packages.
- Keep the project buildable on a clean Linux machine.
- Deploy the frontend through Vercel with the default Next.js settings.
- Keep the root `Dockerfile` as an optional clean-machine fallback; it is not required for Vercel.
- Provide one offline-capable test command through `npm test`.
- Do not use absolute paths or secrets.

## 4. Browser-only persistence

### Storage principles

- Read storage after mount, never during server rendering.
- Keep all keys namespaced with `hostelhub:`.
- Store serializable JSON only.
- Validate parsed values before using them in the UI.
- Keep a deterministic seed dataset in source code.
- Expose a reset action for a reliable judge demo.

### Keys

```text
hostelhub:version
hostelhub:complaints
hostelhub:rooms
hostelhub:announcements
hostelhub:mess-menu
hostelhub:feedback
hostelhub:preferences
```

### Limitations to disclose

- Data exists only in the current browser and device.
- Clearing site data removes changes.
- Multiple judges or devices do not share state.
- Login is a presentation control, not security.

## 5. Core data models

```ts
type Role = 'student' | 'admin';

type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';
type ComplaintPriority = 'low' | 'medium' | 'high';

interface Student {
  id: string;
  name: string;
  initials: string;
  course: string;
  year: string;
  roomId: string;
}

interface Room {
  id: string;
  block: string;
  floor: number;
  number: string;
  capacity: number;
  occupantIds: string[];
  type: 'double' | 'triple';
}

interface Complaint {
  id: string;
  studentId: string;
  category: 'maintenance' | 'cleanliness' | 'electricity' | 'mess' | 'other';
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  timeline?: ComplaintUpdate[];
}

interface ComplaintUpdate {
  id: string;
  status: ComplaintStatus;
  note: string;
  actor: 'student' | 'admin';
  at: string;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  label: 'notice' | 'event' | 'maintenance' | 'urgent';
  publishedAt: string;
  expiresAt?: string;
}

interface Meal {
  id: string;
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

interface Feedback {
  id: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
```

## 6. State boundaries

### Persistent domain state

- Complaints
- Rooms and allocations
- Announcements
- Menu entries
- Feedback

### Session UI state

- Current role
- Active navigation section
- Open modal
- Search text
- Selected filters
- Toast visibility
- Form draft

Session UI state does not need to be persisted unless doing so improves the demo.

## 7. Hydration-safe storage adapter

The storage layer should expose typed operations such as:

```ts
readCollection<T>(key: StorageKey, fallback: T[]): T[];
writeCollection<T>(key: StorageKey, value: T[]): void;
resetDemo(): void;
```

Components should consume a hook or context that starts from seed data, hydrates from storage after mount, and prevents a server/client markup mismatch.

## 8. Validation and failure behavior

- Required form fields must be labelled and validated.
- Empty complaint descriptions must not be saved.
- Unknown storage data must be ignored in favor of the seed fallback.
- A failed write must not crash the page.
- Empty lists need intentional empty-state content.
- Destructive reset actions need confirmation or a clearly reversible demo affordance.

## 9. Testing requirements

The minimum meaningful checks are:

- Typecheck
- Lint
- Production build
- A test or smoke check for complaint creation, status update, room allocation, and local persistence

The exact command names must be recorded in `../README.md` after the app scaffold is created.
