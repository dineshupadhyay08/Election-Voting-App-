# UI Pages, Component Tree, Frontend & AI Architecture

---

## 1. UI Pages (Complete Route Map)

### 1.1 Public Routes (Unauthenticated)

| Route | Page | Description |
|-------|------|-------------|
| `/` | LandingPage | Hero, features, CTA, social proof |
| `/login` | LoginPage | Email/password login |
| `/register` | RegisterPage | Signup form |
| `/forgot-password` | ForgotPasswordPage | Request reset link |
| `/reset-password/:token` | ResetPasswordPage | Set new password |
| `/verify-email/:token` | VerifyEmailPage | Email verification handler |

### 1.2 Protected — Voter Routes

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | VoterDashboardPage | Overview, live elections, recent activity |
| `/elections` | ElectionsPage | Browse all elections with filters |
| `/elections/live` | LiveElectionsPage | Live elections only |
| `/elections/:id` | ElectionDetailPage | Election info, candidates, countdown |
| `/candidates` | CandidatesPage | All candidates grid |
| `/candidates/:id` | CandidateDetailPage | Profile, gallery, manifesto, vote |
| `/candidates/compare` | CandidateComparisonPage | Side-by-side comparison |
| `/search` | SearchResultsPage | Global search results |
| `/profile` | ProfilePage | User profile & settings |
| `/voting-history` | VotingHistoryPage | Past votes |
| `/notifications` | NotificationsPage | Full notification list |

### 1.3 Protected — Admin Routes

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | AdminDashboardPage | KPIs, charts, quick actions |
| `/admin/elections` | ManageElectionsPage | CRUD table + form modal |
| `/admin/elections/new` | CreateElectionPage | Full-page election form |
| `/admin/elections/:id/edit` | EditElectionPage | Edit election |
| `/admin/candidates` | ManageCandidatesPage | CRUD table + form |
| `/admin/candidates/new` | CreateCandidatePage | Full-page candidate form |
| `/admin/analytics` | AnalyticsPage | Deep analytics & charts |
| `/admin/reports` | ReportsPage | Exportable reports |
| `/admin/activity-logs` | ActivityLogsPage | Audit trail viewer |
| `/admin/ai-insights` | AIAdminInsightsPage | AI-generated admin intelligence |

### 1.4 Error Routes

| Route | Page |
|-------|------|
| `/unauthorized` | UnauthorizedPage (403) |
| `*` | NotFoundPage (404) |

---

## 2. Dashboard Pages (Detailed Layout)

### 2.1 Voter Dashboard (`/dashboard`)

```
┌──────────────────────────────────────────────────────────────┐
│  TopNavbar: Logo | Search | Notifications | Theme | Avatar  │
├──────────┬───────────────────────────────────────────────────┤
│          │  Welcome back, {name} 👋                          │
│ Sidebar  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│          │  │ Live    │ │ Upcoming│ │ Voted   │ │ Total   │ │
│ • Dash   │  │ Elections│ │ Elections│ │ Elections│ │ Candidates│
│ • Elections│ │   3     │ │   5     │ │   2     │ │   24    │ │
│ • Candidates│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│ • History│                                                   │
│ • Profile│  Live Elections Now                               │
│          │  ┌─────────────────────────────────────────────┐ │
│ ── AI ── │  │ ElectionCard × 3 (horizontal scroll mobile) │ │
│ • Chat   │  └─────────────────────────────────────────────┘ │
│          │                                                   │
│          │  Recommended For You          Recent Activity      │
│          │  [CandidateCard grid]         [Activity feed]      │
└──────────┴───────────────────────────────────────────────────┘
```

### 2.2 Admin Dashboard (`/admin`)

```
┌──────────────────────────────────────────────────────────────┐
│  TopNavbar + Admin badge                                     │
├──────────┬───────────────────────────────────────────────────┤
│          │  Platform Overview                                │
│ Sidebar  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│          │  │Users │ │Elecs │ │Votes │ │Live  │ │Turnout│   │
│ • Overview│  │ 1.2k │ │  18  │ │ 847  │ │  3   │ │ 72%  │   │
│ • Elections│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
│ • Candidates│                                                │
│ • Analytics│  ┌─────────────────────┐ ┌───────────────────┐  │
│ • Reports  │  │ VoteBarChart        │ │ PartyPieChart     │  │
│ • Logs     │  │ (Recharts)          │ │ (Recharts)        │  │
│ • AI Insights│ └─────────────────────┘ └───────────────────┘  │
│          │                                                   │
│          │  Recent Activity Logs    Quick Actions            │
│          │  [DataTable]             [+ Election] [+ Candidate]│
└──────────┴───────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
App
├── Providers (QueryClient, Auth, Theme, Toast)
├── Router
│   ├── PublicLayout
│   │   ├── LandingPage
│   │   └── AuthLayout
│   │       ├── LoginPage → LoginForm
│   │       ├── RegisterPage → RegisterForm
│   │       ├── ForgotPasswordPage → ForgotPasswordForm
│   │       ├── ResetPasswordPage → ResetPasswordForm
│   │       └── VerifyEmailPage
│   │
│   └── AppLayout (Protected)
│       ├── Sidebar
│       │   ├── NavItem × N
│       │   ├── ThemeToggle
│       │   └── UserMenu
│       ├── TopNavbar
│       │   ├── GlobalSearch / SmartSearchBar
│       │   ├── NotificationBell → NotificationPanel
│       │   └── UserAvatar → DropdownMenu
│       ├── MobileNav
│       │
│       ├── Voter Routes
│       │   ├── VoterDashboardPage
│       │   │   ├── KPICard × 4
│       │   │   ├── ElectionGrid → ElectionCard
│       │   │   └── ActivityFeed
│       │   ├── ElectionsPage
│       │   │   ├── PageHeader
│       │   │   ├── ElectionFilters
│       │   │   └── ElectionGrid → ElectionCard
│       │   ├── ElectionDetailPage
│       │   │   ├── ElectionCountdown
│       │   │   ├── CandidateGrid → CandidateCard
│       │   │   ├── AIChatbot (floating)
│       │   │   └── AIFAQPanel
│       │   ├── CandidateDetailPage
│       │   │   ├── CandidateProfile
│       │   │   ├── CandidateGallery
│       │   │   ├── CandidateManifesto
│       │   │   ├── AICandidateSummary
│       │   │   ├── AITranslationToggle
│       │   │   └── VoteConfirmModal
│       │   ├── CandidateComparisonPage
│       │   │   └── AIComparisonPanel
│       │   ├── ProfilePage → ProfileForm
│       │   └── VotingHistoryPage → DataTable
│       │
│       └── Admin Routes
│           ├── AdminDashboardPage
│           │   ├── KPICard × 5
│           │   ├── VoteBarChart, PartyPieChart, TurnoutLineChart
│           │   └── AIAdminInsights (widget)
│           ├── ManageElectionsPage
│           │   ├── DataTable
│           │   └── ElectionForm (Dialog/Sheet)
│           ├── ManageCandidatesPage
│           │   ├── DataTable
│           │   └── CandidateForm (Dialog/Sheet)
│           ├── AnalyticsPage → Charts suite
│           ├── ReportsPage → Export buttons
│           ├── ActivityLogsPage → DataTable + filters
│           └── AIAdminInsightsPage → AIAdminInsights
│
├── AIChatbot (global floating widget — voter routes)
└── Toaster (Shadcn toast)
```

---

## 4. Authentication Flow

### 4.1 Registration Flow

```
User fills RegisterForm (Zod validated)
        │
        ▼
POST /api/v1/auth/register
        │
        ├── Validate input (Zod)
        ├── Check email uniqueness
        ├── Hash password (bcrypt, 12 rounds)
        ├── Create user (isEmailVerified: false)
        ├── Generate email verification token (crypto.randomBytes)
        ├── Store hashed token + 24h expiry
        ├── Send verification email (Nodemailer)
        ├── Log activity: USER_REGISTER
        └── Return 201 { message: "Check your email" }
        │
        ▼
User clicks email link → /verify-email/:token
        │
        ▼
POST /api/v1/auth/verify-email/:token
        │
        ├── Find user by hashed token + not expired
        ├── Set isEmailVerified: true
        ├── Clear token fields
        ├── Log: EMAIL_VERIFY
        └── Redirect to /login?verified=true
```

### 4.2 Login Flow

```
User fills LoginForm
        │
        ▼
POST /api/v1/auth/login
        │
        ├── Rate limit check (5 attempts / 15 min)
        ├── Find user by email (+password select)
        ├── Check account lock (lockUntil)
        ├── Compare password (bcrypt)
        │   ├── Fail → increment loginAttempts, maybe lock
        │   └── Success → reset loginAttempts
        ├── Generate JWT { userId, role }
        ├── Set HTTP-only cookie:
        │     accessToken; HttpOnly; Secure; SameSite=Strict; Max-Age=7d
        ├── Update lastLoginAt
        ├── Log: USER_LOGIN
        └── Return 200 { user: { id, name, email, role } }
        │
        ▼
Frontend: AuthContext stores user, redirect by role
        ├── ADMIN → /admin
        └── VOTER → /dashboard
```

### 4.3 Protected Route Flow (Frontend)

```
Route guard: <ProtectedRoute roles={['VOTER','ADMIN']}>
        │
        ├── AuthContext.user === null → redirect /login
        ├── user.role not in allowed roles → redirect /unauthorized
        └── Render children
```

### 4.4 API Auth Middleware Flow (Backend)

```
Request with cookie: accessToken
        │
        ▼
auth.middleware.js
        │
        ├── Extract token from req.cookies.accessToken
        ├── Verify JWT (jsonwebtoken)
        ├── Decode { userId, role }
        ├── Fetch user from DB (exclude password)
        ├── Check isActive === true
        ├── Attach req.user = { id, role, ... }
        └── next()
        │
        ▼
role.middleware.js (if admin route)
        │
        ├── req.user.role === 'ADMIN' → next()
        └── else → 403 Forbidden
```

### 4.5 Forgot / Reset Password Flow

```
POST /forgot-password { email }
  → Find user (don't reveal if exists)
  → Generate reset token (hashed, 1h expiry)
  → Send email with link: /reset-password/:token
  → Return 200 "If email exists, link sent"

POST /reset-password/:token { newPassword }
  → Validate token + expiry
  → Hash new password
  → Clear reset token fields
  → Invalidate existing sessions (optional: token version)
  → Log: PASSWORD_RESET
  → Return 200 "Password updated"
```

### 4.6 Logout Flow

```
POST /api/v1/auth/logout
  → res.clearCookie('accessToken')
  → Log: USER_LOGOUT
  → Frontend: clear AuthContext, redirect /login
```

---

## 5. Frontend Architecture

### 5.1 State Management Strategy

| State Type | Solution |
|------------|----------|
| Server state | TanStack Query (cache, refetch, mutations) |
| Auth state | AuthContext (user, login, logout, isLoading) |
| Theme state | ThemeContext (dark/light/system) |
| Form state | React Hook Form + Zod resolver |
| UI ephemeral | useState / useReducer locally |
| URL state | React Router search params (filters, pagination) |

### 5.2 TanStack Query Key Convention

```javascript
// constants/queryKeys.js
export const queryKeys = {
  auth: { me: ['auth', 'me'] },
  elections: {
    all: (filters) => ['elections', filters],
    detail: (id) => ['elections', id],
    live: ['elections', 'live'],
  },
  candidates: {
    all: (filters) => ['candidates', filters],
    detail: (id) => ['candidates', id],
  },
  votes: {
    check: (electionId) => ['votes', 'check', electionId],
    history: ['votes', 'history'],
  },
  notifications: {
    all: ['notifications'],
    unreadCount: ['notifications', 'unread-count'],
  },
  analytics: {
    dashboard: ['analytics', 'dashboard'],
    election: (id) => ['analytics', 'election', id],
  },
};
```

### 5.3 Axios Instance

```javascript
// lib/axios.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // send cookies
});

// Response interceptor: 401 → logout + redirect
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // trigger logout in AuthContext
    }
    return Promise.reject(error);
  }
);
```

### 5.4 Design System Tokens

```css
/* CSS Variables in globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 262 83% 58%;        /* Purple accent (Linear-like) */
  --primary-foreground: 0 0% 100%;
  --muted: 240 4.8% 95.9%;
  --border: 240 5.9% 90%;
  --radius: 0.75rem;
  --sidebar-width: 260px;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 262 83% 65%;
  --muted: 240 3.7% 15.9%;
  --border: 240 3.7% 15.9%;
}
```

### 5.5 Animation Strategy (Framer Motion)

| Element | Animation |
|---------|-----------|
| Page transitions | `PageTransition` wrapper — fade + slide up |
| Cards | Stagger children on grid load |
| Modals | Scale + fade via Shadcn Dialog |
| Sidebar | Collapse width transition |
| Vote confirmation | Confetti or pulse animation |
| Skeleton loaders | Shimmer while TanStack Query loading |

### 5.6 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `< 768px` | Bottom nav, collapsed sidebar (sheet), single column |
| `768–1024px` | Icon-only sidebar, 2-column grids |
| `> 1024px` | Full sidebar, multi-column dashboards |

---

## 6. AI Integration Plan

### 6.1 Architecture Overview

```
Frontend (AI Components)
        │
        ▼ POST /api/v1/ai/*
Backend AI Service (ai.service.js)
        │
        ├── Input sanitization & prompt injection guard
        ├── Rate limiter (10 req/min/user for chat)
        ├── Context builder (RAG-lite: fetch election/candidate data)
        ├── Prompt template engine (prompts/*.js)
        ├── AI Provider abstraction
        │     ├── OpenAI (primary)
        │     └── Anthropic (fallback — optional)
        ├── Response parser & cache
        └── Activity log: AI_QUERY
```

### 6.2 AI Provider Abstraction

```javascript
// config/ai.js
module.exports = {
  provider: process.env.AI_PROVIDER || 'openai',
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',        // cost-effective default
    maxTokens: 1024,
  },
  rateLimits: {
    chat: { windowMs: 60000, max: 10 },
    summary: { windowMs: 3600000, max: 20 },
  },
  cache: {
    summaryTtl: 86400000,        // 24h — store in candidate.aiSummary
  },
};
```

### 6.3 Feature-by-Feature AI Plan

| Feature | Input | Prompt Strategy | Output | Caching |
|---------|-------|-----------------|--------|---------|
| **AI Chatbot** | User message + optional election/candidate context | System prompt: neutral election assistant; include relevant DB context | Streaming text (SSE) | Session in AIConversation |
| **Candidate Summary** | Candidate profile + manifesto | Summarize in 150 words, neutral tone, highlight key promises | Text block | Cache on candidate doc (24h) |
| **Candidate Comparison** | 2–4 candidate IDs | Fetch all profiles; structured comparison prompt | Markdown table + narrative | No cache (on-demand) |
| **Smart Search** | NL query string | Parse intent → return structured filters `{ status, category, party, q }` | JSON filters | No cache |
| **AI FAQ** | Election ID | Generate 5–10 FAQs from election + candidate data | FAQ array | Cache 24h per election |
| **AI Translation** | Text + target language | Translate manifesto/summary | Translated text | Cache by content hash + lang |
| **Election Assistant** | User preferences + live elections | Neutral guidance: explain options, no endorsement | Conversational | Session-based |
| **Admin Insights** | Aggregated analytics data | Analyze turnout, anomalies, predictions | Insight cards with severity | Cache 1h |

### 6.4 Prompt Safety Rules

1. **System prompts** always include: "You are a neutral election information assistant. Never endorse candidates. Present facts only."
2. **Input sanitization:** Strip HTML, limit length (2000 chars), block known injection patterns
3. **Output filtering:** No political endorsements, no misinformation
4. **Rate limiting:** Per-user and global limits on all AI endpoints
5. **Cost control:** Use `gpt-4o-mini` for most tasks; `gpt-4o` only for complex comparisons
6. **Fallback:** If AI unavailable, return cached summary or graceful error message
7. **Audit:** Log all AI queries in ActivityLog with truncated prompt/response

### 6.5 RAG Context Builder (Lightweight)

```javascript
// ai/rag/contextBuilder.js
async function buildElectionContext(electionId) {
  const election = await Election.findById(electionId);
  const candidates = await Candidate.find({ election: electionId })
    .select('fullName party motto manifesto.highlights experience');
  return {
    election: { title, description, category, status, dates },
    candidates: candidates.map(c => ({ name, party, highlights, experience })),
  };
}
```

No vector DB in MVP — structured context injection is sufficient for election domain.

### 6.6 Frontend AI Components

| Component | Location | UX |
|-----------|----------|-----|
| `AIChatbot` | Floating button (bottom-right) | Slide-up panel, streaming messages, typing indicator |
| `AICandidateSummary` | Candidate detail page | Collapsible card, "Generate Summary" button |
| `AIComparisonPanel` | Comparison page | Select 2–4 candidates, generate comparison |
| `SmartSearchBar` | TopNavbar | NL input with sparkle icon, parses to filters |
| `AIFAQPanel` | Election detail | Accordion FAQ items |
| `AITranslationToggle` | Manifesto section | Language dropdown, toggle translated view |
| `AIAdminInsights` | Admin dashboard | Insight cards with icons (info/warning/success) |

### 6.7 Streaming Implementation (Chatbot)

```
Frontend: EventSource or fetch with ReadableStream
Backend:  res.setHeader('Content-Type', 'text/event-stream')
          for await (const chunk of aiStream) {
            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
          }
          res.write('data: [DONE]\n\n');
```

---

## 7. Reusable Components List

### 7.1 Layout Components

| Component | Props | Usage |
|-----------|-------|-------|
| `AppLayout` | `children` | Main dashboard shell |
| `AuthLayout` | `children, title` | Centered auth pages |
| `PublicLayout` | `children` | Landing page wrapper |
| `Sidebar` | `items, collapsed` | Navigation sidebar |
| `TopNavbar` | — | Header with search, notifications |
| `MobileNav` | — | Bottom navigation (mobile) |
| `PageHeader` | `title, description, actions` | Page title bar |

### 7.2 Data Display

| Component | Props | Usage |
|-----------|-------|-------|
| `DataTable` | `columns, data, pagination, sorting` | Admin tables |
| `ElectionCard` | `election, onClick` | Election grid item |
| `CandidateCard` | `candidate, showVoteBtn` | Candidate grid item |
| `KPICard` | `title, value, icon, trend` | Dashboard metrics |
| `StatusBadge` | `status` | UPCOMING/LIVE/COMPLETED |
| `EmptyState` | `icon, title, description, action` | No data states |
| `ErrorState` | `message, onRetry` | Error boundaries |

### 7.3 Forms & Input

| Component | Props | Usage |
|-----------|-------|-------|
| `FormField` | Shadcn Form wrapper | All forms |
| `ImageUpload` | `onUpload, preview, multiple` | Avatar, gallery |
| `RichTextEditor` | `value, onChange` | Manifesto editor (P1) |
| `DateRangePicker` | `start, end, onChange` | Election dates |
| `SearchInput` | `value, onChange, debounce` | Search bars |
| `FilterPanel` | `filters, onApply` | Sidebar filters |
| `ConfirmDialog` | `title, onConfirm` | Delete/vote confirm |

### 7.4 Charts (Recharts wrappers)

| Component | Props | Usage |
|-----------|-------|-------|
| `VoteBarChart` | `data: [{name, votes}]` | Candidate vote bars |
| `PartyPieChart` | `data: [{party, count}]` | Party distribution |
| `TurnoutLineChart` | `data: [{time, votes}]` | Votes over time |
| `AnalyticsCard` | `title, chart, footer` | Chart container |

### 7.5 Feedback & Utility

| Component | Props | Usage |
|-----------|-------|-------|
| `LoadingSpinner` | `size` | Inline loading |
| `Skeleton` | Shadcn | Content placeholders |
| `PageTransition` | `children` | Framer Motion wrapper |
| `ThemeToggle` | — | Dark/light switch |
| `NotificationBell` | — | Bell + unread badge |
| `Toast` | Shadcn | Success/error toasts |

---

*Next: [04-DEPLOYMENT-SECURITY-ROADMAP.md](./04-DEPLOYMENT-SECURITY-ROADMAP.md)*
