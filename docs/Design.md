# HostelHub Design System

## 1. Design direction

### Bold Campus Editorial

HostelHub should feel like a confident campus publication turned into a useful digital product. It must be expressive enough to stand out in judging while remaining fast to scan for a student who needs to take action.

The design is not a generic SaaS dashboard and not a copy of an existing hostel portal. It combines editorial typography, bold color blocks, structured grids, and practical interaction states.

## 2. Design principles

1. **Make the next action obvious.** Every important screen has one clear primary action.
2. **Use visual rhythm.** Mix compact operational cards with larger editorial feature blocks.
3. **Show status honestly.** Pending, in-progress, and resolved states remain visible in text and iconography.
4. **Respect student attention.** A student should find room, complaint, menu, and notices quickly.
5. **Make mobile a first-class experience.** Mobile is the primary student context, not a compressed desktop.
6. **Make the product feel authored.** Use original labels, layouts, illustrations, and seeded content.

## 3. Visual language

### Palette

Use CSS variables so the visual system can be adjusted without rewriting components.

| Token | Direction | Use |
|---|---|---|
| `--ink` | Deep blue-black | Main text, borders, primary navigation |
| `--paper` | Warm off-white | Main page canvas |
| `--electric` | Acid lime | Primary action, positive emphasis |
| `--signal` | Coral red | Urgent state, high-priority work |
| `--sky` | Bright cobalt blue | Informational blocks and links |
| `--sun` | Warm yellow | Attention, notices, highlights |
| `--muted` | Dusty blue-grey | Secondary text and inactive surfaces |

The palette must meet readable contrast for body text. Bright colors are accents, not the only carrier of meaning.

### Typography

- Display: a bold, distinctive sans-serif with tight tracking for page titles.
- Body: a highly readable sans-serif for forms, data, and supporting copy.
- Labels: uppercase or small-cap treatment with increased tracking, used sparingly.
- Numerals: large and tabular where metrics need fast comparison.

The implementation should provide system fallbacks so the app remains usable if external fonts are unavailable.

### Shape and depth

- Use medium-radius cards rather than soft, floating glass panels.
- Prefer visible borders and offset shadows to communicate structure.
- Keep shadows short and directional.
- Use a small set of consistent radii.
- Use hand-authored inline SVG icons with a consistent stroke instead of a mixed symbol set.

## 4. Layout system

### Desktop

- Persistent left navigation rail
- Main content grid with a wide primary column and narrow supporting column
- Editorial hero block at the top of the dashboard
- Metric cards below the hero
- Data-heavy sections use full-width panels

### Tablet

- Compact navigation rail or top navigation
- Two-column content where space allows
- Tables convert to card rows when columns become cramped

### Mobile

- Single-column flow
- Sticky bottom navigation or compact top bar
- Primary action remains reachable with one thumb
- Metric cards become horizontal or two-up scrollable blocks
- Room and complaint rows become stacked cards
- Modals become full-height sheets where appropriate

## 5. Component inventory

- `AppShell`
- `DemoRoleSwitcher`
- `Sidebar`
- `MobileNav`
- `EditorialHeader`
- `MetricCard`
- `QuickActionCard`
- `StatusBadge`
- `ComplaintCard`
- `ComplaintTimeline`
- `ComplaintForm`
- `RoomCard`
- `RoomAllocationDialog`
- `MenuCard`
- `AnnouncementCard`
- `DataTable`
- `FilterBar`
- `Modal`
- `Toast`
- `EmptyState`
- `ResetDemoButton`

## 6. Interaction states

Every interactive component needs intentional states:

- Default
- Hover
- Keyboard focus
- Pressed
- Disabled
- Loading, if an artificial transition is used
- Success
- Validation error
- Empty
- Destructive confirmation

Use motion to explain change, not to delay the user. Keep transitions short and respect `prefers-reduced-motion`.

## 7. Content rules

- Use short, direct sentences.
- Prefer action-oriented labels: `Raise complaint`, `Assign room`, `Publish notice`.
- Do not use fake production claims.
- Clearly label demo controls and local-only data.
- Use realistic but original names, room numbers, complaints, menu items, and announcements.
- Avoid placeholder text such as `Lorem ipsum` in the final demo.

## 8. Accessibility requirements

- All form controls have visible labels or accessible names.
- Keyboard focus is visible against every surface.
- Status is communicated through text and iconography, not color alone.
- Body text remains readable at mobile widths.
- Dialogs trap focus and close predictably.
- Interactive targets are large enough for touch.
- Decorative illustrations have empty alt text; meaningful images have descriptive alt text.
- Reduced-motion preferences are respected.
- Motion is subtle: cards enter once, bars animate when data changes, and hover lift is limited to actionable surfaces.

## 9. Visual quality gate

Before submission, review each major screen at mobile and desktop widths:

- Is the hierarchy obvious in three seconds?
- Is the primary action easy to find?
- Are cards aligned and intentionally spaced?
- Are empty, error, and success states designed?
- Do long names and descriptions wrap safely?
- Does the interface still feel like one product across Student and Admin views?
