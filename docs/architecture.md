# HostelHub Architecture

## 1. Architecture summary

HostelHub is a single Next.js frontend with a client-side domain state layer. It uses deterministic seed data for the first render and hydrates browser-local mutations after mount. The app has no remote services.

```text
UI routes and views
        |
Reusable feature components
        |
Client domain state / actions
        |
Typed localStorage adapter
        |
Browser storage
```

Login routes (`/login`, `/login/student`, and `/login/admin`) write a small browser session. The session selects the Student or Admin view; it is a frontend presentation flow, not real security.

## 2. Proposed folder structure

```text
app/
  layout.tsx
  page.tsx
  globals.css

components/
  ui/
    icon.tsx
  shell/
  dashboard/
  complaints/
  rooms/
  mess/
  announcements/
  ui/

data/
  seed.ts

lib/
  storage.ts
  formatters.ts
  validation.ts

types/
  domain.ts

public/
  icons/
  illustrations/
```

The final implementation may adjust this structure to fit the chosen Next.js setup, but domain data, storage operations, and presentational components should remain separated.

## 3. View model

The competition demo has two labelled views:

```text
Student View
  - Overview
  - My room
  - Complaints
  - Mess menu
  - Announcements

Admin View
  - Overview
  - Complaints
  - Rooms
  - Mess menu
  - Announcements
```

The login path selects the displayed workflow. It does not claim to provide security or real authorization.

## 4. State flow

### Read flow

1. App loads deterministic seed state.
2. Client storage adapter runs after mount.
3. Valid stored collections replace the corresponding seed collections.
4. UI renders the hydrated data.

### Mutation flow

1. User performs an action in a feature component.
2. Domain action validates the input.
3. State provider updates the in-memory collection.
4. Storage adapter serializes and writes the collection.
5. UI displays confirmation or validation feedback.

### Reset flow

1. User activates Reset Demo.
2. App removes namespaced HostelHub keys.
3. App restores seed data.
4. UI shows a confirmation toast.

## 5. Domain modules

### Complaints

Owns complaint creation, filtering, status transitions, timeline formatting, validation, and persistence.

### Rooms

Owns occupancy calculations, room filtering, student allocation, and persistence.

### Mess

Owns day selection, meal display, feedback submission, and persistence.

### Announcements

Owns notice display, admin publishing, expiry labels, and persistence.

### Activity and search

The activity feed is a bounded local collection updated by complaint, room, notice, and feedback actions. Global search derives results from students, rooms, complaints, and announcements without adding a server index.

### Shell

Owns navigation, current view, responsive layout, login session, and global reset feedback.

## 6. Client-only boundary

Any module that reads `window`, `localStorage`, `matchMedia`, or browser events must execute only in a client component or client-side effect. Server-rendered layout should remain deterministic and must not depend on browser storage.

## 7. Error and empty-state strategy

- Invalid stored JSON falls back to seed data.
- A full or unavailable storage area does not prevent the user from using the current session.
- Empty complaints show an encouraging action prompt.
- No available rooms show a clear operational message.
- Empty announcements explain when the next notice will appear.
- Invalid forms keep user input and show the failed fields.

## 8. Deployment shape

The app deploys as a standard Next.js frontend on Vercel. No feature depends on a backend for the competition demo. The root Dockerfile is only a reproducibility fallback and is not needed for deployment.
