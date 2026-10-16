# HostelHub Project Memory

This is a living handoff file. Update it after each meaningful implementation step.

## Current status

- Phase: Interaction polish and judge-demo hardening
- Application code: Core frontend slice plus second interaction pass implemented
- Backend: Intentionally out of scope
- Persistence: Planned browser `localStorage`
- Validation: Typecheck, lint, unit tests, production build, and local HTTP smoke check pass

## Locked decisions

- Product name: HostelHub
- Problem statement: Hostel Management System
- Frontend: Next.js + TypeScript
- Views: Student and Admin
- Design: Bold Campus Editorial
- Data: Mock seed data plus browser `localStorage`
- Storage scope: Current browser/device only
- Authentication: Not included; login is a labelled frontend flow
- Documentation language: English

## Product decisions

- The primary judge flow is complaint creation → admin status update → student status review.
- Room allocation is the second major proof of practical functionality.
- Mess menu and announcements complete the student experience.
- Visual design is a scoring priority, not a final polish step.
- MVP scope is frozen around four domains: complaints, rooms, mess, announcements.

## Technical decisions

- Browser storage must be read only after client mount.
- Storage keys are namespaced with `hostelhub:`.
- Seed data must be deterministic.
- A reset-demo action is required for reliable judging.
- No API routes, database, payments, or cross-device sync.
- Announcement publishing, complaint timeline notes, room confirmation, and feedback comments remain local-only.

## Design decisions

- Use a high-contrast campus editorial identity.
- Combine warm paper surfaces, deep ink text, and electric accents.
- Use bold headings and structured borders instead of generic floating dashboard cards.
- Keep the interface readable, keyboard-usable, and responsive.
- Use hand-authored SVG icons and restrained motion so the product feels authored rather than generated.

## Open implementation items

- [x] Scaffold Next.js and TypeScript.
- [x] Pin Node version and create npm lockfile.
- [x] Add typed seed data.
- [x] Add storage adapter and reset behavior.
- [x] Build app shell.
- [x] Build complaint flow.
- [x] Build room allocation flow.
- [x] Build mess and announcement sections.
- [x] Add complaint timeline/detail view.
- [x] Add announcement publish/detail flow.
- [x] Add room search, filters, and confirmation.
- [x] Add Hostel Pulse and data-driven feedback average.
- [x] Add custom SVG icon language and restrained motion.
- [x] Add Student and Admin login routes with a browser session.
- [x] Keep the desktop sidebar fixed and non-scrolling.
- [x] Replace abstract dashboard copy with short, direct words.
- [x] Add room map, activity feed, profile menu, and global search.
- [x] Add overdue complaint sorting and mess rating summary.
- [x] Replace fixed hero dates with simple `Today` labels.
- [x] Add meaningful tests/smoke checks (domain tests plus local HTTP smoke check).
- [x] Add the optional Dockerfile fallback; Vercel remains the normal deployment path.

## Known limitations

- `localStorage` does not provide real multi-user behavior.
- Login does not provide security.
- Browser storage may be unavailable or cleared.
- The repository has been initialized as Git; no commit has been created yet.
- The official team name and final repository name are not known yet.

## Next concrete step

Review the live UI at mobile and desktop widths, then add browser-level coverage for the complaint, announcement, room, and localStorage flows before the competition submission.
