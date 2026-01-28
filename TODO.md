# TODO: Update Candidates.jsx for Mobile UI

- [x] Import ArrowLeft from lucide-react
- [x] Update main div to add light grey to light lavender gradient for mobile (<768px)
- [x] Modify header: hide desktop header on mobile, add mobile header with back arrow, title "Candidates", and subtitle
- [x] Update candidates container to use grid-cols-1 for mobile
- [x] Redesign candidate cards: horizontal layout for mobile (flex-row), vertical for desktop
  - [x] Photo: left side, rounded rectangle
  - [x] Details: center, name bold large, party row with icon, age line, priorities (2 bullets + "+2 more" in grey)
  - [x] Badge: right side, party icon or green age badge for independent
  - [x] Buttons: bottom-left inside details, "View Profile" outlined purple, "Vote" solid green
- [x] Ensure desktop UI remains unchanged (>=768px)
- [x] Keep all existing functionality (filters, admin buttons, etc.)
- [x] Test mobile view and interactions
