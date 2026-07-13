# Database Schema, ER Diagram & API Specification

---

## 1. Folder Structure

### 1.1 Monorepo Root

```
Election-Voting-App/
├── client/                          # React + Vite frontend
├── server/                          # Node + Express backend
├── docs/                            # Architecture & planning docs
├── .github/
│   └── workflows/
│       ├── ci.yml                   # Lint, test, build
│       └── deploy.yml               # Deploy staging/production
├── docker-compose.yml               # Local dev (mongo, redis optional)
├── .env.example                     # Root env template
└── README.md
```

### 1.2 Backend — Feature-Based Structure

```
server/
├── src/
│   ├── app.js                       # Express app setup
│   ├── server.js                    # HTTP server entry
│   ├── config/
│   │   ├── index.js                 # Env config loader
│   │   ├── database.js              # MongoDB connection
│   │   ├── cloudinary.js
│   │   ├── mailer.js
│   │   └── ai.js                    # AI provider config
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.validation.js
│   │   │   └── auth.utils.js        # Token generation
│   │   │
│   │   ├── users/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.routes.js
│   │   │   └── user.validation.js
│   │   │
│   │   ├── elections/
│   │   │   ├── election.model.js
│   │   │   ├── election.controller.js
│   │   │   ├── election.service.js
│   │   │   ├── election.routes.js
│   │   │   └── election.validation.js
│   │   │
│   │   ├── candidates/
│   │   │   ├── candidate.model.js
│   │   │   ├── candidate.controller.js
│   │   │   ├── candidate.service.js
│   │   │   ├── candidate.routes.js
│   │   │   └── candidate.validation.js
│   │   │
│   │   ├── votes/
│   │   │   ├── vote.model.js
│   │   │   ├── vote.controller.js
│   │   │   ├── vote.service.js
│   │   │   ├── vote.routes.js
│   │   │   └── vote.validation.js
│   │   │
│   │   ├── notifications/
│   │   │   ├── notification.model.js
│   │   │   ├── notification.controller.js
│   │   │   ├── notification.service.js
│   │   │   └── notification.routes.js
│   │   │
│   │   ├── analytics/
│   │   │   ├── analytics.controller.js
│   │   │   ├── analytics.service.js
│   │   │   └── analytics.routes.js
│   │   │
│   │   ├── activityLogs/
│   │   │   ├── activityLog.model.js
│   │   │   ├── activityLog.service.js
│   │   │   └── activityLog.middleware.js
│   │   │
│   │   ├── uploads/
│   │   │   ├── upload.controller.js
│   │   │   ├── upload.service.js
│   │   │   ├── upload.routes.js
│   │   │   └── upload.middleware.js   # Multer config
│   │   │
│   │   └── ai/
│   │       ├── ai.controller.js
│   │       ├── ai.service.js
│   │       ├── ai.routes.js
│   │       ├── ai.validation.js
│   │       ├── prompts/               # Prompt templates
│   │       │   ├── candidateSummary.js
│   │       │   ├── comparison.js
│   │       │   ├── chatbot.js
│   │       │   └── adminInsights.js
│   │       └── rag/                   # RAG helpers (P2)
│   │           └── contextBuilder.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   └── asyncHandler.js
│   │
│   ├── shared/
│   │   ├── constants/
│   │   │   ├── roles.js
│   │   │   ├── electionStatus.js
│   │   │   └── httpStatus.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── catchAsync.js
│   │   │   ├── pagination.js
│   │   │   └── slugify.js
│   │   └── emails/
│   │       ├── sendEmail.js
│   │       └── templates/
│   │           ├── verifyEmail.html
│   │           ├── resetPassword.html
│   │           └── voteConfirmation.html
│   │
│   └── routes/
│       └── index.js                 # Mount all feature routes
│
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── .env.example
└── Dockerfile
```

### 1.3 Frontend — Feature-Based Structure

```
client/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── router.jsx               # React Router v6+ config
│   │   └── providers.jsx            # All context/query providers
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── authApi.js
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js
│   │   │   │   └── useLogin.js
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── ForgotPasswordForm.jsx
│   │   │   │   └── ResetPasswordForm.jsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   ├── ResetPasswordPage.jsx
│   │   │   │   └── VerifyEmailPage.jsx
│   │   │   └── schemas/
│   │   │       └── authSchema.js      # Zod schemas
│   │   │
│   │   ├── elections/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── ElectionCard.jsx
│   │   │   │   ├── ElectionGrid.jsx
│   │   │   │   ├── ElectionFilters.jsx
│   │   │   │   ├── ElectionCountdown.jsx
│   │   │   │   └── ElectionForm.jsx
│   │   │   ├── pages/
│   │   │   │   ├── ElectionsPage.jsx
│   │   │   │   ├── ElectionDetailPage.jsx
│   │   │   │   └── LiveElectionsPage.jsx
│   │   │   └── schemas/
│   │   │
│   │   ├── candidates/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── CandidateCard.jsx
│   │   │   │   ├── CandidateProfile.jsx
│   │   │   │   ├── CandidateGallery.jsx
│   │   │   │   ├── CandidateManifesto.jsx
│   │   │   │   ├── CandidateComparison.jsx
│   │   │   │   └── VoteConfirmModal.jsx
│   │   │   └── pages/
│   │   │       ├── CandidatesPage.jsx
│   │   │       └── CandidateDetailPage.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── voter/
│   │   │   │   ├── VoterDashboardPage.jsx
│   │   │   │   └── VotingHistoryPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.jsx
│   │   │       ├── ManageElectionsPage.jsx
│   │   │       ├── ManageCandidatesPage.jsx
│   │   │       ├── AnalyticsPage.jsx
│   │   │       ├── ReportsPage.jsx
│   │   │       └── ActivityLogsPage.jsx
│   │   │
│   │   ├── notifications/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   └── components/
│   │   │       ├── NotificationBell.jsx
│   │   │       └── NotificationPanel.jsx
│   │   │
│   │   ├── search/
│   │   │   ├── components/
│   │   │   │   ├── GlobalSearch.jsx
│   │   │   │   └── SmartSearchBar.jsx
│   │   │   └── hooks/
│   │   │       └── useSearch.js
│   │   │
│   │   ├── ai/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   │   ├── AIChatbot.jsx
│   │   │   │   ├── AICandidateSummary.jsx
│   │   │   │   ├── AIComparisonPanel.jsx
│   │   │   │   ├── AIFAQPanel.jsx
│   │   │   │   ├── AITranslationToggle.jsx
│   │   │   │   └── AIAdminInsights.jsx
│   │   │   └── hooks/
│   │   │       └── useAIChat.js
│   │   │
│   │   ├── profile/
│   │   │   ├── pages/
│   │   │   │   └── ProfilePage.jsx
│   │   │   └── components/
│   │   │       └── ProfileForm.jsx
│   │   │
│   │   └── landing/
│   │       └── pages/
│   │           └── LandingPage.jsx
│   │
│   ├── components/                  # Shared UI (Shadcn + custom)
│   │   ├── ui/                      # Shadcn primitives
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── form.jsx
│   │   │   ├── input.jsx
│   │   │   ├── table.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── skeleton.jsx
│   │   │   ├── toast.jsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopNavbar.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   └── PageHeader.jsx
│   │   ├── common/
│   │   │   ├── DataTable.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PageTransition.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── ImageUpload.jsx
│   │   └── charts/
│   │       ├── VoteBarChart.jsx
│   │       ├── PartyPieChart.jsx
│   │       ├── TurnoutLineChart.jsx
│   │       └── KPICard.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useMediaQuery.js
│   │   ├── usePagination.js
│   │   └── useLocalStorage.js
│   │
│   ├── lib/
│   │   ├── axios.js                 # Axios instance + interceptors
│   │   ├── queryClient.js           # TanStack Query config
│   │   └── utils.js                 # cn() helper, formatters
│   │
│   ├── constants/
│   │   ├── routes.js
│   │   ├── electionCategories.js
│   │   └── queryKeys.js
│   │
│   ├── styles/
│   │   └── globals.css              # Tailwind + CSS variables
│   │
│   └── main.jsx
├── components.json                  # Shadcn config
├── tailwind.config.js
├── vite.config.js
├── package.json
└── Dockerfile
```

---

## 2. Database Schema (MongoDB / Mongoose)

### 2.1 User Collection (`users`)

> Migrates from existing `voter` model with extended fields.

```javascript
{
  _id: ObjectId,
  fullName: String,              // required, trim
  email: String,                 // required, unique, lowercase
  password: String,              // required, select: false, bcrypt
  mobileNumber: String,          // required
  profileImage: String,          // Cloudinary URL
  gender: Enum["MALE","FEMALE","OTHER"],
  dateOfBirth: Date,
  address: {
    village: String,
    gramPanchayat: String,
    district: String,
    state: String,
    pincode: String
  },
  role: Enum["VOTER","ADMIN"],   // replaces isAdmin boolean
  isEmailVerified: Boolean,      // default: false
  emailVerificationToken: String,// hashed, select: false
  emailVerificationExpires: Date,
  passwordResetToken: String,    // hashed, select: false
  passwordResetExpires: Date,
  loginAttempts: Number,         // default: 0
  lockUntil: Date,
  notificationPreferences: {
    email: Boolean,              // default: true
    inApp: Boolean               // default: true
  },
  lastLoginAt: Date,
  isActive: Boolean,             // default: true (soft disable)
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ email: 1 }                      // unique
{ role: 1 }
{ isEmailVerified: 1 }
```

### 2.2 Election Collection (`elections`)

```javascript
{
  _id: ObjectId,
  title: String,                 // required
  slug: String,                  // unique, auto-generated
  description: String,
  thumbnail: String,             // Cloudinary URL
  category: Enum["PANCHAYAT","WARD","ASSEMBLY","LOK_SABHA"],
  startDate: Date,               // required
  endDate: Date,                 // required
  status: Enum["UPCOMING","LIVE","COMPLETED"],  // auto-computed
  isActive: Boolean,             // default: true
  totalVotes: Number,            // denormalized counter
  candidateCount: Number,          // denormalized
  createdBy: ObjectId,           // ref: User
  rules: {
    requireEmailVerification: Boolean,  // default: true
    maxCandidates: Number               // optional
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ slug: 1 }                       // unique
{ status: 1, category: 1 }
{ startDate: 1, endDate: 1 }
{ createdBy: 1 }
```

### 2.3 Candidate Collection (`candidates`)

```javascript
{
  _id: ObjectId,
  fullName: String,              // required
  slug: String,
  gender: Enum["MALE","FEMALE","OTHER"],
  dateOfBirth: Date,
  age: Number,
  fatherName: String,
  motherName: String,
  spouseName: String,
  mobileNumber: String,
  email: String,
  address: {
    village: String,
    district: String,
    state: String
  },
  party: String,                 // required
  partySymbol: String,           // image URL
  image: String,                 // primary photo, required
  gallery: [{                    // NEW
    url: String,
    caption: String,
    order: Number
  }],
  motto: String,
  manifesto: {                   // NEW — rich content
    content: String,             // markdown/HTML
    highlights: [String],        // bullet points
    lastUpdated: Date
  },
  goodWorks: String,
  controversies: [String],       // renamed from badWorks
  experience: String,
  voteCount: Number,             // default: 0
  votePercentage: Number,        // computed on read
  election: ObjectId,            // ref: Election, required
  aiSummary: String,             // cached AI summary
  aiSummaryGeneratedAt: Date,
  createdBy: ObjectId,           // ref: User (admin)
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ election: 1 }
{ election: 1, party: 1 }
{ slug: 1 }
{ fullName: "text", party: "text", motto: "text" }  // text search
```

### 2.4 Vote Collection (`votes`) — NEW

> Separate collection for integrity, audit, and one-vote enforcement.

```javascript
{
  _id: ObjectId,
  user: ObjectId,                // ref: User, required
  election: ObjectId,            // ref: Election, required
  candidate: ObjectId,           // ref: Candidate, required
  votedAt: Date,                 // default: now
  ipAddress: String,             // hashed for privacy
  userAgent: String,
  createdAt: Date
}

// Indexes — CRITICAL for one-vote enforcement
{ user: 1, election: 1 }          // UNIQUE compound index
{ election: 1 }
{ candidate: 1 }
{ votedAt: -1 }
```

### 2.5 Notification Collection (`notifications`)

```javascript
{
  _id: ObjectId,
  user: ObjectId,                // ref: User
  type: Enum[
    "ELECTION_STARTED",
    "ELECTION_ENDING_SOON",
    "VOTE_CONFIRMED",
    "NEW_CANDIDATE",
    "ADMIN_ALERT",
    "SYSTEM"
  ],
  title: String,
  message: String,
  link: String,                  // optional deep link
  metadata: Object,              // flexible payload
  isRead: Boolean,               // default: false
  createdAt: Date
}

// Indexes
{ user: 1, isRead: 1, createdAt: -1 }
```

### 2.6 ActivityLog Collection (`activitylogs`)

```javascript
{
  _id: ObjectId,
  actor: ObjectId,               // ref: User (nullable for system)
  action: Enum[
    "USER_REGISTER","USER_LOGIN","USER_LOGOUT",
    "ELECTION_CREATE","ELECTION_UPDATE","ELECTION_DELETE",
    "CANDIDATE_CREATE","CANDIDATE_UPDATE","CANDIDATE_DELETE",
    "VOTE_CAST","PASSWORD_RESET","EMAIL_VERIFY",
    "AI_QUERY"
  ],
  resource: String,            // e.g. "Election:507f1f77..."
  resourceId: ObjectId,
  details: Object,               // before/after diff optional
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}

// Indexes
{ actor: 1, createdAt: -1 }
{ action: 1, createdAt: -1 }
{ createdAt: 1 }                  // TTL index optional (90 days)
```

### 2.7 AIConversation Collection (`aiconversations`) — Optional P1

```javascript
{
  _id: ObjectId,
  user: ObjectId,
  sessionId: String,
  messages: [{
    role: Enum["user","assistant","system"],
    content: String,
    timestamp: Date
  }],
  context: {
    electionId: ObjectId,
    candidateIds: [ObjectId]
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. ER Diagram (Text)

```
┌─────────────────┐         ┌─────────────────┐
│      USER       │         │    ELECTION     │
├─────────────────┤         ├─────────────────┤
│ _id (PK)        │         │ _id (PK)        │
│ fullName        │         │ title           │
│ email (UNIQUE)  │         │ slug (UNIQUE)   │
│ password        │         │ category        │
│ role            │    ┌───►│ startDate       │
│ isEmailVerified │    │    │ endDate         │
│ ...             │    │    │ status          │
└────────┬────────┘    │    │ createdBy (FK)──┼──► USER._id
         │             │    │ totalVotes      │
         │             │    └────────┬────────┘
         │             │             │
         │             │             │ 1:N
         │             │             ▼
         │             │    ┌─────────────────┐
         │             │    │   CANDIDATE     │
         │             │    ├─────────────────┤
         │             │    │ _id (PK)        │
         │             │    │ fullName        │
         │             │    │ party           │
         │             │    │ manifesto       │
         │             │    │ gallery[]       │
         │             │    │ voteCount       │
         │             │    │ election (FK)───┼──► ELECTION._id
         │             │    │ createdBy (FK)  │
         │             │    └────────┬────────┘
         │             │             │
         │  1:N        │             │
         ▼             │             │
┌─────────────────┐    │             │
│      VOTE       │    │             │
├─────────────────┤    │             │
│ _id (PK)        │    │             │
│ user (FK)───────┼────┘             │
│ election (FK)───┼──────────────────┘
│ candidate (FK)──┼──► CANDIDATE._id
│ votedAt         │
│ UNIQUE(user,    │
│        election)│
└─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│  NOTIFICATION   │         │  ACTIVITY_LOG   │
├─────────────────┤         ├─────────────────┤
│ _id (PK)        │         │ _id (PK)        │
│ user (FK)───────┼──► USER │ actor (FK)──────┼──► USER
│ type            │         │ action          │
│ title           │         │ resourceId      │
│ isRead          │         │ details         │
└─────────────────┘         └─────────────────┘

┌─────────────────┐
│ AICONVERSATION  │  (optional)
├─────────────────┤
│ _id (PK)        │
│ user (FK)───────┼──► USER
│ messages[]      │
│ context         │
└─────────────────┘

RELATIONSHIPS:
  USER 1───N VOTE           (a user casts many votes, one per election)
  USER 1───N NOTIFICATION
  USER 1───N ACTIVITY_LOG   (as actor)
  USER 1───N ELECTION       (as creator/admin)
  ELECTION 1───N CANDIDATE
  ELECTION 1───N VOTE
  CANDIDATE 1───N VOTE
  USER + ELECTION ──UNIQUE── VOTE  (one vote per election constraint)
```

---

## 4. API List

**Base URL:** `/api/v1`  
**Auth:** HTTP-only cookie `accessToken` (JWT)  
**Response Format:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

**Error Format:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

### 4.1 Auth Routes (`/api/v1/auth`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/register` | Public | — | Register new user |
| POST | `/login` | Public | — | Login, set JWT cookie |
| POST | `/logout` | User | Any | Clear JWT cookie |
| GET | `/me` | User | Any | Get current user |
| POST | `/verify-email/:token` | Public | — | Verify email address |
| POST | `/resend-verification` | User | Any | Resend verification email |
| POST | `/forgot-password` | Public | — | Send reset email |
| POST | `/reset-password/:token` | Public | — | Reset password |
| PATCH | `/change-password` | User | Any | Change password (logged in) |

### 4.2 User Routes (`/api/v1/users`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/profile` | User | Any | Get own profile |
| PATCH | `/profile` | User | Any | Update profile |
| POST | `/profile/avatar` | User | Any | Upload avatar (Multer→Cloudinary) |
| GET | `/voting-history` | User | Voter | List votes cast by user |
| GET | `/:id` | User | Admin | Get user by ID |

### 4.3 Election Routes (`/api/v1/elections`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | User | Any | List elections (filter, sort, paginate) |
| GET | `/live` | User | Any | Live elections only |
| GET | `/upcoming` | User | Any | Upcoming elections |
| GET | `/:id` | User | Any | Election detail |
| GET | `/:id/candidates` | User | Any | Candidates in election |
| POST | `/` | User | Admin | Create election |
| PATCH | `/:id` | User | Admin | Update election |
| DELETE | `/:id` | User | Admin | Soft delete election |
| GET | `/:id/analytics` | User | Admin | Election analytics |

**Query params for GET `/`:**
- `status`, `category`, `search`, `sort`, `page`, `limit`

### 4.4 Candidate Routes (`/api/v1/candidates`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | User | Any | List all candidates (filter) |
| GET | `/:id` | User | Any | Candidate detail |
| POST | `/` | User | Admin | Create candidate |
| PATCH | `/:id` | User | Admin | Update candidate |
| DELETE | `/:id` | User | Admin | Soft delete candidate |
| POST | `/:id/gallery` | User | Admin | Add gallery image |
| DELETE | `/:id/gallery/:imageId` | User | Admin | Remove gallery image |
| PATCH | `/:id/manifesto` | User | Admin | Update manifesto |

### 4.5 Vote Routes (`/api/v1/votes`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/` | User | Voter | Cast vote `{ electionId, candidateId }` |
| GET | `/check/:electionId` | User | Voter | Check if already voted |
| GET | `/election/:electionId` | User | Admin | All votes for election (aggregated) |

### 4.6 Notification Routes (`/api/v1/notifications`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | User | Any | List user notifications |
| GET | `/unread-count` | User | Any | Unread count |
| PATCH | `/:id/read` | User | Any | Mark as read |
| PATCH | `/read-all` | User | Any | Mark all read |
| DELETE | `/:id` | User | Any | Delete notification |

### 4.7 Analytics Routes (`/api/v1/analytics`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/dashboard` | User | Admin | Admin dashboard KPIs |
| GET | `/elections/:id` | User | Admin | Election-specific charts data |
| GET | `/reports/voters` | User | Admin | Voter turnout report |
| GET | `/reports/export/:electionId` | User | Admin | Export CSV |

### 4.8 Activity Log Routes (`/api/v1/activity-logs`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | User | Admin | List logs (filter by action, date, actor) |

### 4.9 Upload Routes (`/api/v1/uploads`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/image` | User | Admin | Upload single image |
| POST | `/images` | User | Admin | Upload multiple images |

### 4.10 Search Routes (`/api/v1/search`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | User | Any | Global search `?q=` |
| GET | `/parties` | User | Any | List distinct parties |

### 4.11 AI Routes (`/api/v1/ai`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/chat` | User | Any | Chatbot message (SSE stream) |
| POST | `/candidate/:id/summary` | User | Any | Generate/get candidate summary |
| POST | `/compare` | User | Any | Compare candidates `{ ids: [] }` |
| POST | `/smart-search` | User | Any | NL search query |
| POST | `/faq` | User | Any | Generate FAQ for election |
| POST | `/translate` | User | Any | Translate content |
| POST | `/election-assistant` | User | Voter | Guided election help |
| GET | `/admin/insights` | User | Admin | AI admin dashboard insights |
| GET | `/admin/insights/:electionId` | User | Admin | Election-specific AI insights |

### 4.12 Health Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/health` | Public | Health check |
| GET | `/api/v1/health/db` | Public | DB connectivity check |

---

## 5. Backend Architecture

### 5.1 Layered Architecture (within features)

```
Request
   │
   ▼
Routes ──► Middleware Chain ──► Controller ──► Service ──► Model (Mongoose)
   │              │                │              │
   │              │                │              └──► External APIs
   │              │                │                   (Cloudinary, AI, Email)
   │              │                │
   │              ├── auth.middleware
   │              ├── role.middleware
   │              ├── rateLimit.middleware
   │              ├── validate.middleware (Zod)
   │              └── activityLog.middleware
   │
   ▼
Response (ApiResponse / ApiError via error.middleware)
```

### 5.2 Key Backend Patterns

| Pattern | Implementation |
|---------|----------------|
| **Controller** | Thin — parse req, call service, send response |
| **Service** | Business logic, transactions, external calls |
| **Validation** | Zod schemas in `*.validation.js`, middleware applies |
| **Error handling** | Custom `ApiError` class + global error middleware |
| **Async** | `catchAsync` wrapper or express-async-errors |
| **Auth** | JWT in HTTP-only cookie; `req.user` from middleware |
| **RBAC** | `requireRole('ADMIN')` middleware |
| **Pagination** | Reusable `paginate(query, options)` utility |
| **Vote integrity** | MongoDB transaction: insert Vote + increment candidate + election counters; unique index prevents duplicates |

### 5.3 Middleware Stack (Order)

```javascript
app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(globalRateLimiter);
app.use('/api/v1', routes);
app.use(notFoundHandler);
app.use(errorMiddleware);
```

### 5.4 Scheduled Jobs (node-cron)

| Job | Schedule | Action |
|-----|----------|--------|
| Election status sync | Every 5 min | Update UPCOMING→LIVE→COMPLETED |
| Ending soon notifications | Every 15 min | Notify voters of elections ending in 24h |
| AI summary refresh | Daily | Regenerate stale candidate summaries |
| Activity log cleanup | Daily | Delete logs older than 90 days |

---

*Next: [03-UI-AND-COMPONENTS.md](./03-UI-AND-COMPONENTS.md)*
