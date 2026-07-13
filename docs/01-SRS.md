# Software Requirement Specification (SRS)
## VoteFlow AI — Election Voting SaaS Platform

**Version:** 1.0  
**Date:** July 11, 2026  
**Status:** Architecture & Planning Phase  
**Stack:** MERN (MongoDB, Express, React/Vite, Node.js)

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for **VoteFlow AI**, a production-ready, AI-powered Election Voting SaaS platform. It serves as the authoritative reference for developers, designers, DevOps engineers, and stakeholders before implementation begins.

### 1.2 Scope
VoteFlow AI is a multi-tenant-ready election management platform enabling:
- **Admins** to create elections, manage candidates, monitor live voting, view analytics, and receive AI-driven insights.
- **Voters** to browse elections, explore candidate profiles/manifestos, cast one vote per election, and interact with AI assistants.
- **Platform operators** to deploy, secure, and scale the system in production environments.

This is **not** a beginner CRUD application. It must meet enterprise SaaS standards comparable to Linear, Vercel, Clerk, Notion, Stripe, GitHub, and Supabase in UX polish, architecture, and security posture.

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|------------|
| SaaS | Software as a Service |
| JWT | JSON Web Token |
| RBAC | Role-Based Access Control |
| SRS | Software Requirement Specification |
| MVP | Minimum Viable Product |
| PII | Personally Identifiable Information |
| RAG | Retrieval-Augmented Generation |
| SSE | Server-Sent Events |

### 1.4 References
- Existing codebase: `client/`, `server/` (basic MERN election app)
- OWASP Top 10 (2021)
- GDPR / data minimization principles
- MongoDB schema design best practices

### 1.5 Document Overview
Sections 2–4 cover system context and constraints. Sections 5–8 define functional requirements. Section 9 covers non-functional requirements. Sections 10–12 cover migration from the existing codebase.

---

## 2. Overall Description

### 2.1 Product Perspective
VoteFlow AI evolves the existing Election Voting App into a modular SaaS product with:
- Premium UI/UX (dark/light themes, animations, responsive dashboards)
- Full auth lifecycle (signup, email verification, forgot/reset password)
- Real-time election status, notifications, analytics
- AI layer for voter assistance and admin intelligence
- Production-grade security, logging, and deployment pipeline

### 2.2 Product Functions (High-Level)
1. User authentication & authorization (Admin, Voter)
2. Election lifecycle management (Upcoming → Live → Completed)
3. Candidate management (profile, gallery, manifesto)
4. Secure one-vote-per-election enforcement
5. Search, filter, and discovery
6. Notifications & activity logs
7. Reports, charts, and analytics dashboards
8. AI chatbot, summaries, comparisons, smart search, translation, admin insights

### 2.3 User Classes & Characteristics

| Role | Description | Permissions |
|------|-------------|-------------|
| **Guest** | Unauthenticated visitor | View public landing, auth pages only |
| **Voter** | Registered, verified user | Browse elections, vote (once/election), profile, AI tools |
| **Admin** | Election administrator | Full CRUD on elections/candidates, analytics, reports, AI insights |
| **Super Admin** *(Future)* | Platform operator | Tenant/org management, system config |

### 2.4 Operating Environment
- **Client:** Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions)
- **Server:** Node.js 20 LTS, Express 4.x
- **Database:** MongoDB Atlas (production), local MongoDB (development)
- **CDN/Storage:** Cloudinary for media
- **Email:** SMTP via Nodemailer (SendGrid/Resend in production)
- **AI:** OpenAI API / Anthropic API (configurable provider abstraction)

### 2.5 Design & Implementation Constraints
- MERN stack as specified (no framework migration)
- Feature-based folder structure (not layer-only)
- HTTP-only cookie JWT auth (no localStorage tokens)
- Zod validation on both client and server
- Must support migration from existing `voter`, `Election`, `Candidate` schemas

### 2.6 Assumptions & Dependencies
- MongoDB Atlas available for production
- Cloudinary account for image uploads
- SMTP/email provider configured
- AI API keys available (OpenAI or equivalent)
- HTTPS enforced in production (required for secure cookies)

---

## 3. System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                        VoteFlow AI Platform                      │
├──────────────┬──────────────────────────────┬───────────────────┤
│   Voter UI   │        Admin Dashboard        │   Public Pages    │
│  (React/Vite)│       (React/Vite)            │  (Landing/Auth)   │
└──────┬───────┴──────────────┬───────────────┴─────────┬─────────┘
       │                      │                         │
       └──────────────────────┼─────────────────────────┘
                              │ HTTPS / REST API
                    ┌─────────▼─────────┐
                    │  Express API      │
                    │  (Node.js)        │
                    ├───────────────────┤
                    │ Auth │ Elections  │
                    │ Vote │ Candidates │
                    │ AI   │ Analytics  │
                    └─────────┬─────────┘
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼─────┐     ┌───────▼──────┐    ┌──────▼──────┐
    │ MongoDB   │     │ Cloudinary   │    │ AI Provider │
    │ Atlas     │     │ (Media)      │    │ (OpenAI)    │
    └───────────┘     └──────────────┘    └─────────────┘
          │
    ┌─────▼─────┐
    │ Nodemailer│
    │ (SMTP)    │
    └───────────┘
```

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization (FR-AUTH)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | User registration with email, password, full name, mobile | P0 |
| FR-AUTH-02 | Password hashing with bcrypt (cost factor ≥ 12) | P0 |
| FR-AUTH-03 | Login with JWT stored in HTTP-only, Secure, SameSite=Strict cookie | P0 |
| FR-AUTH-04 | Logout clears auth cookie | P0 |
| FR-AUTH-05 | Email verification on signup (token-based, 24h expiry) | P0 |
| FR-AUTH-06 | Forgot password — send reset link via email | P0 |
| FR-AUTH-07 | Reset password with secure token (1h expiry, single use) | P0 |
| FR-AUTH-08 | Protected routes — redirect unauthenticated users | P0 |
| FR-AUTH-09 | RBAC: Admin vs Voter route/API guards | P0 |
| FR-AUTH-10 | Refresh token rotation (optional P1) or short-lived JWT + silent re-auth | P1 |
| FR-AUTH-11 | Account lockout after N failed login attempts | P1 |
| FR-AUTH-12 | Session invalidation on password change | P1 |

### 4.2 User Profile (FR-USER)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-USER-01 | View and edit profile (name, avatar, address, DOB, gender) | P0 |
| FR-USER-02 | Profile image upload via Cloudinary | P0 |
| FR-USER-03 | View voting history (elections voted, candidate chosen) | P0 |
| FR-USER-04 | View role badge (Admin/Voter) | P0 |
| FR-USER-05 | Account settings (change password, notification preferences) | P1 |

### 4.3 Election Management (FR-ELEC)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ELEC-01 | Admin CRUD elections (title, description, thumbnail, category, dates) | P0 |
| FR-ELEC-02 | Auto status: UPCOMING → LIVE → COMPLETED based on dates | P0 |
| FR-ELEC-03 | Manual override status (Admin only, with audit log) | P1 |
| FR-ELEC-04 | Categories: PANCHAYAT, WARD, ASSEMBLY, LOK_SABHA (+ extensible) | P0 |
| FR-ELEC-05 | Filter elections by status, category, date range | P0 |
| FR-ELEC-06 | Sort: newest, ending soon, most candidates | P0 |
| FR-ELEC-07 | Election detail page with candidate list and countdown | P0 |
| FR-ELEC-08 | Soft delete / archive elections | P1 |
| FR-ELEC-09 | Election rules & eligibility config (future: region-based) | P2 |

### 4.4 Candidate Management (FR-CAND)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CAND-01 | Admin CRUD candidates linked to one election | P0 |
| FR-CAND-02 | Candidate profile: bio, party, symbol, photo, experience | P0 |
| FR-CAND-03 | Candidate gallery (multiple images) | P0 |
| FR-CAND-04 | Candidate manifesto (rich text / markdown) | P0 |
| FR-CAND-05 | Candidate comparison view (side-by-side, 2–4 candidates) | P1 |
| FR-CAND-06 | Public candidate detail page with vote CTA (if election LIVE) | P0 |
| FR-CAND-07 | Vote count displayed (real-time or near-real-time) | P0 |

### 4.5 Voting (FR-VOTE)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-VOTE-01 | One vote per voter per election (enforced at DB + API) | P0 |
| FR-VOTE-02 | Vote only when election status = LIVE | P0 |
| FR-VOTE-03 | Vote confirmation modal with candidate summary | P0 |
| FR-VOTE-04 | Immutable vote record (no vote change after submission) | P0 |
| FR-VOTE-05 | Atomic vote increment (transaction or findOneAndUpdate) | P0 |
| FR-VOTE-06 | Vote receipt / confirmation screen | P1 |
| FR-VOTE-07 | Prevent voting if email unverified | P1 |

### 4.6 Search & Filter (FR-SEARCH)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SEARCH-01 | Global search: elections, candidates, parties | P0 |
| FR-SEARCH-02 | Debounced search with TanStack Query | P0 |
| FR-SEARCH-03 | Filter panel: status, category, party, date | P0 |
| FR-SEARCH-04 | AI smart search (natural language queries) | P1 |
| FR-SEARCH-05 | Search result highlighting and relevance ranking | P1 |

### 4.7 Notifications (FR-NOTIF)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NOTIF-01 | In-app notification center (bell icon + dropdown) | P0 |
| FR-NOTIF-02 | Notification types: election started, vote confirmed, admin alerts | P0 |
| FR-NOTIF-03 | Mark as read / mark all read | P0 |
| FR-NOTIF-04 | Email notifications for critical events (optional opt-in) | P1 |
| FR-NOTIF-05 | Real-time push via SSE or polling (P1) | P1 |

### 4.8 Reports & Analytics (FR-ANALYTICS)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ANALYTICS-01 | Admin dashboard KPIs: total elections, voters, votes, live count | P0 |
| FR-ANALYTICS-02 | Election-specific analytics: turnout, candidate breakdown | P0 |
| FR-ANALYTICS-03 | Charts: bar (votes by candidate), pie (party share), line (votes over time) | P0 |
| FR-ANALYTICS-04 | Export reports (CSV/PDF) — Admin only | P1 |
| FR-ANALYTICS-05 | Voter demographics aggregate (non-PII) | P2 |

### 4.9 Activity Logs (FR-AUDIT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUDIT-01 | Log admin actions: create/update/delete election/candidate | P0 |
| FR-AUDIT-02 | Log auth events: login, logout, failed attempts | P0 |
| FR-AUDIT-03 | Log vote events (anonymized voter ID hash optional) | P1 |
| FR-AUDIT-04 | Admin activity log viewer with filters | P0 |
| FR-AUDIT-05 | Retention policy (90 days default) | P1 |

### 4.10 AI Features (FR-AI)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AI-01 | AI Chatbot — contextual help on elections/candidates | P1 |
| FR-AI-02 | Candidate Summary — auto-generate from profile + manifesto | P1 |
| FR-AI-03 | Candidate Comparison — AI narrative comparing 2–4 candidates | P1 |
| FR-AI-04 | Smart Search — NL query → structured filters | P1 |
| FR-AI-05 | AI FAQ — dynamic FAQ from election/candidate data | P2 |
| FR-AI-06 | AI Translation — manifesto/summary in user's language | P2 |
| FR-AI-07 | AI Election Assistant — guided voting recommendations (neutral) | P2 |
| FR-AI-08 | AI Admin Insights — anomaly detection, turnout predictions, summaries | P1 |
| FR-AI-09 | Rate limiting on AI endpoints (per user/IP) | P0 |
| FR-AI-10 | Prompt injection sanitization | P0 |

### 4.11 UI/UX (FR-UI)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-UI-01 | Dark mode and light mode with system preference detection | P0 |
| FR-UI-02 | Responsive: mobile, tablet, desktop | P0 |
| FR-UI-03 | Dashboard layout: collapsible sidebar + top navbar | P0 |
| FR-UI-04 | Shadcn UI component library integration | P0 |
| FR-UI-05 | Framer Motion page transitions and micro-interactions | P0 |
| FR-UI-06 | Loading skeletons, empty states, error boundaries | P0 |
| FR-UI-07 | Toast notifications (success/error) | P0 |
| FR-UI-08 | Accessible forms (ARIA, keyboard nav, focus management) | P1 |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- API response time: p95 < 500ms for read endpoints
- Page load (LCP): < 2.5s on 4G
- AI endpoints: streaming responses where applicable; timeout 30s
- Pagination: default 20 items, max 100

### 5.2 Scalability
- Stateless API servers (horizontal scaling ready)
- MongoDB indexes on frequently queried fields
- Cloudinary CDN for all media
- Background jobs for email and AI batch processing (Bull/Agenda — P2)

### 5.3 Security
- HTTPS only in production
- Helmet.js security headers
- Express rate limiting (global + auth + AI endpoints)
- Input validation (Zod) on all write endpoints
- No sensitive data in JWT payload (only userId, role)
- CORS whitelist for frontend origin
- File upload: type/size validation, virus scan (P2)

### 5.4 Reliability
- Graceful error handling with consistent API error format
- Health check endpoint: `GET /api/health`
- Database connection retry logic
- Structured logging (Winston/Pino)

### 5.5 Maintainability
- Feature-based folder structure
- ESLint + Prettier
- JSDoc on public service functions
- Environment-based configuration

### 5.6 Usability
- WCAG 2.1 AA target for core flows
- Consistent design tokens (Tailwind + CSS variables)
- Clear empty/error states with actionable CTAs

---

## 6. External Interface Requirements

### 6.1 User Interfaces
See `docs/03-UI-AND-COMPONENTS.md` for full page and component inventory.

### 6.2 API Interfaces
REST JSON API under `/api/v1/*`. See `docs/02-DATABASE-AND-API.md`.

### 6.3 Hardware Interfaces
None (web-only).

### 6.4 Software Interfaces
- MongoDB Atlas
- Cloudinary Upload API
- SMTP (Nodemailer)
- OpenAI / Anthropic Chat Completions API

### 6.5 Communication Interfaces
- HTTPS REST
- Optional SSE for live election updates
- Email (HTML templates)

---

## 7. Migration from Existing Codebase

### 7.1 Current State Assessment
| Area | Current | Target |
|------|---------|--------|
| Auth | Register, login, JWT cookie | + email verify, forgot/reset, logout |
| User model | `voter` with `isAdmin` boolean | Rename to `User`, add roles enum, verification fields |
| Elections | Basic CRUD + auto status | + soft delete, search, notifications |
| Candidates | Basic profile | + gallery, manifesto, comparison |
| Voting | PATCH vote, votedElections array | + Vote collection, atomic transactions |
| Frontend | Tailwind, basic layout | Shadcn, TanStack Query, dark mode, Framer Motion |
| AI | None | Full AI module |
| Security | Basic auth middleware | Helmet, rate limit, audit logs |

### 7.2 Migration Strategy
1. **Phase 0:** Restructure folders (feature-based) without breaking existing API
2. **Phase 1:** Extend User schema; add auth flows
3. **Phase 2:** Add Vote, Notification, ActivityLog collections
4. **Phase 3:** Frontend rebuild with Shadcn + TanStack Query
5. **Phase 4:** AI module integration
6. **Phase 5:** Production hardening & deployment

---

## 8. Acceptance Criteria (MVP)

MVP is complete when:
- [ ] User can register, verify email, login, reset password
- [ ] Admin can CRUD elections and candidates with gallery/manifesto
- [ ] Voter can browse, search, filter, and vote once per live election
- [ ] Dashboards show real analytics with Recharts
- [ ] Notifications and activity logs functional
- [ ] At least 3 AI features live (Chatbot, Candidate Summary, Admin Insights)
- [ ] Dark/light mode, responsive, premium UI polish
- [ ] Security checklist passed (see Security Plan)
- [ ] Deployed to staging with CI/CD pipeline

---

*Next: [02-DATABASE-AND-API.md](./02-DATABASE-AND-API.md)*
