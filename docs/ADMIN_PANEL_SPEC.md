# TryTheMenu — Admin Panel Specification

> **Purpose:** This document is the complete UI/UX specification for the TryTheMenu Admin Panel. It is written for a frontend agent to build the entire admin dashboard from scratch — no backend or API integration needed. All data is mocked/synthetic. The admin panel manages campaigns, creators, submissions, payouts, and platform operations for the existing Creator Platform.

---

## Table of Contents

1. [Project Setup & Tech Stack](#1-project-setup--tech-stack)
2. [Role-Based Access Control (RBAC)](#2-role-based-access-control-rbac)
3. [Authentication & Synthetic Login Data](#3-authentication--synthetic-login-data)
4. [Global Layout & Navigation](#4-global-layout--navigation)
5. [Pages & Features](#5-pages--features)
   - 5.1 [Login Page](#51-login-page)
   - 5.2 [Dashboard (Home)](#52-dashboard-home)
   - 5.3 [Campaign Management](#53-campaign-management)
   - 5.4 [Creator Management](#54-creator-management)
   - 5.5 [Submission Review](#55-submission-review)
   - 5.6 [Payout & Wallet Management](#56-payout--wallet-management)
   - 5.7 [Leaderboard Management](#57-leaderboard-management)
   - 5.8 [Admin Management (Super Admin Only)](#58-admin-management-super-admin-only)
   - 5.9 [Platform Settings (Super Admin Only)](#59-platform-settings-super-admin-only)
   - 5.10 [Audit Log (Super Admin Only)](#510-audit-log-super-admin-only)
   - 5.11 [Reports & Analytics](#511-reports--analytics)
   - 5.12 [Profile & Account Settings](#512-profile--account-settings)
6. [Data Structures & Mock Data](#6-data-structures--mock-data)
7. [Component Library & Design System](#7-component-library--design-system)
8. [Responsive & PWA Guidelines](#8-responsive--pwa-guidelines)
9. [Routing & Navigation Map](#9-routing--navigation-map)
10. [Interaction Patterns & Micro-interactions](#10-interaction-patterns--micro-interactions)
11. [Missing Features Addendum — Gap Analysis](#11-missing-features-addendum--gap-analysis)
    - 11.1 [Location & GPS Management](#111-location--gps-management)
    - 11.2 [Instagram Reel Verification Tools](#112-instagram-reel-verification-tools)
    - 11.3 [Bill / Proof-of-Purchase Verification](#113-bill--proof-of-purchase-verification)
    - 11.4 [Verification Stage Management](#114-verification-stage-management)
    - 11.5 [Payout Formula & Bonus Engine](#115-payout-formula--bonus-engine)
    - 11.6 [Fraud Detection & Rules Engine](#116-fraud-detection--rules-engine)
    - 11.7 [KYC Document Verification Workflow](#117-kyc-document-verification-workflow)
    - 11.8 [Milestone Badge Management](#118-milestone-badge-management)
    - 11.9 [Creator Activation Funnel](#119-creator-activation-funnel)
    - 11.10 [Submission Ranking System](#1110-submission-ranking-system)
    - 11.11 [Leaderboard Configuration](#1111-leaderboard-configuration)
    - 11.12 [Campaign Performance Metrics](#1112-campaign-performance-metrics)
    - 11.13 [City-Scoped Access Control](#1113-city-scoped-access-control)
    - 11.14 [Transaction Timeline & SLA Tracking](#1114-transaction-timeline--sla-tracking)
    - 11.15 [Additional Data Structure Fields](#1115-additional-data-structure-fields)
    - 11.16 [Updated Mock Data Volume](#1116-updated-mock-data-volume)
    - 11.17 [Updated Route Map](#1117-updated-route-map)
    - 11.18 [Updated Sidebar Navigation](#1118-updated-sidebar-navigation)

---

## 1. Project Setup & Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React 18+ with TypeScript |
| Build tool | Vite |
| Styling | TailwindCSS (utility-first) |
| UI Components | shadcn/ui (Button, Input, Select, Dialog, Sheet, Table, Tabs, Badge, Avatar, DropdownMenu, Tooltip, Skeleton, Toast, Command, Popover, Calendar, Checkbox, Switch, Separator) |
| Charts | Recharts (AreaChart, BarChart, PieChart, LineChart) |
| Animations | Framer Motion (page transitions, stagger lists, modals) |
| Icons | Lucide React |
| Routing | React Router v6 with HashRouter (`#/admin/...`) |
| Package Manager | pnpm |
| Date Handling | date-fns |
| Forms | React Hook Form + Zod validation |
| State | React Context + useReducer for auth & global state |
| Tables | @tanstack/react-table for data tables with sorting, filtering, pagination |

**Font Stack (match creator platform):**
- Body: `Plus Jakarta Sans` (400–800)
- Display headings: `Syne` (600–800)
- Numbers/data: `Space Grotesk` (tabular-nums, 600–800)

---

## 2. Role-Based Access Control (RBAC)

### Roles

| Role | Description |
|------|-------------|
| **Super Admin** | Full platform access. Can manage all admins, view all data across admins, configure platform settings, and access audit logs. |
| **Admin** | Can register via an invite or self-register. Manages campaigns, creators, submissions, and payouts within their own scope. Cannot see other admins' data or platform-level settings. |

### Permission Matrix

| Feature | Super Admin | Admin |
|---------|:-----------:|:-----:|
| Dashboard (own stats) | ✅ | ✅ |
| Dashboard (platform-wide stats) | ✅ | ❌ |
| Campaign CRUD | ✅ (all) | ✅ (own) |
| Creator Management | ✅ (all) | ✅ (assigned) |
| Submission Review | ✅ (all) | ✅ (own campaigns) |
| Approve/Reject Submissions | ✅ | ✅ |
| Payout Management | ✅ (all) | ✅ (own campaigns) |
| Trigger Payouts | ✅ | ✅ (own) |
| Leaderboard Management | ✅ | ✅ (view only) |
| Admin Management (CRUD) | ✅ | ❌ |
| Platform Settings | ✅ | ❌ |
| Audit Log | ✅ | ❌ |
| Reports & Analytics | ✅ (all) | ✅ (own scope) |
| Profile & Account Settings | ✅ | ✅ |

### Access Control Implementation
- Wrap routes with a `<RoleGuard role="super_admin">` component
- Use `useAuth()` hook to get `{ user, role, permissions }` in any component
- Sidebar items render conditionally based on role
- If an Admin tries to access a Super Admin route, redirect to `/admin/dashboard` with a toast: "You don't have permission to access this page"

---

## 3. Authentication & Synthetic Login Data

### Mock Admin Users

```typescript
const MOCK_ADMINS = [
  {
    id: 'sa-001',
    name: 'Rahul Mehta',
    email: 'rahul@trythemenu.com',
    password: 'superadmin123',
    role: 'super_admin',
    avatar: '', // Use letter fallback "RM"
    phone: '+91 98765 43210',
    department: 'Operations',
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2026-03-01T09:30:00Z',
    isActive: true,
  },
  {
    id: 'sa-002',
    name: 'Ananya Iyer',
    email: 'ananya@trythemenu.com',
    password: 'superadmin456',
    role: 'super_admin',
    avatar: '',
    phone: '+91 98765 43211',
    department: 'Product',
    createdAt: '2024-02-10T10:00:00Z',
    lastLoginAt: '2026-03-01T14:15:00Z',
    isActive: true,
  },
  {
    id: 'admin-001',
    name: 'Vikram Singh',
    email: 'vikram@trythemenu.com',
    password: 'admin123',
    role: 'admin',
    avatar: '',
    phone: '+91 91234 56789',
    department: 'Campaign Ops',
    createdAt: '2024-06-01T10:00:00Z',
    lastLoginAt: '2026-02-28T17:45:00Z',
    isActive: true,
    managedCities: ['Mumbai', 'Pune'],
  },
  {
    id: 'admin-002',
    name: 'Sneha Patil',
    email: 'sneha@trythemenu.com',
    password: 'admin456',
    role: 'admin',
    avatar: '',
    phone: '+91 91234 56790',
    department: 'Creator Relations',
    createdAt: '2024-08-15T10:00:00Z',
    lastLoginAt: '2026-03-01T11:00:00Z',
    isActive: true,
    managedCities: ['Delhi', 'Gurgaon'],
  },
  {
    id: 'admin-003',
    name: 'Arjun Nair',
    email: 'arjun@trythemenu.com',
    password: 'admin789',
    role: 'admin',
    avatar: '',
    phone: '+91 91234 56791',
    department: 'Payouts',
    createdAt: '2025-01-10T10:00:00Z',
    lastLoginAt: '2026-02-27T08:30:00Z',
    isActive: false, // Deactivated admin (for Super Admin testing)
    managedCities: ['Bangalore'],
  },
];
```

### Login Flow
1. Email + password form (no OAuth, no OTP — simple synthetic auth)
2. Validate against `MOCK_ADMINS` array
3. Store session in `localStorage` (`ttm_admin_session`)
4. Redirect to `/admin/dashboard`
5. "Remember me" checkbox persists session across tabs
6. Logout clears session, redirects to `/admin/login`

### Session Shape
```typescript
interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  avatar: string;
  loginAt: string;
}
```

---

## 4. Global Layout & Navigation

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Top Bar (h-16)                                              │
│ ┌──────────┐                    ┌──────────────────────────┐│
│ │ TTM Logo │  [Search ........] │ 🔔 Notif │ 👤 Avatar ▼ ││
│ └──────────┘                    └──────────────────────────┘│
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  Sidebar   │           Main Content Area                    │
│  (w-64)    │           (scrollable, p-6)                    │
│            │                                                │
│  Dashboard │                                                │
│  Campaigns │                                                │
│  Creators  │                                                │
│  Submissns │                                                │
│  Payouts   │                                                │
│  Ldrboard  │                                                │
│  ────────  │                                                │
│  Admins  * │                                                │
│  Settings* │                                                │
│  Audit   * │                                                │
│  Reports   │                                                │
│  ────────  │                                                │
│  Profile   │                                                │
│  Logout    │                                                │
│            │                                                │
│ * = Super  │                                                │
│   Admin    │                                                │
│   Only     │                                                │
├────────────┴────────────────────────────────────────────────┤
│ (Mobile: Bottom nav bar, h-16, 5 items + hamburger)        │
└─────────────────────────────────────────────────────────────┘
```

### Top Bar (`h-16`, sticky)
- **Left:** TTM Logo (collapsed on mobile) + sidebar toggle (hamburger icon)
- **Center:** Global search (Command+K / Ctrl+K shortcut) — searches across campaigns, creators, submissions by name/ID
- **Right:**
  - Notification bell icon with unread count badge (red dot)
  - Avatar dropdown → Name, Role badge, Profile link, Logout

### Sidebar (Desktop)
- **Width:** 256px expanded, 72px collapsed
- **Collapsible:** Toggle button or auto-collapse on `<1280px`
- **Sections:**
  - **Main:** Dashboard, Campaigns, Creators, Submissions, Payouts, Leaderboard
  - **Separator**
  - **Platform (Super Admin only):** Admin Management, Platform Settings, Audit Log
  - **General:** Reports & Analytics
  - **Separator**
  - **Account:** Profile, Logout
- **Active state:** Left border accent (orange-500) + background highlight
- **Collapsed state:** Icons only + tooltip on hover
- **State persistence:** `localStorage` key `ttm-admin-sidebar-collapsed`

### Mobile Navigation
- **Bottom nav bar** (`h-16`, fixed, `safe-area-inset-bottom`)
- **5 visible tabs:** Dashboard, Campaigns, Submissions, Payouts, More (hamburger)
- **"More" menu** opens a bottom sheet with: Creators, Leaderboard, Reports, Admins*, Settings*, Audit*, Profile, Logout
- Active tab: filled icon + label, inactive: outline icon only

### Breadcrumbs
- Shown below top bar on inner pages (e.g., `Dashboard > Campaigns > Volt Fitness Studio`)
- Clickable for back-navigation

---

## 5. Pages & Features

### 5.1 Login Page

**Route:** `#/admin/login`

**Layout:** Centered card on a subtle gradient background (slate-50 to slate-100). No sidebar or nav.

**Design:**

```
┌──────────────────────────────────────────┐
│                                          │
│          [TTM Logo - Full]               │
│          Admin Portal                    │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │  Email                             │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ rahul@trythemenu.com         │  │  │
│  │  └──────────────────────────────┘  │  │
│  │                                    │  │
│  │  Password                          │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ ••••••••••••     👁          │  │  │
│  │  └──────────────────────────────┘  │  │
│  │                                    │  │
│  │  ☐ Remember me    Forgot password? │  │
│  │                                    │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │        Sign In               │  │  │
│  │  └──────────────────────────────┘  │  │
│  │                                    │  │
│  │  Don't have an account?            │  │
│  │  Register as Admin →               │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  © 2026 TryTheMenu. All rights reserved. │
└──────────────────────────────────────────┘
```

**Features:**
- Email + password fields with validation (Zod)
- Password visibility toggle (eye icon)
- "Remember me" checkbox
- "Forgot password?" link (shows a toast: "Contact super admin to reset password")
- Sign In button (loading state with spinner)
- Error toast on invalid credentials: "Invalid email or password"
- Success: redirect to `#/admin/dashboard`
- "Register as Admin" link → navigates to `#/admin/register`

### Admin Registration Page

**Route:** `#/admin/register`

**Fields:**
- Full name (required)
- Email (required, must be `@trythemenu.com` or any valid domain)
- Phone (required, Indian format)
- Password (required, min 8 chars, 1 uppercase, 1 number)
- Confirm password
- Department (select: Campaign Ops, Creator Relations, Payouts, Marketing, Support)
- Managed cities (multi-select: Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Gurgaon, Noida, Jaipur)

**On submit:** Add to mock admins array (in-memory), redirect to login with success toast: "Registration successful. You can now sign in."

**Note:** Self-registered admins get `role: 'admin'` by default. Only Super Admins can elevate to `super_admin`.

---

### 5.2 Dashboard (Home)

**Route:** `#/admin/dashboard`

**Purpose:** At-a-glance overview of platform health, key metrics, and actionable items requiring attention.

#### Top Section: Key Metric Cards (4 columns, responsive to 2 on tablet, 1 on mobile)

| Card | Value | Subtitle | Trend | Icon |
|------|-------|----------|-------|------|
| Total Creators | 2,437 | +127 this month | ↑ 5.5% | Users |
| Active Campaigns | 48 | 12 ending this week | — | Megaphone |
| Pending Submissions | 156 | 38 need review today | ↑ 12% | ClipboardCheck |
| Total Payouts (Month) | ₹12,84,500 | ₹3,21,125 pending | ↑ 8.2% | Wallet |

**Super Admin sees:** Platform-wide numbers.
**Admin sees:** Only their scoped numbers (own campaigns/assigned creators).

#### Action Required Section
A compact card listing urgent items:
- **Submissions needing review:** `23 submissions pending > 24h` → CTA: "Review now"
- **Payouts to process:** `₹1,45,000 ready for release` → CTA: "Process payouts"
- **KYC pending:** `8 creators awaiting KYC verification` → CTA: "Verify KYC"
- **Campaigns expiring:** `3 campaigns ending in < 48h` → CTA: "View campaigns"

Each item: icon + text + count badge + action link. Orange left-border on urgent items.

#### Charts Row (2 columns on desktop, stacked on mobile)

**Chart 1: Creator Growth (Area Chart)**
- X-axis: Last 12 months
- Y-axis: Total creators
- Fill: gradient (orange-100 to orange-500)
- Show data labels on hover

**Chart 2: Submission Volume & Approval Rate (Combo Chart)**
- X-axis: Last 8 weeks
- Y-axis Left: Submission count (bars)
- Y-axis Right: Approval rate % (line)
- Bar colors: green (approved), red (rejected), yellow (pending)

#### Recent Activity Feed (Right column or below charts)
- Scrollable list (max 10 items, "View all" link)
- Each entry: `[Avatar] [Actor name] [action] [target] — [time ago]`
- Examples:
  - "Vikram Singh approved submission #SUB-9002 — 12 min ago"
  - "New creator Riya Patel completed onboarding — 1 hour ago"
  - "Sneha Patil created campaign 'Bombay Bistro Weekend' — 3 hours ago"
  - "Payout of ₹2,140 released to Priya Sharma — 5 hours ago"

#### Bottom Row: Quick Stats (3 columns)

**Approval Rate Gauge:** Circular ring chart — 87% (this month) vs 82% (last month)

**Top Performing Campaigns Table (mini, 5 rows):**
| Campaign | Submissions | Avg Payout | Success |
|----------|------------|------------|---------|
| Volt Fitness | 34 | ₹1,820 | 92% |
| GlowSkin | 28 | ₹1,540 | 85% |
| ... | ... | ... | ... |

**Payout Distribution Pie Chart:**
- Paid: 62%
- Processing: 18%
- Locked (72h): 12%
- Failed: 8%

---

### 5.3 Campaign Management

**Route:** `#/admin/campaigns`

#### Campaign List View

**Header:**
- Title: "Campaigns"
- Subtitle: "Manage all brand campaigns"
- **CTA:** "+ Create Campaign" button (primary, top-right)

**Filters Bar:**
- Search (by campaign name, business name, city)
- Status filter: All | Active | Upcoming | Expired | Draft
- City filter (multi-select dropdown)
- Difficulty filter: All | Easy | Medium | Hard
- Sort: Newest | Ending soon | Most submissions | Highest payout

**Campaign Table** (using @tanstack/react-table):

| Column | Description |
|--------|-------------|
| Campaign | Logo + name + city (stacked) |
| Status | Badge: Active (green), Upcoming (blue), Expired (gray), Draft (yellow) |
| Spots | `filled/total` with mini progress bar |
| Payout Range | ₹min – ₹max |
| Submissions | Total count |
| Success Rate | % with color indicator |
| Deadline | Date + "X days left" in red if < 3 days |
| Actions | View / Edit / Duplicate / Delete (dropdown) |

**Pagination:** 10/25/50 per page selector + page numbers

**Super Admin:** Sees all campaigns with "Created by: [Admin name]" column.
**Admin:** Sees only their own campaigns.

#### Create/Edit Campaign Form

**Route:** `#/admin/campaigns/new` or `#/admin/campaigns/:id/edit`

**Layout:** Multi-section form in a single page (no wizard), with sticky save bar at bottom.

**Section 1: Basic Information**
- Campaign name (text, required)
- Business/brand name (text, required)
- Business logo (file upload with preview — mock with placeholder URL)
- Category (select: Restaurant, Fitness, Beauty, Fashion, Travel, Education, Other)
- City (select from managed cities)
- Full address (textarea)
- Latitude & Longitude (number inputs, or "Pick on map" button — mock only)
- Description (rich textarea, max 500 chars)

**Section 2: Campaign Rules**
- Required hashtags (tag input — type + Enter to add, click × to remove)
- Creator rules/checklist (repeatable text fields — add/remove rows)
- Fraud checks (repeatable text fields)
- Difficulty level (radio: Easy / Medium / Hard)

**Section 3: Payout Configuration**
- Base payout ₹ (number)
- Payout min ₹ (number)
- Payout max ₹ (number)
- Required views (number, minimum views for base payout)
- Bonus per 1,000 views above required (number)
- Estimated visit time (minutes, number)
- Check-in radius (meters, number)

**Section 4: Availability**
- Total spots (number)
- Deadline (date picker)
- Status (select: Draft / Active / Paused)

**Section 5: Social Proof (optional)**
- Social proof text (textarea — e.g., "12 creators already earned ₹1,500+ from this campaign")
- Success rate display % (number — can be manually set or auto-calculated)

**Sticky Bottom Bar:**
- "Save as Draft" (secondary) | "Publish Campaign" (primary)
- Shows unsaved changes indicator

#### Campaign Detail/View

**Route:** `#/admin/campaigns/:id`

**Layout:** Overview card + tabbed content below.

**Overview Card:**
- Large hero: logo + name + status badge + city
- Quick stats row: Total submissions, approved count, rejection rate, avg payout, spots remaining
- Action buttons: Edit, Duplicate, Pause/Resume, Delete (with confirmation dialog)

**Tabs:**
1. **Overview** — All campaign details in read-only display
2. **Submissions** — Filtered table of all submissions for this campaign (same columns as Submission Review page)
3. **Creators** — List of creators who joined this campaign, their submission status
4. **Payouts** — Payout summary for this campaign: total disbursed, pending, breakdown chart
5. **Analytics** — Submission volume over time, views distribution, engagement chart

---

### 5.4 Creator Management

**Route:** `#/admin/creators`

#### Creator List View

**Header:**
- Title: "Creators"
- Subtitle: "Manage creator accounts and verification"
- **CTA:** "Export CSV" button (secondary)

**Filters Bar:**
- Search (by name, email, Instagram handle)
- KYC status: All | Verified | Pending | Rejected
- Trust score range: slider (0–100)
- City filter (dropdown)
- Account status: All | Active | Inactive | Flagged
- Sort: Newest | Highest trust | Most earnings | Most submissions

**Creator Table:**

| Column | Description |
|--------|-------------|
| Creator | Avatar + name + @handle (stacked) |
| City | City name |
| Followers | Number (formatted: 18.2K) |
| KYC | Badge: Verified (green), Pending (yellow), Rejected (red) |
| Trust Score | Score + mini circular gauge |
| Wallet Balance | ₹ amount |
| Lifetime Earnings | ₹ amount |
| Submissions | Total count |
| Status | Active (green dot) / Inactive (gray dot) / Flagged (red dot) |
| Actions | View / Flag / Deactivate (dropdown) |

**Bulk Actions (via row checkboxes):**
- Verify KYC (batch)
- Flag accounts
- Export selected

#### Creator Detail/View

**Route:** `#/admin/creators/:id`

**Layout:** Profile header + tabbed content.

**Profile Header:**
- Large avatar (with letter fallback)
- Name, @handle, city, email, phone
- KYC badge + Trust score gauge
- Account status toggle (Active/Inactive switch)
- Action buttons: Flag, Reset Trust Score, Send Notification (mock)

**Tabs:**
1. **Profile** — Full profile details: personal info, Instagram stats (followers, connected status), KYC documents (PAN, Aadhaar last 4), UPI ID, join date
2. **Submissions** — All submissions by this creator (table with status, campaign, payout, date)
3. **Earnings** — Earnings chart (last 12 weeks), lifetime vs weekly comparison, transaction list
4. **Trust History** — Trust score timeline (line chart), trust signals log (GPS verified ×, bill verified ×, etc.)
5. **Activity Log** — Chronological list: "Joined campaign X", "Submitted reel for Y", "KYC verified", "Payout received ₹Z"

**Admin Actions on Creator:**
- **Verify KYC** — Button (only if KYC pending): changes status to `verified`
- **Reject KYC** — Button with reason input (modal): changes status to `rejected`
- **Adjust Trust Score** — Input field (±value) with reason
- **Flag Creator** — Toggle with reason (modal): marks account, shows red indicator
- **Deactivate Account** — Confirmation dialog: disables login, hides from campaigns

---

### 5.5 Submission Review

**Route:** `#/admin/submissions`

**Purpose:** Central hub for reviewing, approving, and rejecting creator submissions. This is the most critical operational page.

#### Submission List View

**Header:**
- Title: "Submissions"
- Subtitle: "Review and manage creator submissions"

**Summary Cards (4 columns):**
| Card | Value | Color |
|------|-------|-------|
| Pending Review | 38 | Yellow |
| In 72h Window | 67 | Orange |
| Approved (This Week) | 124 | Green |
| Rejected (This Week) | 18 | Red |

**Filters Bar:**
- Search (by submission ID, creator name, campaign name)
- Status: All | Pending | Approved | Rejected | Paid
- Verification stage: All | T0 | 24h | 72h | Completed
- Campaign filter (dropdown)
- Date range picker
- Has fraud flags: Yes / No / All
- Sort: Newest | Highest payout | Worst rank | Most views

**Submission Table:**

| Column | Description |
|--------|-------------|
| ID | #SUB-XXXX (monospace) |
| Creator | Avatar + name |
| Campaign | Campaign name + logo |
| Status | StatusBadge (colored pill) |
| Stage | T0 / 24h / 72h / Done + progress indicator |
| Views | Current view count |
| Projected Payout | ₹ amount |
| Fraud Flags | Count badge (red if > 0) |
| Submitted | Relative time ("2h ago") |
| Actions | Review / Approve / Reject (inline buttons or dropdown) |

**Row Styling:**
- Red left border if fraud flags > 0
- Yellow background tint if pending > 48 hours
- Green left border if approved

**Bulk Actions:**
- Approve selected (confirmation dialog with count)
- Reject selected (reason input modal)

#### Submission Detail/Review

**Route:** `#/admin/submissions/:id`

**Layout:** Two-column on desktop (content left 60%, actions right 40%), stacked on mobile.

**Left Column — Submission Content:**

1. **Reel Preview Card**
   - Embedded reel thumbnail (large, clickable to open reel URL in new tab)
   - Reel URL (copyable)
   - Caption text display
   - Required hashtags check: ✅ matched / ❌ missing (per hashtag)

2. **Bill Verification Card**
   - Bill image (zoomable on click — modal with large view)
   - Bill number display
   - Upload date

3. **Metrics Timeline Card**
   - Same 3-point chart as creator app (T0, 24h, 72h)
   - Table below chart:
     | Checkpoint | Views | Likes | Comments | Engagement Rate |
     |------------|-------|-------|----------|----------------|
     | T0 | 1,200 | 89 | 12 | 8.4% |
     | 24h | 4,800 | 340 | 45 | 8.0% |
     | 72h | 8,200 | 620 | 78 | 8.5% |

4. **Trust Signals Panel**
   - Green badges: GPS Verified ✅, Bill Verified ✅
   - Red badges (if applicable): Post Deleted ❌, Caption Edited ⚠️, Low Engagement ⚠️
   - Each signal has an icon + label + timestamp when checked

5. **Fraud Flags Section** (red-bordered card, only if flags exist)
   - List of violations with descriptions
   - Severity indicator (warning / critical)

**Right Column — Admin Actions:**

1. **Payout Breakdown Card**
   | Line Item | Amount |
   |-----------|--------|
   | Base Payout | ₹700 |
   | Engagement Bonus | ₹1,220 |
   | Trust Bonus | ₹220 |
   | Penalties | -₹0 |
   | **Projected Total** | **₹2,140** |

   - Editable fields: Admin can adjust bonus or penalties with reason
   - "Override Payout" input for manual total (with reason required)

2. **Creator Quick Profile**
   - Avatar, name, @handle
   - Trust score gauge
   - Submission count + approval rate
   - Link to full creator profile

3. **Campaign Quick Info**
   - Campaign name, payout range, deadline
   - Link to full campaign detail

4. **Admin Notes**
   - Textarea for internal notes (persisted in submission data)
   - Notes history (timestamped list of previous notes by different admins)

5. **Decision Panel**
   - Large buttons:
     - ✅ **Approve** (green) — confirms payout amount
     - ❌ **Reject** (red) — opens modal for rejection reason (select: "Post deleted", "Caption edited", "Fake engagement", "Wrong hashtags", "Other" + free text)
     - ⏸️ **Hold** (yellow) — puts submission on hold for further review
   - After decision: shows confirmation summary with "Undo (30s)" option

6. **Ranking Info**
   - "Rank #7 of 34 submissions for this campaign"
   - Percentile bar

---

### 5.6 Payout & Wallet Management

**Route:** `#/admin/payouts`

#### Payout Overview

**Summary Cards (4 columns):**
| Card | Value |
|------|-------|
| Total Disbursed (Month) | ₹12,84,500 |
| Pending Release | ₹3,21,125 |
| Processing | ₹89,400 |
| Failed | ₹12,300 (action needed) |

#### Payout Table

**Filters:**
- Search (by creator name, submission ID, campaign name)
- Status: All | Locked | Processing | Paid | Failed
- Date range
- Amount range (min–max slider)
- Campaign filter

**Table Columns:**

| Column | Description |
|--------|-------------|
| Transaction ID | #TXN-XXXX |
| Creator | Avatar + name |
| Campaign | Campaign name |
| Amount | ₹ formatted |
| Status | Badge (Locked/Processing/Paid/Failed) |
| UPI ID | Masked (show last 4 chars) |
| Unlock At | Date + countdown (if locked) |
| Processed At | Date (if paid) |
| Actions | Release / Retry / View |

**Bulk Actions:**
- Release all unlocked (confirmation with total ₹ amount)
- Retry failed (batch retry)
- Export to CSV

#### Payout Detail Modal
- Full transaction details
- Creator info + UPI
- Submission link
- Status timeline (Created → Locked → Unlocked → Processing → Paid)
- Admin action: Manually trigger release / Mark as failed / Add note

#### Failed Payouts Section
- Separate tab or filter for failed payouts
- Reason column (UPI error, insufficient funds, creator flagged, etc.)
- Retry button per row
- Bulk retry

---

### 5.7 Leaderboard Management

**Route:** `#/admin/leaderboard`

**Access:** Super Admin = full edit; Admin = view only

#### Current Week Leaderboard

**Display:** Same podium visual as creator app but with admin actions.

**Table:**
| Rank | Creator | Weekly Earnings | Points | Submissions | Badge | Tier | Actions |
|------|---------|----------------|--------|-------------|-------|------|---------|
| 1 | Aisha Khan | ₹14,220 | 1,420 | 6 | Top 10 | Gold | Edit / Remove |

**Admin Actions (Super Admin only):**
- Adjust ranking (manual override with reason)
- Remove from leaderboard (flag for suspicious activity)
- Set bonus tier manually
- Reset weekly points

**Configuration Panel (Super Admin):**
- Tier thresholds:
  - Gold: Top X creators or ₹Y+ weekly
  - Silver: Top A–B or ₹C+ weekly
  - Bronze: Everyone else
- Bonus multipliers: Gold +12%, Silver +7%, Bronze 0%
- Week reset day (default: Monday)

---

### 5.8 Admin Management (Super Admin Only)

**Route:** `#/admin/manage-admins`

#### Admin List

**Table:**
| Column | Description |
|--------|-------------|
| Admin | Avatar + name |
| Email | Email address |
| Role | Badge: Super Admin (purple) / Admin (blue) |
| Department | Text |
| Managed Cities | Tag pills |
| Last Login | Relative time |
| Status | Active (green) / Inactive (gray) |
| Actions | Edit / Deactivate / Delete / Promote |

#### Admin Actions

- **Invite Admin** — Modal: email + role + department + cities (sends mock invite)
- **Edit Admin** — Change role, department, managed cities, status
- **Promote to Super Admin** — Confirmation dialog with warning
- **Demote to Admin** — Confirmation dialog
- **Deactivate** — Soft delete, preserves data, disables login
- **Delete** — Hard delete with confirmation (only if no associated campaigns/actions)
- **Reset Password** — Sets to a temporary password, shown in a modal

#### Admin Activity View
- Click on an admin to see their:
  - Activity log (actions taken, submissions reviewed, campaigns created)
  - Performance stats (avg review time, approval rate, campaigns managed)
  - Associated campaigns and creators

---

### 5.9 Platform Settings (Super Admin Only)

**Route:** `#/admin/settings`

**Layout:** Vertical tabs on left, settings panel on right.

**Tab 1: General**
- Platform name (text)
- Support email (text)
- Support phone (text)
- Default timezone (select)
- Currency display format (₹ / INR)

**Tab 2: Campaign Defaults**
- Default payout min/max
- Default required views
- Default check-in radius (meters)
- Default deadline duration (days from creation)
- Auto-expire campaigns after deadline: toggle

**Tab 3: Verification Settings**
- 72h window duration (hours, default: 72)
- Auto-approve threshold (trust score above which submissions auto-approve)
- Fraud flag sensitivity (Low / Medium / High)
- Post deletion penalty % (default: 100% = full rejection)
- Caption edit penalty % (default: 50%)

**Tab 4: Trust Score Configuration**
- KYC weight (%)
- Approval rate weight (%)
- Integrity signal weight (%)
- Leaderboard bonus weight (%)
- Minimum trust score for premium campaigns (number)

**Tab 5: Payout Settings**
- Minimum withdrawal amount (₹)
- Payout processing delay (hours after unlock)
- UPI transaction limit per day
- Failed payout auto-retry: toggle + max retries

**Tab 6: Notifications**
- Email notifications: toggle per event type
- Push notifications: toggle (for PWA)
- Event types: New submission, Payout processed, KYC pending, Campaign expiring, Fraud flag

**All settings persist in localStorage (`ttm_admin_settings`).**

---

### 5.10 Audit Log (Super Admin Only)

**Route:** `#/admin/audit-log`

**Purpose:** Complete record of all admin actions for accountability and compliance.

**Filters:**
- Search (by action description, admin name, target entity)
- Admin filter (select from all admins)
- Action type: All | Submission Review | Campaign CRUD | Payout | Creator Mgmt | Settings Change | Auth
- Date range picker
- Severity: All | Info | Warning | Critical

**Log Table:**

| Column | Description |
|--------|-------------|
| Timestamp | Full datetime + relative time |
| Admin | Avatar + name + role badge |
| Action | Description (e.g., "Approved submission #SUB-9002") |
| Category | Icon + label (Submission, Campaign, Payout, etc.) |
| Target | Linked entity (creator name, campaign, submission ID) |
| IP Address | Mock IP |
| Details | Expandable JSON or formatted diff |

**Row color coding:**
- Green: Approvals, creations
- Yellow: Edits, modifications
- Red: Rejections, deletions, deactivations
- Blue: Login/logout, settings changes

**Mock Audit Data (generate 50+ entries spanning last 30 days):**
- Login/logout events
- Submission approvals/rejections with reasons
- Campaign create/edit/delete
- Payout releases
- Creator KYC verifications
- Settings changes
- Admin role changes

---

### 5.11 Reports & Analytics

**Route:** `#/admin/reports`

**Layout:** Full-width page with report selector tabs across top.

#### Tab 1: Revenue & Payouts Report

**Date range selector** (preset: This week, This month, Last 30 days, Last 90 days, Custom)

**KPI Row (4 cards):**
- Total payouts disbursed
- Average payout per submission
- Payout success rate
- Avg time from submission to payout

**Charts:**
1. **Daily Payouts (Bar Chart)** — Stacked bars: Paid (green), Processing (blue), Failed (red)
2. **Payout Distribution (Histogram)** — X: payout ranges (₹0–500, ₹500–1000, etc.), Y: count
3. **Top 10 Campaigns by Payout (Horizontal Bar)** — Campaign name + total disbursed

#### Tab 2: Creator Analytics

**KPI Row:**
- Total active creators
- New signups (period)
- Avg trust score
- Creator churn rate

**Charts:**
1. **Creator Growth (Area Chart)** — Cumulative creator count over time
2. **KYC Status Distribution (Donut)** — Verified / Pending / Rejected
3. **Trust Score Distribution (Histogram)** — Bell curve showing trust score spread
4. **Top 10 Creators by Earnings (Table)**

#### Tab 3: Campaign Performance

**KPI Row:**
- Active campaigns
- Avg submissions per campaign
- Overall success rate
- Avg campaign fill rate (spots filled %)

**Charts:**
1. **Campaign Volume Over Time (Line)** — Created vs expired vs active
2. **Difficulty Distribution (Pie)** — Easy / Medium / Hard
3. **City-wise Campaign Distribution (Bar)** — Campaigns per city
4. **Success Rate by Category (Grouped Bar)** — Restaurant vs Fitness vs Beauty, etc.

#### Tab 4: Submission Analytics

**KPI Row:**
- Total submissions (period)
- Approval rate
- Avg views per submission
- Fraud flag rate

**Charts:**
1. **Submission Volume (Stacked Area)** — Approved / Rejected / Pending over time
2. **Avg Metrics at Each Stage (Multi-Line)** — Views, likes, comments at T0/24h/72h
3. **Fraud Flags Breakdown (Donut)** — Post deleted / Caption edited / Low engagement / Fake engagement
4. **Submission Heatmap by Day/Hour** — When do creators submit most?

**Export:** All reports have "Export as CSV" and "Export as PDF" buttons (mock — show toast "Report exported").

---

### 5.12 Profile & Account Settings

**Route:** `#/admin/profile`

**Layout:** Single-page form.

**Sections:**

1. **Personal Information**
   - Avatar upload (with letter fallback preview)
   - Full name
   - Email (read-only)
   - Phone
   - Department

2. **Security**
   - Change password (current + new + confirm)
   - Active sessions list (mock: 2 entries — current browser + mobile)
   - "Sign out all devices" button

3. **Preferences**
   - Theme: Light / Dark / System (toggle — dark mode should be implemented)
   - Notification preferences (toggles per event type)
   - Default items per page (10/25/50)
   - Language: English (disabled, future)

4. **Role Info (read-only)**
   - Current role badge
   - Permissions summary
   - Managed cities (if Admin)
   - Account created date

---

## 6. Data Structures & Mock Data

### Core TypeScript Interfaces

```typescript
// ─── Admin ──────────────────────────────────────────────
interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin';
  avatar: string;
  phone: string;
  department: string;
  managedCities?: string[];
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
}

interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  avatar: string;
  loginAt: string;
}

// ─── Campaign (Admin-side) ──────────────────────────────
interface CampaignAdmin {
  id: string;
  createdBy: string;           // Admin ID
  businessName: string;
  businessLogo: string;
  category: 'Restaurant' | 'Fitness' | 'Beauty' | 'Fashion' | 'Travel' | 'Education' | 'Other';
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  payoutBase: number;
  payoutMin: number;
  payoutMax: number;
  requiredViews: number;
  bonusPerThousandViews: number;
  requiredHashtags: string[];
  rules: string[];
  fraudChecks: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  totalSpots: number;
  spotsLeft: number;
  deadline: string;
  status: 'draft' | 'active' | 'paused' | 'expired';
  successRate: number;
  estimatedVisitTimeMins: number;
  checkInRadiusMeters: number;
  socialProof: string;
  createdAt: string;
  updatedAt: string;
  // Computed/aggregated
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  totalPaidOut: number;
}

// ─── Creator (Admin-side view) ──────────────────────────
interface CreatorAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  profileImage: string;
  instagramHandle: string;
  instagramFollowers: number;
  instagramConnected: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycDocuments: {
    panNumber: string;      // Masked: "ABCDE****F"
    aadhaarLast4: string;
  };
  upiId: string;
  trustScore: number;
  walletBalance: number;
  lockedEarnings: number;
  lifetimeEarnings: number;
  weeklyEarnings: number;
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  joinedAt: string;
  lastActiveAt: string;
  accountStatus: 'active' | 'inactive' | 'flagged';
  flagReason?: string;
  assignedAdmin?: string;   // Admin ID (for scope filtering)
}

// ─── Submission (Admin-side view) ────────────────────────
interface SubmissionAdmin {
  id: string;
  campaignId: string;
  campaignName: string;
  campaignLogo: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  reelUrl: string;
  reelThumbnail: string;
  caption: string;
  billNumber: string;
  billImageUrl: string;
  submittedAt: string;
  unlockAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  verificationStage: 't0' | 'h24' | 'h72' | 'completed';
  ranking: number;
  totalRankEntries: number;   // "rank X of Y"
  projectedPayout: number;
  finalPayout?: number;
  metricsCurrent: {
    views: number;
    likes: number;
    comments: number;
  };
  metricsTimeline: Array<{
    label: string;
    timestamp: string;
    views: number;
    likes: number;
    comments: number;
  }>;
  payoutBreakdown: {
    base: number;
    engagementBonus: number;
    trustBonus: number;
    penalties: number;
    total: number;
  };
  trustSignals: {
    gpsVerified: boolean;
    billVerified: boolean;
    postDeleted: boolean;
    captionEdited: boolean;
    lowEngagement: boolean;
  };
  fraudFlags: string[];
  adminNotes: Array<{
    adminId: string;
    adminName: string;
    note: string;
    timestamp: string;
  }>;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// ─── Payout/Transaction (Admin-side) ────────────────────
interface PayoutTransaction {
  id: string;
  submissionId: string;
  campaignName: string;
  creatorId: string;
  creatorName: string;
  amount: number;
  status: 'locked' | 'processing' | 'paid' | 'failed';
  upiId: string;
  createdAt: string;
  unlockAt?: string;
  processedAt?: string;
  completedAt?: string;
  failureReason?: string;
  processedBy?: string;   // Admin ID who triggered
}

// ─── Audit Log ──────────────────────────────────────────
interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminRole: 'super_admin' | 'admin';
  action: string;           // Human-readable description
  category: 'auth' | 'submission' | 'campaign' | 'creator' | 'payout' | 'settings' | 'admin_mgmt';
  targetType?: string;      // 'submission' | 'campaign' | 'creator' | 'payout' | 'admin'
  targetId?: string;
  targetName?: string;
  severity: 'info' | 'warning' | 'critical';
  ipAddress: string;
  details?: Record<string, any>;
}

// ─── Platform Settings ──────────────────────────────────
interface PlatformSettings {
  general: {
    platformName: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    currencyFormat: string;
  };
  campaignDefaults: {
    defaultPayoutMin: number;
    defaultPayoutMax: number;
    defaultRequiredViews: number;
    defaultCheckInRadius: number;
    defaultDeadlineDays: number;
    autoExpireAfterDeadline: boolean;
  };
  verification: {
    windowHours: number;
    autoApproveThreshold: number;
    fraudSensitivity: 'low' | 'medium' | 'high';
    postDeletionPenaltyPercent: number;
    captionEditPenaltyPercent: number;
  };
  trustScore: {
    kycWeight: number;
    approvalRateWeight: number;
    integrityWeight: number;
    leaderboardWeight: number;
    premiumCampaignMinScore: number;
  };
  payout: {
    minWithdrawalAmount: number;
    processingDelayHours: number;
    dailyTransactionLimit: number;
    autoRetryFailed: boolean;
    maxRetries: number;
  };
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    events: Record<string, boolean>;
  };
}

// ─── Notification ───────────────────────────────────────
interface AdminNotification {
  id: string;
  type: 'submission_new' | 'payout_failed' | 'kyc_pending' | 'campaign_expiring' | 'fraud_flag' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;     // Route to navigate to
  severity: 'info' | 'warning' | 'critical';
}

// ─── Dashboard Stats ────────────────────────────────────
interface DashboardStats {
  totalCreators: number;
  creatorsGrowthPercent: number;
  newCreatorsThisMonth: number;
  activeCampaigns: number;
  campaignsEndingThisWeek: number;
  pendingSubmissions: number;
  submissionsNeedReviewToday: number;
  submissionsGrowthPercent: number;
  totalPayoutsThisMonth: number;
  pendingPayouts: number;
  payoutsGrowthPercent: number;
  approvalRate: number;
  lastMonthApprovalRate: number;
}

// ─── Activity Feed ──────────────────────────────────────
interface ActivityFeedEntry {
  id: string;
  actorName: string;
  actorAvatar: string;
  action: string;           // "approved submission", "created campaign", etc.
  target: string;           // "#SUB-9002", "Bombay Bistro Weekend", etc.
  targetUrl: string;
  timestamp: string;
}
```

### Mock Data Volume

Generate synthetic data for the following:
- **5 Admin users** (provided above in Section 3)
- **15 Campaigns** (expand from the 5 in creator app + 10 new ones across cities)
- **25 Creators** (expand from mock creator + 24 more with varied trust scores, cities, earnings)
- **60 Submissions** (across campaigns, mix of all statuses and stages)
- **80 Transactions** (mix of locked/processing/paid/failed)
- **50+ Audit log entries** (spanning last 30 days)
- **15 Notifications** (mix of types and read/unread)
- **30 Activity feed entries** (last 7 days)
- **12 months of chart data** for creator growth, payout trends
- **8 weeks of submission volume data** for weekly charts

All data should use realistic Indian names, cities, amounts (₹500–₹15,000 range), and Instagram handles.

---

## 7. Component Library & Design System

### Color Palette

```
Primary:       orange-500 (#f97316) — Buttons, active states, accents
Primary Hover: orange-600 (#ea580c)
Secondary:     slate-600 (#475569) — Secondary text, icons
Background:    slate-50 (#f8fafc) — Page background
Surface:       white (#ffffff) — Cards, modals
Border:        slate-200 (#e2e8f0) — Card borders, dividers

Status Colors:
  Pending:     amber-500 (#f59e0b) + amber-50 bg
  Approved:    emerald-500 (#10b981) + emerald-50 bg
  Rejected:    red-500 (#ef4444) + red-50 bg
  Paid:        blue-500 (#3b82f6) + blue-50 bg
  Locked:      orange-500 (#f97316) + orange-50 bg
  Processing:  sky-500 (#0ea5e9) + sky-50 bg
  Draft:       gray-500 (#6b7280) + gray-50 bg
  Active:      emerald-500 + emerald-50 bg
  Inactive:    gray-400 + gray-50 bg
  Flagged:     red-500 + red-50 bg

Role Colors:
  Super Admin: purple-500 (#a855f7) + purple-50 bg
  Admin:       blue-500 (#3b82f6) + blue-50 bg

Severity:
  Info:        blue-500
  Warning:     amber-500
  Critical:    red-500

Dark Mode (if implemented):
  Background:  slate-900
  Surface:     slate-800
  Border:      slate-700
  Text:        slate-100
```

### Shared Components to Build

| Component | Description |
|-----------|-------------|
| `DataTable` | Wrapper around @tanstack/react-table: sortable headers, pagination controls, row selection (checkboxes), loading skeleton, empty state |
| `StatCard` | Metric card: icon + value + label + trend indicator (↑/↓ + %) |
| `StatusBadge` | Colored pill for any status (reuse color map above) |
| `RoleBadge` | Purple/blue pill for Super Admin / Admin |
| `PageHeader` | Title + subtitle + action buttons (right-aligned) |
| `FilterBar` | Horizontal bar with search input + filter dropdowns + clear all |
| `ConfirmDialog` | Modal with title + message + destructive/safe action buttons |
| `FormSection` | Labeled section with border, used in forms |
| `EmptyState` | Centered icon + heading + description + CTA button |
| `LoadingState` | Full-page or inline skeleton loader |
| `Breadcrumbs` | Clickable path trail |
| `AvatarGroup` | Stacked avatars with "+N" overflow |
| `TrustScoreGauge` | Same circular gauge as creator app |
| `MetricsChart` | Recharts wrapper for line/bar/area/pie |
| `ActivityItem` | Feed entry: avatar + action text + timestamp |
| `NotificationPanel` | Slide-out panel listing notifications |
| `CommandPalette` | Cmd+K global search dialog (shadcn Command) |
| `DateRangePicker` | Calendar-based date range selector |
| `TagInput` | Multi-tag input for hashtags, cities, etc. |
| `FileUpload` | Drop zone + preview (mock upload) |
| `LetterAvatar` | Generates colored avatar from initials when no image |

### Card Styling Pattern
```css
/* Standard card */
.admin-card {
  @apply bg-white rounded-xl border border-slate-200 shadow-sm;
}

/* Elevated card (stat cards, action required) */
.admin-card-elevated {
  @apply bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow;
}

/* Danger card (fraud flags, failed payouts) */
.admin-card-danger {
  @apply bg-red-50 rounded-xl border border-red-200;
}

/* Success card */
.admin-card-success {
  @apply bg-emerald-50 rounded-xl border border-emerald-200;
}
```

### Typography Scale

| Element | Font | Size | Weight | Class |
|---------|------|------|--------|-------|
| Page title | Syne | 1.875rem (30px) | 700 | `text-3xl font-bold font-display` |
| Section title | Syne | 1.25rem (20px) | 600 | `text-xl font-semibold font-display` |
| Card title | Plus Jakarta Sans | 1rem (16px) | 600 | `text-base font-semibold` |
| Body | Plus Jakarta Sans | 0.875rem (14px) | 400 | `text-sm` |
| Caption | Plus Jakarta Sans | 0.75rem (12px) | 400 | `text-xs text-slate-500` |
| Metric value | Space Grotesk | 1.5rem–2rem | 700 | `text-2xl font-bold num-font` |
| Table data | Plus Jakarta Sans | 0.875rem | 400 | `text-sm` |
| Badge | Plus Jakarta Sans | 0.75rem | 500 | `text-xs font-medium` |

---

## 8. Responsive & PWA Guidelines

### Breakpoints (TailwindCSS defaults)

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px (`sm`) | Single column, bottom nav, stacked cards |
| Tablet | 640px–1023px (`md`) | 2-column grids, collapsible sidebar |
| Desktop | 1024px–1279px (`lg`) | Sidebar + content, 3-4 column grids |
| Wide | ≥ 1280px (`xl`) | Full layout, sidebar expanded by default |

### Responsive Rules

1. **Tables → Cards on mobile:** Data tables should transform to stacked cards on mobile (`< 640px`). Each row becomes a card with key-value pairs.
2. **Sidebar:** Hidden on mobile, replaced by bottom nav bar. On tablet, sidebar is overlay (drawer). On desktop, persistent.
3. **Stat cards:** 4-col on desktop → 2-col on tablet → 1-col on mobile (stack vertically).
4. **Charts:** Full width on all devices. Reduce legend to icon-only on mobile.
5. **Forms:** Single column on mobile. Two-column on desktop for side-by-side fields.
6. **Modals:** Full screen on mobile (`fixed inset-0`), centered dialog on desktop.
7. **Filters:** Horizontal scroll on mobile, or collapse into a "Filters" button that opens a bottom sheet.
8. **Touch targets:** Minimum 44px tap area for all interactive elements.
9. **Font scaling:** Use `clamp()` for heading sizes.

### PWA Configuration

```json
// manifest.json
{
  "name": "TryTheMenu Admin",
  "short_name": "TTM Admin",
  "description": "TryTheMenu Admin Panel - Manage campaigns, creators, and payouts",
  "start_url": "/#/admin/dashboard",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#f97316",
  "orientation": "any",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- Add `<meta name="apple-mobile-web-app-capable" content="yes">`
- Add `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- Service worker for offline caching (basic — cache app shell)
- `safe-area-inset` padding for notched devices

---

## 9. Routing & Navigation Map

```
#/admin/login                         — Login page (public)
#/admin/register                      — Admin registration (public)
#/admin/dashboard                     — Dashboard home
#/admin/campaigns                     — Campaign list
#/admin/campaigns/new                 — Create campaign
#/admin/campaigns/:id                 — Campaign detail (view)
#/admin/campaigns/:id/edit            — Edit campaign
#/admin/creators                      — Creator list
#/admin/creators/:id                  — Creator detail
#/admin/submissions                   — Submission list
#/admin/submissions/:id               — Submission detail/review
#/admin/payouts                       — Payout management
#/admin/leaderboard                   — Leaderboard management
#/admin/manage-admins                 — Admin management (Super Admin)
#/admin/manage-admins/:id             — Admin detail (Super Admin)
#/admin/settings                      — Platform settings (Super Admin)
#/admin/audit-log                     — Audit log (Super Admin)
#/admin/reports                       — Reports & analytics
#/admin/profile                       — Profile & account settings
```

### Route Guards
- All `/admin/*` routes (except `/login` and `/register`) require authentication
- Routes marked "Super Admin" require `role === 'super_admin'`
- Unauthenticated access → redirect to `/admin/login`
- Unauthorized role access → redirect to `/admin/dashboard` + toast

### Navigation Architecture

```typescript
const adminRoutes = [
  // Public
  { path: '/admin/login', element: <AdminLogin />, public: true },
  { path: '/admin/register', element: <AdminRegister />, public: true },

  // Protected (wrapped in <AdminLayout>)
  { path: '/admin/dashboard', element: <AdminDashboard /> },
  { path: '/admin/campaigns', element: <CampaignList /> },
  { path: '/admin/campaigns/new', element: <CampaignForm /> },
  { path: '/admin/campaigns/:id', element: <CampaignDetail /> },
  { path: '/admin/campaigns/:id/edit', element: <CampaignForm /> },
  { path: '/admin/creators', element: <CreatorList /> },
  { path: '/admin/creators/:id', element: <CreatorDetail /> },
  { path: '/admin/submissions', element: <SubmissionList /> },
  { path: '/admin/submissions/:id', element: <SubmissionReview /> },
  { path: '/admin/payouts', element: <PayoutManagement /> },
  { path: '/admin/leaderboard', element: <LeaderboardManagement /> },
  { path: '/admin/reports', element: <ReportsAnalytics /> },
  { path: '/admin/profile', element: <AdminProfile /> },

  // Super Admin only (wrapped in <RoleGuard role="super_admin">)
  { path: '/admin/manage-admins', element: <AdminManagement /> },
  { path: '/admin/manage-admins/:id', element: <AdminDetail /> },
  { path: '/admin/settings', element: <PlatformSettings /> },
  { path: '/admin/audit-log', element: <AuditLog /> },
];
```

---

## 10. Interaction Patterns & Micro-interactions

### Page Transitions
- Use Framer Motion `AnimatePresence` for route transitions
- Enter: `opacity: 0 → 1`, `y: 12 → 0` (200ms, ease-out)
- Exit: `opacity: 1 → 0` (150ms)

### Table Interactions
- Row hover: `bg-slate-50` background
- Row click: navigates to detail page (cursor-pointer)
- Sort header click: toggle ↑/↓ icon + re-sort with 100ms transition
- Checkbox select: blue highlight on selected rows
- Bulk action bar slides in from bottom when ≥1 row selected

### Form Interactions
- Input focus: `ring-2 ring-orange-500 ring-offset-2` (TailwindCSS)
- Validation error: red border + shake animation (50ms, 3 cycles) + error text below
- Success submit: button shows checkmark icon for 1.5s, then redirects
- Unsaved changes: orange dot next to page title + "You have unsaved changes" bar at top

### Notification Bell
- Click: opens slide-out panel from right (300ms)
- Unread badge: red dot with scale pulse animation
- Mark as read: badge count decrements, entry text becomes gray
- Click notification: navigates to relevant page + marks as read

### Confirmation Dialogs
- Backdrop: `bg-black/50` with fade-in
- Dialog: scale from 95% → 100% + fade-in (200ms)
- Destructive actions: red-themed button (e.g., "Delete Campaign")
- Safe actions: green/blue-themed button (e.g., "Approve Submission")

### Loading States
- **Skeleton screens** for initial page loads (match layout shape)
- **Inline spinners** for button actions (replace button text)
- **Progress bars** for batch operations
- **Optimistic updates** for toggles (switch immediately, revert on mock error)

### Toast Notifications
- Position: top-right on desktop, top-center on mobile
- Auto-dismiss after 4 seconds
- Types: success (green), error (red), warning (amber), info (blue)
- Actions: optional "Undo" button on destructive toasts (5-second window)

### Empty States
- Centered illustration (use Lucide icons as large illustrations)
- Heading: "No [items] found"
- Description: "Try adjusting your filters or create a new [item]"
- CTA button: "Create [item]" or "Clear filters"

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette (global search) |
| `Cmd/Ctrl + N` | Create new (context-dependent: campaign, etc.) |
| `Escape` | Close modal/panel |
| `Enter` | Confirm dialog |
| `←` / `→` | Navigate table pages |

---

## 11. Missing Features Addendum — Gap Analysis

> The following sections were identified after cross-referencing every page, data field, and business rule in the creator platform source code. All items below must be implemented in the admin panel.

---

### 11.1 Location & GPS Management

The creator platform uses GPS coordinates and geofencing for campaign check-ins. The admin panel must manage this.

#### Campaign Location Management
- Campaign create/edit form must include a **location picker** (latitude/longitude inputs + a "Preview on Map" button that opens a static map preview via an `<img>` tag using a placeholder map image)
- **Check-in radius** visualized as a circle on the map preview
- **Managed Locations list** (Super Admin, under Platform Settings): CRUD for pre-defined locations (city, area name, lat, lng) that admins can select when creating campaigns

#### GPS Verification in Submission Review
- In Submission Detail view, add a **"GPS Verification" card** in the left column:
  - Creator's check-in coordinates vs campaign coordinates
  - Distance between them (km)
  - Check-in radius match: ✅ Within radius / ❌ Outside radius
  - Timestamp of check-in
  - Visual: small static map showing both points
- Admin can **manually override GPS verification** (toggle with reason input)

#### Mock Location Data
```typescript
interface ManagedLocation {
  id: string;
  city: string;
  areaName: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

// Generate 10–15 locations across Mumbai, Delhi, Bangalore, Pune, Hyderabad
```

---

### 11.2 Instagram Reel Verification Tools

The creator platform imports Instagram reels with metrics. Admin needs tools to verify this data.

#### In Submission Detail — Reel Verification Card
- **Reel Source Info:** Import timestamp, reel code, original URL
- **Caption Audit:** Side-by-side view of "Caption at submission" vs "Current caption" (mock: same unless `captionEdited` flag is true)
- **Hashtag Compliance:** Required hashtags list with ✅/❌ per tag, highlight missing ones in red
- **"Re-fetch Metrics" button** (mock: shows spinner for 1s, then shows same data with a toast "Metrics refreshed")

#### In Creator Detail — Instagram Tab
- **Instagram Profile Card:**
  - Handle, followers count, connected status, connection date
  - Avg reach (mock), avg engagement rate (mock), total reels submitted
- **Follower History Chart** (Line, last 6 months — mock data)
- **Admin Actions:**
  - "Force Disconnect Instagram" button (confirmation dialog)
  - "Refresh Instagram Data" button (mock)

---

### 11.3 Bill / Proof-of-Purchase Verification

#### In Submission Detail — Enhanced Bill Card
- **Bill image** with zoom-on-click (modal with large view, pinch-to-zoom on mobile)
- **Bill metadata:** Bill number, upload date, file size
- **Verification status:** ✅ Verified / ⏳ Pending / ❌ Rejected
- **Admin actions:**
  - "Verify Bill" button (marks as verified)
  - "Reject Bill" button (with reason: "Unreadable", "Wrong restaurant", "Duplicate bill", "Other")
  - "Flag as Suspicious" (adds to fraud flags)
- **Duplicate Detection Alert:** If the same bill number appears in another submission, show a red warning: "Duplicate bill number found in submission #SUB-XXXX"

#### Bill Verification Queue (Sub-section in Submissions page)
- Quick-filter: "Bills pending verification" — shows submissions where `trustSignals.billVerified === false`
- Compact card view for rapid verification (bill image + bill number + creator + verify/reject buttons)

---

### 11.4 Verification Stage Management

The 72-hour verification has 4 stages: `t0 → h24 → h72 → completed`. Admin needs control over this.

#### Stage Progression Controls (In Submission Detail)
- **Stage Timeline** with timestamps for each completed stage
- **"Advance Stage" button** — Manually moves submission to next stage (with confirmation)
- **"Hold at Stage" toggle** — Prevents auto-advancement (e.g., for investigation)
- **Stage override reason** — Required when manually changing stages

#### Stage Overview Dashboard (In Submissions page, above table)
- Mini stats: "14 at T0 | 23 at 24h | 30 at 72h | 89 completed"
- "Stuck submissions" alert: Count of submissions in a stage longer than expected (e.g., > 30h at T0)

#### Platform Settings — Verification Tab (add these fields)
- Auto-advance from T0 → 24h after X hours (default: 24)
- Auto-advance from 24h → 72h after X hours (default: 48)
- Auto-advance from 72h → completed after X hours (default: 72)
- Allow manual stage advancement: toggle
- Stage hold notification: toggle (notify admin when submission is held)

---

### 11.5 Payout Formula & Bonus Engine

The creator platform calculates payouts with a specific formula. Admin must configure and override this.

#### Payout Formula Configuration (Platform Settings — new Tab 7: "Payout Formula")
- **Base payout logic:** Fixed per campaign (set by campaign creator)
- **Engagement bonus formula:**
  ```
  engagementBonus = floor((actualViews - requiredViews) / 1000) × bonusPerThousandViews
  ```
  - Display formula as readable text with variable highlights
  - Allow toggle: "Cap engagement bonus at payout max" (default: on)
- **Trust bonus formula:**
  - Trust score range → bonus multiplier mapping:
    - 90–100: +₹200–₹300
    - 75–89: +₹100–₹200
    - 60–74: +₹50–₹100
    - Below 60: ₹0
  - Configurable via a mini-table (editable ranges and amounts)
- **Penalty rules:**
  - Post deleted during verification: –100% (configurable)
  - Caption edited: –50% (configurable)
  - Low engagement (below X% of required views at 24h): –25% (configurable)
  - Custom penalty: free text reason + % deduction

#### Payout Override (In Submission Detail, Right Column)
- "Override Payout" section:
  - Toggle: "Use manual payout amount"
  - Input: ₹ amount
  - Reason: required text field
  - Shows comparison: "Auto-calculated: ₹2,140 → Manual: ₹1,800"
- Admin notes auto-logged when payout is overridden

---

### 11.6 Fraud Detection & Rules Engine

#### Fraud Rules Management Page (Super Admin only)

**Route:** `#/admin/settings` → Tab 8: "Fraud Rules"

**Fraud Rule Table:**

| Column | Description |
|--------|-------------|
| Rule Name | Human-readable (e.g., "Post Deletion Check") |
| Condition | Logic description (e.g., "Post deleted during 72h window") |
| Severity | Warning / Critical / Auto-Reject |
| Penalty | % deduction or "Full rejection" |
| Status | Active / Inactive toggle |
| Last Triggered | Date + count |

**Default Rules (pre-configured, editable):**
1. Post deleted during verification → Auto-Reject, 100% penalty
2. Caption edited during verification → Warning, 50% penalty
3. Views drop > 30% between T0 and 24h → Warning, 25% penalty
4. Same bill number submitted twice → Critical, Full rejection
5. Check-in location outside radius → Warning, flag for review
6. Engagement rate below 2% → Warning, flag for review
7. Account created < 24h ago submitting → Warning, hold for manual review

**Each rule is editable.** Admin can add custom rules with:
- Rule name
- Condition (select from dropdown: metric drop, duplicate, geo-mismatch, etc.)
- Threshold value
- Severity
- Action (flag, penalty %, auto-reject)

#### Fraud Dashboard (Reports → Tab 5: "Fraud Analytics")
- **Fraud rate trend** (Line chart, last 12 weeks)
- **Fraud type breakdown** (Donut: post deleted, caption edit, low engagement, duplicate bill, GPS mismatch)
- **Top flagged creators** (Table: creator, flag count, most common violation)
- **Rule effectiveness** (Table: rule name, times triggered, true positive rate — mock %)
- **Repeat offenders** alert: Creators with 3+ fraud flags

---

### 11.7 KYC Document Verification Workflow

#### KYC Queue Page (Sub-section in Creators page or separate tab)

**Route:** `#/admin/creators` → Tab: "KYC Queue"

**KYC Queue Table:**

| Column | Description |
|--------|-------------|
| Creator | Avatar + name + handle |
| Submitted | Date |
| PAN | Masked: ABCDE****F (click to reveal full — mock) |
| Aadhaar | Last 4 digits |
| UPI ID | Full UPI ID |
| Status | Pending (yellow) / Verified (green) / Rejected (red) |
| Actions | Verify / Reject / Request Re-submission |

**KYC Detail Modal (click on row):**
- Full PAN number (masked by default, "Reveal" button)
- Aadhaar last 4 digits
- UPI ID
- Creator join date and activation progress
- **Actions:**
  - ✅ "Verify KYC" — Sets `kycStatus` to `verified`, auto-logs in audit
  - ❌ "Reject KYC" — Requires reason selection:
    - "PAN number mismatch"
    - "Aadhaar details incomplete"
    - "Suspicious documents"
    - "Other" + free text
  - 🔄 "Request Re-submission" — Sends mock notification to creator, keeps status as `pending`

**KYC Stats (above table):**
- Pending: X | Verified this week: Y | Rejected this week: Z | Avg verification time: A hours

---

### 11.8 Milestone Badge Management

The creator platform has milestone badges (First Approved Reel, ₹10k Weekly Sprint, Clean Integrity Streak, Leaderboard Top 10). Admin must manage these.

#### Badge Management Page (Super Admin, under Platform Settings → Tab 9: "Badges & Milestones")

**Badge Table:**

| Column | Description |
|--------|-------------|
| Badge | Icon + name |
| Description | What it means |
| Unlock Criteria | Condition to earn |
| Creators Earned | Count |
| Status | Active / Inactive |
| Actions | Edit / Deactivate |

**Default Badges:**
1. **First Approved Reel** — "First submission approved" — Icon: Star
2. **₹10k Weekly Sprint** — "Earn ₹10,000+ in a single week" — Icon: Zap
3. **Clean Integrity Streak** — "5 consecutive submissions with zero fraud flags" — Icon: Shield
4. **Leaderboard Top 10** — "Reach top 10 on weekly leaderboard" — Icon: Trophy

**Create/Edit Badge Form:**
- Badge name
- Description
- Icon (select from Lucide icon set — show grid of 20 common icons)
- Unlock criteria type: Submission count | Earnings threshold | Streak | Rank | Custom
- Threshold value
- Reward (optional): Payout multiplier %, trust score bonus
- Active toggle

#### In Creator Detail — Badges Tab
- Grid of all badges with earned/locked state per creator
- "Grant Badge" button (manual award with reason)
- "Revoke Badge" button (with reason)

---

### 11.9 Creator Activation Funnel

The creator platform tracks `activationProgress` (0–100%). Admin needs visibility into the onboarding funnel.

#### Dashboard — Activation Funnel Card (add to Dashboard Section 5.2)
- **Funnel Visualization** (horizontal bar or funnel chart):
  - Step 1: Profile created → X creators (100%)
  - Step 2: Instagram connected → Y creators (% of step 1)
  - Step 3: KYC submitted → Z creators (% of step 2)
  - Step 4: UPI added → W creators (% of step 3)
  - Step 5: Terms accepted → V creators (% of step 4)
  - Step 6: First campaign joined → U creators (% of step 5)
  - Step 7: First submission → T creators (% of step 6)
- **Drop-off alerts:** Highlight the step with highest drop-off in red
- **Stuck creators count:** "34 creators stuck at KYC step for 7+ days"

#### Reports — Tab 5: "Creator Funnel" (add new tab)
- Full funnel chart (same as above, larger)
- Stage-by-stage conversion rates over time (line chart, weekly)
- Avg time to complete each step
- City-wise activation comparison (grouped bar chart)

#### In Creator Detail — Profile Tab
- **Activation Progress** bar (0–100%)
- Steps completed vs pending (checklist with ✅/⏳)
- "Manually Advance Step" button (for admin to unblock stuck creators)

---

### 11.10 Submission Ranking System

Each submission has a `ranking` field within its campaign. Admin must understand and manage this.

#### In Submission Detail — Ranking Card (enhance existing)
- "Rank #7 of 34 submissions for this campaign"
- **Ranking criteria (read-only display):**
  - 50% — Views (normalized)
  - 30% — Engagement rate (likes + comments / views)
  - 20% — Trust score bonus
- **Rank History:** If metrics change between T0/24h/72h, show rank at each checkpoint
- **Admin Override:** "Adjust Ranking" button → input new rank + reason

#### Campaign Detail — Rankings Tab (add new tab)
- Full ranked table of all submissions for this campaign
- Sortable by: Current rank, Views, Engagement, Trust score
- Highlight ties (same score = same rank)
- "Recalculate Rankings" button (mock: shows loading then same data)

---

### 11.11 Leaderboard Configuration

#### Leaderboard Management Page — Configuration Panel (expand Section 5.7)

**Tier Configuration Table (editable):**

| Tier | Rank Range | Min Weekly Earnings | Payout Multiplier | Color |
|------|-----------|--------------------|--------------------|-------|
| Gold | Top 1–3 | ₹12,000+ | +12% | amber-500 |
| Silver | Top 4–10 | ₹6,000+ | +7% | slate-400 |
| Bronze | All others | — | +0% | amber-700 |

- Each row is editable inline
- "Add Tier" button for custom tiers

**Leaderboard Settings:**
- Reset day: Select (Monday–Sunday, default: Monday)
- Reset time: Time picker (default: 00:00 IST)
- Timezone: Select (default: Asia/Kolkata)
- "Manual Reset" button (Super Admin, confirmation dialog)
- "View Past Weeks" — Dropdown to select previous week's leaderboard snapshot

**Badge Types Configuration:**

| Badge | Criteria | Auto-assign |
|-------|----------|-------------|
| Top 10 | Rank ≤ 10 | ✅ Auto |
| Consistency Pro | 4+ submissions in the week | ✅ Auto |
| Verified | KYC verified + Trust ≥ 85 | ✅ Auto |

- Each badge criteria is editable
- Toggle auto-assign on/off
- "Assign Manually" button per creator

---

### 11.12 Campaign Performance Metrics

#### Campaign Detail — Analytics Tab (expand existing)
- **Success Rate Calculation:** `approved / total submissions × 100` (display formula)
- **Average Earning:** Auto-calculated from `sum(finalPayout) / count(paid submissions)`
- **Admin can override displayed values:** Toggle "Use auto-calculated" vs "Manual override" for `successRate` and `averageEarning`
- **Performance benchmarks:**
  - Compare this campaign vs category average (e.g., "Fitness campaigns avg 84% success, this one is 92%")
  - Compare this campaign vs city average

#### Social Proof Management (In Campaign Create/Edit Form)
- **Social Proof Text Field** (already in spec — enhance with):
  - Character count (max 120)
  - "Auto-generate" button: Creates text from campaign data (e.g., "88% of creators earned ₹1,720+ from this campaign")
  - Template dropdown: Select from pre-written templates
  - Preview: Show how it appears in creator app

---

### 11.13 City-Scoped Access Control

Admin users have `managedCities` that restrict their data access.

#### Access Control Rules
- **Campaign List:** Admin sees only campaigns in their managed cities
- **Creator List:** Admin sees only creators in their managed cities
- **Submissions:** Admin sees only submissions for campaigns in their managed cities
- **Payouts:** Admin sees only payouts for their scoped submissions
- **Dashboard Stats:** Filtered to managed cities only
- **Reports:** Filtered to managed cities, no cross-city data

#### Super Admin — City Scope Indicator
- When Super Admin views any page, show a "Viewing: All Cities" badge at top
- Dropdown to filter by specific city (Super Admin can narrow their view)
- When viewing an Admin's data, show "Viewing as: [Admin Name] ([City, City])"

#### Admin — City Scope Display
- Sidebar footer: "Managing: Mumbai, Pune" (cities listed)
- If Admin tries to create a campaign in an unmanaged city → validation error: "You don't have access to this city"

---

### 11.14 Transaction Timeline & SLA Tracking

#### In Payout Detail (enhance existing modal)
- **Transaction Timeline** (vertical stepper):
  1. Created — timestamp
  2. Locked (72h window) — timestamp + "Unlocks at [date]"
  3. Unlocked — timestamp
  4. Processing — timestamp + "Processed by [Admin name]"
  5. Paid — timestamp + UPI reference (mock)
  - OR Failed — timestamp + failure reason
- **SLA Metrics:**
  - Time from submission to payout: X hours
  - Time in locked state: Y hours
  - Time in processing: Z hours
  - "On Track" / "Delayed" badge (delayed if total > 96h)

#### Reports — Payout Tab (add SLA section)
- **Avg SLA by stage** (bar chart: avg hours at each stage)
- **SLA breach rate** (% of payouts that took > 96h)
- **Bottleneck analysis:** Which stage causes most delays?

---

### 11.15 Additional Data Structure Fields

Add these missing fields to existing interfaces in Section 6:

```typescript
// Add to SubmissionAdmin interface:
interface SubmissionAdmin {
  // ... existing fields ...
  checkInLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    distanceFromCampaign: number;  // km
    withinRadius: boolean;
  };
  captionAtSubmission: string;      // Original caption snapshot
  captionCurrent: string;           // Current caption (may differ)
  hashtagsMatched: string[];        // Which required hashtags were found
  hashtagsMissing: string[];        // Which required hashtags were NOT found
  reelImportedAt: string;           // When the reel was imported
  billVerificationStatus: 'pending' | 'verified' | 'rejected';
  billRejectionReason?: string;
  stageTimestamps: {
    t0: string;
    h24?: string;
    h72?: string;
    completed?: string;
  };
  rankHistory: Array<{
    stage: string;
    rank: number;
    timestamp: string;
  }>;
  payoutOverride?: {
    amount: number;
    reason: string;
    overriddenBy: string;
    overriddenAt: string;
  };
}

// Add to CreatorAdmin interface:
interface CreatorAdmin {
  // ... existing fields ...
  activationProgress: number;          // 0–100
  activationStepsCompleted: {
    profileCreated: boolean;
    instagramConnected: boolean;
    kycSubmitted: boolean;
    upiAdded: boolean;
    termsAccepted: boolean;
  };
  instagramMetrics: {
    avgReach: number;
    avgEngagement: number;
    totalReelsSubmitted: number;
    connectedAt: string;
    lastRefreshedAt: string;
  };
  milestoneBadges: Array<{
    id: string;
    name: string;
    earnedAt?: string;
    isUnlocked: boolean;
  }>;
  followerHistory: Array<{
    month: string;
    followers: number;
  }>;
}

// Add to CampaignAdmin interface:
interface CampaignAdmin {
  // ... existing fields ...
  averageEarning: number;
  autoCalculateMetrics: boolean;     // If true, successRate & avgEarning auto-calculated
  socialProofTemplate?: string;
}

// New interface:
interface FraudRule {
  id: string;
  name: string;
  description: string;
  condition: 'post_deleted' | 'caption_edited' | 'view_drop' | 'duplicate_bill' | 'gps_mismatch' | 'low_engagement' | 'new_account' | 'custom';
  threshold?: number;                // e.g., 30 for "30% view drop"
  severity: 'warning' | 'critical' | 'auto_reject';
  penaltyPercent: number;            // 0–100
  isActive: boolean;
  timesTriggered: number;
  lastTriggeredAt?: string;
  createdBy: string;
  createdAt: string;
}

// New interface:
interface MilestoneBadge {
  id: string;
  name: string;
  description: string;
  icon: string;                      // Lucide icon name
  unlockCriteria: 'submission_count' | 'earnings_threshold' | 'streak' | 'rank' | 'custom';
  thresholdValue: number;
  rewardMultiplier?: number;         // e.g., 1.05 for +5%
  trustScoreBonus?: number;          // e.g., +5
  isActive: boolean;
  totalEarned: number;               // How many creators have this
  createdAt: string;
}

// New interface:
interface LeaderboardConfig {
  tiers: Array<{
    name: string;
    rankRange: { min: number; max: number | null };  // null = no upper limit
    minWeeklyEarnings: number;
    payoutMultiplier: number;         // e.g., 1.12 for +12%
    color: string;                    // Tailwind color class
  }>;
  resetDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  resetTime: string;                  // "00:00"
  timezone: string;                   // "Asia/Kolkata"
  badgeTypes: Array<{
    name: string;
    criteria: string;
    autoAssign: boolean;
  }>;
  weeklySnapshots: Array<{
    weekStart: string;
    weekEnd: string;
    entries: LeaderboardEntry[];
  }>;
}
```

---

### 11.16 Updated Mock Data Volume

Expand the mock data requirements from Section 6 to include:

- **10–15 Managed Locations** (across Mumbai, Delhi, Bangalore, Pune, Hyderabad)
- **7 Fraud Rules** (pre-configured as listed above)
- **4 Milestone Badges** (as listed above, with earned counts)
- **6 months of follower history** per creator (for charts)
- **Leaderboard snapshots** for last 4 weeks
- **Activation funnel data** for the funnel chart (7 steps, decreasing counts)
- **SLA metrics** — avg hours at each payout stage
- **Bill verification queue** — 8–10 submissions with `billVerified: false`
- **Stage distribution** — count of submissions at each verification stage

---

### 11.17 Updated Route Map

Add these new routes:

```
#/admin/settings/fraud-rules          — Fraud Rules (under Settings, Tab 8)
#/admin/settings/badges               — Badge Management (under Settings, Tab 9)
```

These are tabs within the existing Settings page, not separate routes. But if the agent prefers, they can be standalone pages.

---

### 11.18 Updated Sidebar Navigation

```
Main:
  Dashboard                    — LayoutDashboard icon
  Campaigns                    — Megaphone icon
  Creators                     — Users icon
  Submissions                  — ClipboardCheck icon
  Payouts                      — Wallet icon
  Leaderboard                  — Trophy icon
──────────
Platform (Super Admin):
  Admin Management             — ShieldCheck icon
  Platform Settings            — Settings icon
    ├─ General
    ├─ Campaign Defaults
    ├─ Verification
    ├─ Trust Score
    ├─ Payout
    ├─ Notifications
    ├─ Payout Formula        ← NEW
    ├─ Fraud Rules           ← NEW
    └─ Badges & Milestones   ← NEW
  Audit Log                    — ScrollText icon
──────────
General:
  Reports & Analytics          — BarChart3 icon
    ├─ Revenue & Payouts
    ├─ Creator Analytics
    ├─ Campaign Performance
    ├─ Submission Analytics
    ├─ Fraud Analytics       ← NEW
    └─ Creator Funnel        ← NEW
──────────
Account:
  Profile                      — User icon
  Logout                       — LogOut icon
```

---

## Summary

1. **Compact & Information-Dense:** Admin panels prioritize data density — use tables, not cards, for list views. Reserve cards for summary metrics.
2. **Role-Driven UI:** Components conditionally render based on role. No dead links or disabled states — hide what's not accessible.
3. **Action-Oriented:** Every page has clear CTAs. The submission review page is the most critical — optimize for speed (approve/reject in <3 clicks).
4. **Consistent Patterns:** Every list page follows the same structure: Header → Stat cards → Filters → Table → Pagination.
5. **Responsive First:** Every layout works on 360px mobile screens. Tables become cards. Modals become full-screen.
6. **PWA Ready:** Standalone display, offline shell caching, touch-optimized, installable.

The frontend agent should build this as a separate route tree (`#/admin/...`) within the existing Vite + React project, sharing the TailwindCSS config, font stack, and base UI components (shadcn/ui) with the creator platform.
