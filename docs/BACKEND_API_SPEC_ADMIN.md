# TryTheMenu — Admin Panel Backend API Specification

> **Version:** 2.0 — Updated to match actual backend implementation
> **Purpose:** Complete reference for the frontend agent building the Creator Admin portal.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication & Session](#2-authentication--session)
3. [Role-Based Access Control](#3-role-based-access-control)
4. [Data Models](#4-data-models)
5. [API Endpoints](#5-api-endpoints)
   - [5.1 Auth](#51-auth)
   - [5.2 Dashboard](#52-dashboard)
   - [5.3 Campaigns](#53-campaigns)
   - [5.4 Creators](#54-creators)
   - [5.5 Submissions](#55-submissions)
   - [5.6 Payouts & Pool](#56-payouts--pool)
   - [5.7 Leaderboard](#57-leaderboard)
   - [5.8 Reports](#58-reports)
   - [5.9 Admin Users](#59-admin-users)
   - [5.10 Platform Settings](#510-platform-settings)
   - [5.11 Audit Log](#511-audit-log)
   - [5.12 Notifications](#512-notifications)
6. [Business Rules](#6-business-rules)
7. [Enum Reference](#7-enum-reference)
8. [Pagination Convention](#8-pagination-convention)
9. [Error Format](#9-error-format)

---

## 1. Overview

**Platform:** TryTheMenu — Creator marketing platform where creators visit restaurants, create Instagram Reels, and earn payouts.

**Base URL:** `http://localhost:3000/api/admin`
(Configure via `VITE_API_BASE_URL` or equivalent env var — strip trailing slash)

**Auth Header (all protected endpoints):**

```
Authorization: Bearer <accessToken>
```

**Content-Type:** `application/json`

**Currency:** INR (₹). All monetary values are `number` (decimal, 2dp). e.g. `500.00`

---

## 2. Authentication & Session

- Login returns `accessToken` (8h TTL) + `refreshToken` (7d TTL)
- Store session in `localStorage` under key `ttm_admin_session`:

```typescript
{
  token: string; // access token
  refreshToken: string;
  expiresIn: number; // 28800 (seconds)
  user: {
    userId: string;
    name: string;
    email: string;
    role: "SUPERADMIN" | "ADMIN";
    avatar: string | null;
    loginAt: string; // ISO timestamp
  }
}
```

- Send `Authorization: Bearer <token>` on every protected request
- On `401` response → call `/auth/refresh` → store new token → retry original request
- On refresh failure → clear session → redirect to `/login`

---

## 3. Role-Based Access Control

| Role         | Access                                                         |
| ------------ | -------------------------------------------------------------- |
| `SUPERADMIN` | Full platform — all pages, all cities, all settings            |
| `ADMIN`      | Operational — campaigns/creators/submissions; city-scoped only |

**City-scoping:** `ADMIN` role only sees data for their `managedCities[]`. Applied automatically server-side. Frontend can still show city filter UI but the server enforces boundaries.

| Page                | Required Role     |
| ------------------- | ----------------- |
| `/login`            | Public            |
| `/dashboard`        | Any admin         |
| `/campaigns/*`      | Any admin         |
| `/creators/*`       | Any admin         |
| `/submissions/*`    | Any admin         |
| `/payouts`          | Any admin         |
| `/leaderboard`      | Any admin         |
| `/reports`          | Any admin         |
| `/profile`          | Any admin         |
| `/admin-management` | `SUPERADMIN` only |
| `/settings`         | `SUPERADMIN` only |
| `/audit-log`        | `SUPERADMIN` only |

---

## 4. Data Models

### 4.1 AdminUser

```typescript
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN";
  avatar: string | null;
  phone: string | null;
  department: string | null;
  managedCities: string[]; // empty = all cities (SUPERADMIN)
  isActive: boolean;
  lastLoginAt: string | null; // ISO timestamp
  createdAt: string;
  updatedAt: string;
  // passwordHash is NEVER returned
}
```

### 4.2 Campaign

```typescript
interface Campaign {
  id: string;
  restaurantName: string; // "business name" in UI
  restaurantLogo: string | null; // URL
  city: string;
  cuisine: string | null; // category in UI (Restaurant/Fitness/Beauty/etc.)
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  payoutBase: number; // INR
  payoutMin: number;
  payoutMax: number;
  bonusPerThousandViews: number;
  requiredViews: number;
  requiredHashtags: string[];
  rules: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  totalSpots: number;
  spotsLeft: number;
  isActive: boolean; // true = live, false = inactive/draft/ended
  successRate: number; // 0–100
  averageEarning: number; // INR
  estimatedVisitTimeMins: number;
  checkInRadiusMeters: number;
  deadline: string; // ISO timestamp
  createdById: string | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  // Aggregated (on list response only):
  submissionsCount: number;
  joinsCount: number;
}
```

> **Note:** The spec/UI term "status" (`draft/active/paused/expired`) maps to `isActive + deadline`:
>
> - Active = `isActive: true` AND `deadline` in future
> - Inactive/Draft = `isActive: false`
> - Expired = `deadline` past (regardless of `isActive`)

### 4.3 Creator

```typescript
interface Creator {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  profileImage: string | null; // URL, maps to "avatar" in UI
  instagramId: string;
  instagramHandle: string | null; // e.g. "foodie_creator" (without @)
  instagramFollowers: number;
  instagramConnected: boolean;
  kycStatus: "PENDING" | "SUBMITTED" | "VERIFIED"; // see note below
  upiId: string | null;
  trustScore: number; // 0–100
  walletBalance: number; // INR available
  lockedEarnings: number; // INR in pending submissions
  lifetimeEarnings: number;
  weeklyEarnings: number;
  reelsDone: number;
  activationProgress: number; // 0–100
  termsAccepted: boolean;
  joinedAt: string;
  updatedAt: string;
}
```

> **KYC Status Note:** DB enum is `PENDING | SUBMITTED | VERIFIED`. There is no `REJECTED` at Creator level — KYC rejection is stored on the `KycRecord` row. When filtering by kycStatus in API: `pending`, `verified`, `rejected` map to the KycRecord status.

### 4.4 KycRecord

```typescript
interface KycRecord {
  id: string;
  creatorId: string;
  panNumber: string;
  aadhaarLast4: string;
  status: "PENDING" | "VERIFIED" | "REJECTED"; // Note: 'SUBMITTED' used internally
  adminNotes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}
```

### 4.5 Submission

```typescript
interface Submission {
  id: string;
  campaignId: string;
  creatorId: string;
  reelUrl: string;
  reelCode: string;
  reelThumbnail: string | null;
  captionAtSubmission: string | null;
  billNumber: string | null;
  billImageUrl: string | null;
  gpsLatitude: number | null;
  gpsLongitude: number | null;
  gpsAccuracyMeters: number | null;
  submittedAt: string;
  unlockAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  verificationStage: "T0" | "H24" | "H72" | "COMPLETED";
  projectedPayout: number;
  finalPayout: number | null;
  adminNotes: string | null;
  gpsVerified: boolean;
  billVerified: boolean;
  postDeleted: boolean;
  captionEdited: boolean;
  lowEngagement: boolean;
  fraudFlags: string[];
  payoutBase: number;
  payoutEngagementBonus: number;
  payoutTrustBonus: number;
  payoutPenalties: number;
  reviewedById: string | null;
  reviewedAt: string | null;
  reviewedBy: { id: string; name: string } | null;
  notes: SubmissionNote[];
  submissionMetrics: SubmissionMetric[];
}

interface SubmissionNote {
  id: string;
  submissionId: string;
  adminId: string;
  adminName: string;
  note: string;
  createdAt: string;
}

interface SubmissionMetric {
  id: string;
  submissionId: string;
  label: "T0" | "H24" | "H72";
  recordedAt: string;
  views: number;
  likes: number;
  comments: number;
}
```

### 4.6 WalletTransaction (Payout)

```typescript
interface WalletTransaction {
  id: string;
  creatorId: string;
  submissionId: string | null;
  amount: number; // INR
  type: string;
  status: "LOCKED" | "PROCESSING" | "PAID" | "FAILED";
  createdAt: string;
  updatedAt: string;
}
```

### 4.7 PoolFund

```typescript
interface PoolFund {
  id: string;
  balance: number; // Current available INR
  totalDeposited: number;
  totalDisbursed: number;
  totalAllocated: number; // Reserved for pending releases
  updatedAt: string;
}
```

### 4.8 PoolTransaction

```typescript
interface PoolTransaction {
  id: string;
  type: "DEPOSIT" | "PAYOUT";
  amount: number;
  description: string;
  performedById: string;
  performedByName: string;
  balanceAfter: number;
  relatedTxnId: string | null;
  createdAt: string;
}
```

### 4.9 AuditLog

```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminRole: "SUPERADMIN" | "ADMIN";
  action: string; // e.g. "APPROVED_SUBMISSION"
  category:
    | "AUTH"
    | "SUBMISSION"
    | "CAMPAIGN"
    | "CREATOR"
    | "PAYOUT"
    | "SETTINGS"
    | "ADMIN_MGMT";
  targetType: string | null; // e.g. "Campaign"
  targetId: string | null;
  targetName: string | null;
  severity: "INFO" | "WARNING" | "CRITICAL";
  ipAddress: string | null;
  details: Record<string, unknown> | null;
}
```

### 4.10 AdminNotification

```typescript
interface AdminNotification {
  id: string;
  adminId: string | null; // null = broadcast to all admins
  type:
    | "SUBMISSION_NEW"
    | "PAYOUT_FAILED"
    | "KYC_PENDING"
    | "CAMPAIGN_EXPIRING"
    | "FRAUD_FLAG"
    | "SYSTEM";
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  severity: "INFO" | "WARNING" | "CRITICAL";
  createdAt: string;
}
```

### 4.11 FraudRule

```typescript
interface FraudRule {
  id: string;
  name: string;
  description: string;
  condition:
    | "POST_DELETED"
    | "CAPTION_EDITED"
    | "VIEW_DROP"
    | "DUPLICATE_BILL"
    | "GPS_MISMATCH"
    | "LOW_ENGAGEMENT"
    | "NEW_ACCOUNT"
    | "CUSTOM";
  threshold: number | null;
  severity: "WARNING" | "CRITICAL" | "AUTO_REJECT";
  penaltyPercent: number; // 0–100
  isActive: boolean;
  timesTriggered: number;
  lastTriggeredAt: string | null;
  createdById: string;
  createdAt: string;
}
```

---

## 5. API Endpoints

---

### 5.1 Auth

#### `POST /auth/login`

**Public — no auth required**

**Request:**

```json
{
  "email": "admin@trythemenu.com",
  "password": "Admin@123"
}
```

**Response `200`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 28800,
  "user": {
    "userId": "clx1234",
    "name": "Super Admin",
    "email": "admin@trythemenu.com",
    "role": "SUPERADMIN",
    "avatar": null,
    "loginAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `401`:**

```json
{ "error": "invalid_credentials", "message": "Invalid email or password." }
```

---

#### `POST /auth/logout`

**Requires auth**

**Response `200`:**

```json
{ "success": true }
```

---

#### `GET /auth/me`

**Requires auth**

**Response `200`:**

```json
{
  "data": {
    "id": "clx1234",
    "name": "Super Admin",
    "email": "admin@trythemenu.com",
    "role": "SUPERADMIN",
    "avatar": null,
    "phone": null,
    "department": "Platform",
    "managedCities": [],
    "isActive": true,
    "lastLoginAt": "2026-03-08T10:00:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-03-08T10:00:00.000Z"
  }
}
```

---

#### `POST /auth/refresh`

**Public — no auth required**

**Request:**

```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiJ9..." }
```

**Response `200`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 28800
}
```

---

### 5.2 Dashboard

All dashboard endpoints **require auth**. `ADMIN` role is automatically city-scoped.

#### `GET /dashboard/stats?period=30d`

**Query:** `period` = `7d` | `30d` | `90d` (default `30d`)

**Response `200`:**

```json
{
  "data": {
    "totalCreators": 2847,
    "creatorsGrowthPercent": 12,
    "newCreatorsThisMonth": 248,
    "activeCampaigns": 34,
    "campaignsEndingThisWeek": 7,
    "pendingSubmissions": 156,
    "submissionsNeedReviewToday": 23,
    "submissionsGrowthPercent": 18,
    "totalPayoutsThisMonth": 487500.0,
    "pendingPayouts": 23400.0,
    "payoutsGrowthPercent": 22,
    "approvalRate": 78,
    "lastMonthApprovalRate": 74
  }
}
```

---

#### `GET /dashboard/creator-growth?period=30d`

**Response `200`:**

```json
{
  "data": [
    { "week": "W1 Jan", "creators": 45 },
    { "week": "W2 Jan", "creators": 62 },
    { "week": "W3 Jan", "creators": 58 }
  ]
}
```

---

#### `GET /dashboard/submission-volume?period=30d`

**Response `200`:**

```json
{
  "data": [
    { "week": "W1 Jan", "submissions": 120, "approved": 89, "rejected": 31 },
    { "week": "W2 Jan", "submissions": 145, "approved": 110, "rejected": 35 }
  ]
}
```

---

#### `GET /dashboard/top-campaigns?limit=5`

**Query:** `limit` (default `5`)

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Starbucks Bandra Launch",
      "successRate": 82,
      "totalSubmissions": 45,
      "totalPaidOut": 22500.0
    }
  ]
}
```

---

#### `GET /dashboard/activation-funnel`

**Response `200`:**

```json
{
  "data": {
    "registered": 2847,
    "instagramConnected": 2100,
    "kycSubmitted": 1800,
    "kycVerified": 1450,
    "firstSubmission": 980
  }
}
```

---

#### `GET /dashboard/activity-feed?limit=20`

**Query:** `limit` (default `20`)

**Response `200`:**

```json
{
  "data": [
    {
      "type": "submission",
      "submissionId": "uuid",
      "status": "PENDING",
      "timestamp": "2026-03-08T10:30:00.000Z",
      "creator": {
        "id": "uuid",
        "name": "Priya Sharma",
        "instagramHandle": "priya_creates"
      },
      "campaign": {
        "id": "uuid",
        "restaurantName": "Starbucks Bandra"
      }
    },
    {
      "type": "approval",
      "submissionId": "uuid",
      "status": "APPROVED",
      "timestamp": "2026-03-08T09:15:00.000Z",
      "creator": {
        "id": "uuid",
        "name": "Rahul Mehta",
        "instagramHandle": "rahul_eats"
      },
      "campaign": { "id": "uuid", "restaurantName": "Burger Shack" }
    }
  ]
}
```

> `type` = `"approval"` if status is `APPROVED` or `PAID`, else `"submission"`

---

#### `GET /dashboard/operational-health`

**Response `200`:**

```json
{
  "data": {
    "poolBalance": 125000.0,
    "failedPayoutsLast24h": 3,
    "pendingKycCount": 47,
    "fraudFlaggedToday": 8,
    "avgSubmissionReviewHours": 4.2
  }
}
```

---

### 5.3 Campaigns

**Requires auth.** ADMIN role city-scoped.

#### `GET /campaigns`

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | |
| `limit` | number | `20` | max 100 |
| `isActive` | `true`\|`false` | — | Filter active/inactive |
| `city` | string | — | Filter by city |
| `search` | string | — | Search restaurantName, address, description |
| `sortBy` | `createdAt`\|`deadline`\|`successRate`\|`totalSpots` | `createdAt` | |
| `sortOrder` | `asc`\|`desc` | `desc` | |

> **No `status` or `category` query param.** Use `isActive` for status. Category filter not supported server-side.

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "restaurantName": "Starbucks Bandra",
      "restaurantLogo": "https://...",
      "city": "Mumbai",
      "address": "42, Linking Road, Bandra",
      "payoutBase": 500.0,
      "payoutMin": 300.0,
      "payoutMax": 800.0,
      "bonusPerThousandViews": 50.0,
      "requiredViews": 5000,
      "deadline": "2026-04-01T00:00:00.000Z",
      "spotsLeft": 62,
      "totalSpots": 100,
      "isActive": true,
      "successRate": 78.0,
      "averageEarning": 520.0,
      "difficulty": "MEDIUM",
      "submissionsCount": 38,
      "joinsCount": 45,
      "createdBy": { "id": "admin-id", "name": "Super Admin" },
      "createdAt": "2026-03-01T00:00:00.000Z"
    }
  ],
  "total": 87,
  "page": 1,
  "limit": 20,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": false,
  "summary": {
    "active": 34,
    "inactive": 53
  }
}
```

---

#### `GET /campaigns/:id`

**Response `200`:**

```json
{
  "data": {
    "id": "uuid",
    "restaurantName": "Starbucks Bandra",
    "restaurantLogo": "https://...",
    "city": "Mumbai",
    "cuisine": "Restaurant",
    "address": "42, Linking Road, Bandra",
    "latitude": 19.0596,
    "longitude": 72.8295,
    "description": "Visit us and create a Reel!",
    "payoutBase": 500.0,
    "payoutMin": 300.0,
    "payoutMax": 800.0,
    "bonusPerThousandViews": 50.0,
    "requiredViews": 5000,
    "requiredHashtags": ["#TryTheMenu", "#StarbucksBandra"],
    "rules": ["Visit during open hours", "Must check-in via app"],
    "fraudChecks": [],
    "difficulty": "MEDIUM",
    "totalSpots": 100,
    "spotsLeft": 62,
    "isActive": true,
    "successRate": 78.0,
    "averageEarning": 520.0,
    "estimatedVisitTimeMins": 60,
    "checkInRadiusMeters": 500,
    "deadline": "2026-04-01T00:00:00.000Z",
    "createdById": "admin-id",
    "createdBy": {
      "id": "admin-id",
      "name": "Super Admin",
      "email": "admin@trythemenu.com"
    },
    "createdAt": "2026-03-01T00:00:00.000Z",
    "updatedAt": "2026-03-05T00:00:00.000Z",
    "_count": { "submissions": 38, "campaignJoins": 45 }
  }
}
```

---

#### `POST /campaigns`

**Request:**

```json
{
  "businessName": "Starbucks Bandra",
  "businessLogo": "https://...",
  "category": "Restaurant",
  "name": "Summer Launch",
  "city": "Mumbai",
  "address": "42, Linking Road, Bandra",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "description": "Visit us and create a Reel!",
  "payoutBase": 500,
  "payoutMin": 300,
  "payoutMax": 800,
  "requiredViews": 5000,
  "bonusPerThousandViews": 50,
  "requiredHashtags": ["#TryTheMenu"],
  "rules": ["Visit during open hours"],
  "difficulty": "Medium",
  "totalSpots": 100,
  "deadline": "2026-04-01T00:00:00.000Z",
  "estimatedVisitTimeMins": 60,
  "checkInRadiusMeters": 500,
  "isActive": false
}
```

**Field notes:**

- `businessName` → stored as `restaurantName`
- `category` → stored as `cuisine` (for display only, not filterable)
- `difficulty`: `"Easy"` | `"Medium"` | `"Hard"` (title-case in request, stored as `EASY`/`MEDIUM`/`HARD`)
- `isActive: false` = draft/inactive, `true` = live

**Response `201`:** Full campaign object.

---

#### `PATCH /campaigns/:id`

All fields optional. Same field names as POST.

**Response `200`:** Updated campaign object.

---

#### `DELETE /campaigns/:id`

Soft-delete: sets `isActive=false`, `deadline` to past.

**Response `200`:**

```json
{ "success": true }
```

---

#### `PATCH /campaigns/:id/status`

**Request:**

```json
{ "isActive": true }
```

> No `status` string field — only `isActive` boolean.

**Response `200`:** Updated campaign object.

---

#### `GET /campaigns/:id/submissions`

**Query:** `page`, `limit`, `status` (`PENDING`|`APPROVED`|`REJECTED`|`PAID`), `stage` (`T0`|`H24`|`H72`|`COMPLETED`)

**Response `200`:** Paginated submission list (see Submission model, includes `creator` and `reviewedBy`).

---

#### `GET /campaigns/:id/analytics`

**Response `200`:**

```json
{
  "data": {
    "campaignId": "uuid",
    "campaignName": "Starbucks Bandra",
    "totalSubmissions": 38,
    "submissionTimeline": [
      { "week": "W1 Mar", "submissions": 12, "approved": 9, "rejected": 3 }
    ],
    "topCreators": [
      {
        "id": "creator-uuid",
        "name": "Priya Sharma",
        "instagramHandle": "priya_creates",
        "instagramFollowers": 12400,
        "submissionsCount": 2
      }
    ],
    "payoutDistribution": {
      "min": 300.0,
      "max": 750.0,
      "avg": 520.0,
      "total": 14560.0,
      "count": 28
    }
  }
}
```

---

### 5.4 Creators

**Requires auth.** ADMIN role city-scoped.

#### `GET /creators`

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | |
| `limit` | number | `20` | |
| `search` | string | — | Search name / email / instagramHandle |
| `kycStatus` | `pending`\|`verified`\|`rejected` | — | KYC filter (case-insensitive) |
| `accountStatus` | `active`\|`inactive`\|`flagged` | — | Account status filter |
| `city` | string | — | |
| `sortBy` | `joinedAt`\|`trustScore`\|`earnings`\|`submissions` | `joinedAt` | |

**Response `200`:**

```json
{
  "stats": {
    "total": 2847,
    "active": 2100,
    "kycPending": 120,
    "flagged": 23
  },
  "data": [
    {
      "id": "uuid",
      "name": "Priya Sharma",
      "email": "priya@example.com",
      "phone": "+919876543210",
      "city": "Mumbai",
      "profileImage": "https://...",
      "instagramHandle": "priya_creates",
      "instagramFollowers": 12400,
      "instagramConnected": true,
      "kycStatus": "VERIFIED",
      "trustScore": 88,
      "walletBalance": 2400.0,
      "lockedEarnings": 500.0,
      "lifetimeEarnings": 18600.0,
      "weeklyEarnings": 800.0,
      "reelsDone": 23,
      "joinedAt": "2026-01-15T00:00:00.000Z"
    }
  ],
  "total": 2847,
  "page": 1,
  "limit": 20,
  "totalPages": 143,
  "hasNext": true,
  "hasPrev": false
}
```

---

#### `GET /creators/:id`

**Response `200`:**

```json
{
  "data": {
    "id": "uuid",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+919876543210",
    "city": "Mumbai",
    "language": "English",
    "profileImage": "https://...",
    "instagramId": "ig-12345",
    "instagramHandle": "priya_creates",
    "instagramFollowers": 12400,
    "instagramConnected": true,
    "kycStatus": "VERIFIED",
    "upiId": "priya@upi",
    "trustScore": 88,
    "walletBalance": 2400.0,
    "lockedEarnings": 500.0,
    "lifetimeEarnings": 18600.0,
    "weeklyEarnings": 800.0,
    "activationProgress": 100,
    "termsAccepted": true,
    "consecutiveApprovedCount": 5,
    "totalReels": 25,
    "avgReach": 9200.0,
    "avgEngagement": 4.2,
    "reelsDone": 23,
    "joinedAt": "2026-01-15T00:00:00.000Z",
    "updatedAt": "2026-03-07T00:00:00.000Z",
    "kycRecords": [
      {
        "id": "kyc-uuid",
        "panNumber": "ABCDE1234F",
        "aadhaarLast4": "5678",
        "status": "VERIFIED",
        "adminNotes": null,
        "submittedAt": "2026-01-20T00:00:00.000Z",
        "reviewedAt": "2026-01-22T00:00:00.000Z"
      }
    ],
    "creatorMilestones": [],
    "leaderboardArchive": []
  }
}
```

---

#### `PATCH /creators/:id`

Only these fields accepted (strict — no extra keys):

```json
{
  "accountStatus": "active",
  "flagReason": null,
  "assignedAdmin": "admin-id"
}
```

**Response `200`:** Updated creator object.

---

#### `PATCH /creators/:id/kyc`

**Request:**

```json
{
  "kycStatus": "verified",
  "reason": "Documents verified successfully"
}
```

**Values:** `kycStatus` → `pending` | `verified` | `rejected`

**Response `200`:** Updated creator object.

**Side effects:** Updates `KycRecord.status` + `KycRecord.adminNotes` + `Creator.kycStatus`.

---

#### `PATCH /creators/:id/flag`

**Request:**

```json
{
  "accountStatus": "flagged",
  "flagReason": "Multiple fraud flags detected"
}
```

**Values:** `accountStatus` → `active` | `flagged`

**Response `200`:** `{ "success": true }`

---

#### `GET /creators/:id/submissions`

**Query:** `page`, `limit`, `status` (`pending`|`approved`|`rejected`|`paid`)

**Response `200`:** Paginated submission list.

---

#### `GET /creators/:id/transactions`

**Query:** `page`, `limit`, `status` (`locked`|`processing`|`paid`|`failed`)

**Response `200`:** Paginated WalletTransaction list.

---

### 5.5 Submissions

**Requires auth.** ADMIN role city-scoped via Campaign.

#### `GET /submissions`

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | |
| `limit` | number | |
| `status` | `pending`\|`approved`\|`rejected`\|`paid` | |
| `stage` | `t0`\|`h24`\|`h72`\|`completed` | |
| `campaignId` | string | |
| `creatorId` | string | |
| `search` | string | Search reel URL / creator name |
| `fraudFlagged` | `true`\|`false` | Only fraud-flagged submissions |

**Response `200`:**

```json
{
  "stats": {
    "pending": 156,
    "approved": 834,
    "rejected": 112,
    "paid": 132
  },
  "data": [
    {
      "id": "uuid",
      "campaignId": "uuid",
      "creatorId": "uuid",
      "reelUrl": "https://instagram.com/reel/CxY123",
      "status": "PENDING",
      "verificationStage": "H24",
      "submittedAt": "2026-03-07T14:00:00.000Z",
      "projectedPayout": 620.0,
      "finalPayout": null,
      "fraudFlags": [],
      "gpsVerified": true,
      "billVerified": true,
      "creator": {
        "id": "uuid",
        "name": "Priya Sharma",
        "instagramHandle": "priya_creates",
        "instagramFollowers": 12400,
        "trustScore": 88
      },
      "reviewedBy": null
    }
  ],
  "total": 1234,
  "page": 1,
  "limit": 20,
  "totalPages": 62,
  "hasNext": true,
  "hasPrev": false
}
```

---

#### `GET /submissions/:id`

**Response `200`:**

```json
{
  "data": {
    "id": "uuid",
    "campaignId": "uuid",
    "creatorId": "uuid",
    "reelUrl": "https://instagram.com/reel/CxY123",
    "reelCode": "CxY123",
    "reelThumbnail": null,
    "captionAtSubmission": "#TryTheMenu at Starbucks!",
    "billNumber": "BL-001234",
    "billImageUrl": "https://...",
    "gpsLatitude": 19.0596,
    "gpsLongitude": 72.8295,
    "gpsAccuracyMeters": 12.5,
    "submittedAt": "2026-03-07T14:00:00.000Z",
    "unlockAt": "2026-03-09T14:00:00.000Z",
    "status": "PENDING",
    "verificationStage": "H24",
    "projectedPayout": 620.0,
    "finalPayout": null,
    "adminNotes": null,
    "gpsVerified": true,
    "billVerified": true,
    "postDeleted": false,
    "captionEdited": false,
    "lowEngagement": false,
    "fraudFlags": [],
    "payoutBase": 500.0,
    "payoutEngagementBonus": 120.0,
    "payoutTrustBonus": 0.0,
    "payoutPenalties": 0.0,
    "reviewedById": null,
    "reviewedAt": null,
    "reviewedBy": null,
    "notes": [],
    "submissionMetrics": [
      {
        "id": "metric-uuid",
        "label": "T0",
        "recordedAt": "2026-03-07T14:00:00.000Z",
        "views": 1200,
        "likes": 85,
        "comments": 12
      },
      {
        "id": "metric-uuid-2",
        "label": "H24",
        "recordedAt": "2026-03-08T14:00:00.000Z",
        "views": 8200,
        "likes": 340,
        "comments": 45
      }
    ]
  }
}
```

---

#### `PATCH /submissions/:id/review`

**Request:**

```json
{ "action": "approve" }
```

or:

```json
{
  "action": "reject",
  "rejectionReason": "Caption was edited after submission"
}
```

> `rejectionReason` is **required** when `action = "reject"`

**Response `200`:** Updated submission object.

**Side effects on approve:**

- Sets `status = "APPROVED"`, `reviewedById`, `reviewedAt`
- Calculates and sets `finalPayout`
- Decrements `Campaign.spotsLeft`
- Credits `Creator.walletBalance`, `lifetimeEarnings`, `reelsDone`
- Creates WalletTransaction (LOCKED → PROCESSING)

**Side effects on reject:**

- Sets `status = "REJECTED"`, `reviewedById`, `reviewedAt`
- Releases `Creator.lockedEarnings`

---

#### `POST /submissions/:id/notes`

**Request:**

```json
{ "note": "Checked Instagram manually — post is live and hashtags correct." }
```

**Response `201`:**

```json
{
  "data": {
    "id": "note-uuid",
    "submissionId": "uuid",
    "adminId": "admin-uuid",
    "adminName": "Super Admin",
    "note": "Checked Instagram manually...",
    "createdAt": "2026-03-08T10:30:00.000Z"
  }
}
```

---

#### `PATCH /submissions/:id/payout-override`

**Request:**

```json
{
  "amount": 750.0,
  "reason": "Manual adjustment for exceptional content"
}
```

**Response `200`:** Updated submission object.

---

#### `PATCH /submissions/:id/stage`

**Request:**

```json
{
  "stage": "h24",
  "metrics": {
    "views": 15000,
    "likes": 450,
    "comments": 32
  }
}
```

**Values:** `stage` → `h24` | `h72` | `completed`
`metrics` is optional — if provided, creates a SubmissionMetric record.

**Response `200`:** Updated submission object.

---

### 5.6 Payouts & Pool

**Requires auth.**

#### `GET /payouts/pool`

**Response `200`:**

```json
{
  "data": {
    "id": "pool-uuid",
    "balance": 850000.0,
    "totalDeposited": 1200000.0,
    "totalDisbursed": 340000.0,
    "totalAllocated": 10000.0,
    "updatedAt": "2026-03-08T09:00:00.000Z"
  }
}
```

---

#### `GET /payouts/pool/transactions`

**Query:** `page`, `limit`, `type` (`DEPOSIT` | `PAYOUT`)

**Response `200`:** Paginated PoolTransaction list.

---

#### `POST /payouts/pool/deposit`

**Request:**

```json
{
  "amount": 500000.0,
  "description": "March 2026 monthly top-up"
}
```

**Response `200`:**

```json
{
  "data": {
    "newBalance": 1350000.0,
    "transaction": {
      "id": "txn-uuid",
      "type": "DEPOSIT",
      "amount": 500000.0,
      "description": "March 2026 monthly top-up",
      "performedById": "admin-uuid",
      "performedByName": "Super Admin",
      "balanceAfter": 1350000.0,
      "relatedTxnId": null,
      "createdAt": "2026-03-08T11:00:00.000Z"
    }
  }
}
```

---

#### `GET /payouts/transactions`

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | |
| `limit` | number | |
| `status` | `locked`\|`processing`\|`paid`\|`failed` | |
| `creatorId` | string | |
| `campaignId` | string | |
| `dateFrom` | ISO datetime | |
| `dateTo` | ISO datetime | |

**Response `200`:** Paginated WalletTransaction list.

---

#### `GET /payouts/queue`

**Response `200`:**

```json
{
  "data": {
    "locked": {
      "count": 45,
      "totalAmount": 34500.00,
      "transactions": [...]
    },
    "processing": {
      "count": 12,
      "totalAmount": 9800.00,
      "transactions": [...]
    },
    "failed": {
      "count": 8,
      "totalAmount": 5200.00,
      "transactions": [...]
    }
  }
}
```

---

#### `POST /payouts/release`

**Option A — specific transactions:**

```json
{
  "transactionIds": ["txn-001", "txn-002"]
}
```

**Option B — bulk release:**

```json
{
  "releaseAll": true,
  "maxAmount": 50000.0
}
```

> Cannot mix both options — use one or the other.

**Response `200`:**

```json
{
  "data": {
    "released": 12,
    "totalAmount": 6800.0,
    "newPoolBalance": 843200.0
  }
}
```

---

#### `POST /payouts/:id/retry`

Retries a `FAILED` transaction (sets status → `PROCESSING`).

**Response `200`:** Updated WalletTransaction.

---

### 5.7 Leaderboard

**Requires auth.**

#### `GET /leaderboard`

**Response `200`:**

```json
{
  "data": [
    {
      "id": "score-uuid",
      "creatorId": "uuid",
      "weeklyEarnings": 4200.0,
      "totalPoints": 8400,
      "rank": 1,
      "creator": {
        "id": "uuid",
        "name": "Priya Sharma",
        "instagramHandle": "priya_creates",
        "city": "Mumbai",
        "profileImage": "https://..."
      }
    }
  ]
}
```

---

#### `GET /leaderboard/config`

**Response `200`:**

```json
{
  "data": {
    "tiers": [
      {
        "name": "Gold",
        "rankMin": 1,
        "rankMax": 10,
        "minWeeklyEarnings": 2000,
        "payoutMultiplier": 1.5,
        "color": "#FFD700"
      },
      {
        "name": "Silver",
        "rankMin": 11,
        "rankMax": 25,
        "minWeeklyEarnings": 1000,
        "payoutMultiplier": 1.2,
        "color": "#C0C0C0"
      }
    ],
    "resetDay": "monday",
    "resetTime": "00:00",
    "timezone": "Asia/Kolkata"
  }
}
```

---

#### `PATCH /leaderboard/config`

**Request (all optional):**

```json
{
  "tiers": [...],
  "resetDay": "monday",
  "resetTime": "00:00",
  "timezone": "Asia/Kolkata"
}
```

**Response `200`:** Updated config.

---

#### `GET /leaderboard/snapshots`

**Query:** `page`, `limit`

**Response `200`:** Paginated LeaderboardArchive records.

---

#### `GET /leaderboard/snapshots/:weekStart`

**Path param:** `weekStart` — ISO date e.g. `2026-03-02`

**Response `200`:** Single snapshot record.

---

#### `POST /leaderboard/snapshot`

Manually trigger snapshot (saves current standings to LeaderboardArchive).

**Response `201`:**

```json
{
  "data": {
    "weekStart": "2026-03-02",
    "creatorCount": 142,
    "snapshot": [...]
  }
}
```

---

### 5.8 Reports

**Requires auth.** ADMIN role city-scoped.

#### `GET /reports/creators?period=30d&city=Mumbai`

**Response `200`:**

```json
{
  "data": {
    "kpis": {
      "totalCreators": 2847,
      "newThisMonth": 248,
      "growthRate": 12.4,
      "activeRate": 73.8,
      "avgTrustScore": 67,
      "kycVerifiedRate": 80.5
    },
    "growthChart": [{ "week": "W1 Jan", "count": 45 }],
    "cityBreakdown": [{ "city": "Mumbai", "count": 520 }],
    "activationFunnel": {
      "registered": 2847,
      "instagramConnected": 2100,
      "kycSubmitted": 1800,
      "kycVerified": 1450,
      "firstSubmission": 980
    }
  }
}
```

---

#### `GET /reports/submissions?period=30d`

**Response `200`:**

```json
{
  "data": {
    "kpis": {
      "total": 4523,
      "approvalRate": 78.2,
      "avgProcessingHours": 4.2,
      "fraudRate": 3.1
    },
    "weeklyChart": [
      { "week": "W1 Jan", "submissions": 120, "approved": 89, "rejected": 31 }
    ]
  }
}
```

---

#### `GET /reports/revenue?period=30d`

**Response `200`:**

```json
{
  "data": {
    "kpis": {
      "totalDisbursed": 1250000.0,
      "avgPayoutPerSubmission": 625.0,
      "poolHealth": 82.4,
      "pendingPayouts": 23400.0
    },
    "dailyPayoutsChart": [{ "date": "2026-03-01", "amount": 12400.0 }],
    "campaignPayouts": [
      {
        "campaignId": "uuid",
        "campaignName": "Starbucks Bandra",
        "totalPaid": 48000.0
      }
    ]
  }
}
```

---

#### `GET /reports/fraud?period=30d`

**Response `200`:**

```json
{
  "data": {
    "kpis": {
      "totalFlagged": 142,
      "autoRejected": 38,
      "fraudRate": 3.1,
      "avgTrustScore": 52
    },
    "trendChart": [{ "week": "W1 Jan", "flagged": 12 }],
    "breakdownByType": [
      { "type": "POST_DELETED", "count": 28 },
      { "type": "GPS_MISMATCH", "count": 18 },
      { "type": "CAPTION_EDITED", "count": 14 }
    ]
  }
}
```

---

#### `GET /reports/kyc`

**Response `200`:**

```json
{
  "data": {
    "pending": 47,
    "verified": 2290,
    "rejected": 198,
    "pieData": [
      { "label": "Verified", "value": 2290, "color": "#22c55e" },
      { "label": "Pending", "value": 47, "color": "#f59e0b" },
      { "label": "Rejected", "value": 198, "color": "#ef4444" }
    ]
  }
}
```

---

### 5.9 Admin Users

> **Requires `SUPERADMIN` role for all endpoints.**

#### `GET /admin-users`

**Query:** `page`, `limit`, `role` (`SUPERADMIN`|`ADMIN`), `isActive` (`true`|`false`), `city`

**Response `200`:** Paginated AdminUser list (no `passwordHash`).

---

#### `POST /admin-users`

**Request:**

```json
{
  "name": "Ops Admin",
  "email": "ops@trythemenu.com",
  "password": "StrongPass@1",
  "role": "ADMIN",
  "department": "Operations",
  "phone": "+919876543210",
  "avatar": "https://...",
  "managedCities": ["Mumbai", "Pune"]
}
```

**Validations:** `name` min 2, `password` min 8, `role` = `SUPERADMIN`|`ADMIN`

**Response `201`:** Created AdminUser (no `passwordHash`).

---

#### `PATCH /admin-users/:id`

Partial update — cannot change `email` or `password` here.

**Request (all optional):**

```json
{
  "name": "Updated Name",
  "role": "ADMIN",
  "department": "Marketing",
  "phone": "+919876543210",
  "managedCities": ["Delhi"]
}
```

**Response `200`:** Updated AdminUser.

---

#### `PATCH /admin-users/:id/password`

**Request:**

```json
{ "newPassword": "NewPass@123" }
```

**Response `200`:** `{ "success": true }`

---

#### `PATCH /admin-users/:id/status`

**Request:**

```json
{ "isActive": false }
```

**Response `200`:** Updated AdminUser.

---

#### `DELETE /admin-users/:id`

Soft-delete (sets `isActive = false`).

**Response `200`:** `{ "success": true }`

---

### 5.10 Platform Settings

> **Requires `SUPERADMIN` role for all settings endpoints.**

#### `GET /settings`

**Response `200`:**

```json
{
  "data": {
    "general": {
      "platformName": "TryTheMenu",
      "supportEmail": "support@trythemenu.com",
      "supportPhone": "+911234567890",
      "timezone": "Asia/Kolkata",
      "currencyFormat": "INR"
    },
    "campaignDefaults": {
      "defaultPayoutMin": 200,
      "defaultPayoutMax": 1000,
      "defaultRequiredViews": 5000,
      "defaultCheckInRadius": 500,
      "defaultDeadlineDays": 30,
      "autoExpireAfterDeadline": true
    },
    "verification": {
      "windowHours": 72,
      "autoApproveThreshold": 90,
      "fraudSensitivity": "medium",
      "postDeletionPenaltyPercent": 50,
      "captionEditPenaltyPercent": 20
    },
    "payout": {
      "minWithdrawalAmount": 100,
      "processingDelayHours": 24,
      "dailyTransactionLimit": 50000,
      "autoRetryFailed": true,
      "maxRetries": 3
    }
  }
}
```

---

#### `PATCH /settings`

**Request (all sections and fields optional):**

```json
{
  "general": { "supportEmail": "help@trythemenu.com" },
  "payout": { "minWithdrawalAmount": 150 }
}
```

**Response `200`:** Updated settings object (same shape as GET).

---

#### `GET /settings/fraud-rules`

**Response `200`:**

```json
{
  "data": [
    {
      "id": "rule-uuid",
      "name": "Post Deleted",
      "description": "Creator deleted the post before 72h window",
      "condition": "POST_DELETED",
      "threshold": null,
      "severity": "CRITICAL",
      "penaltyPercent": 50,
      "isActive": true,
      "timesTriggered": 28,
      "lastTriggeredAt": "2026-03-07T00:00:00.000Z",
      "createdById": "admin-uuid",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### `POST /settings/fraud-rules`

**Request:**

```json
{
  "name": "Sudden View Drop",
  "description": "Views drop >50% between verification stages",
  "condition": "VIEW_DROP",
  "threshold": 50,
  "severity": "WARNING",
  "penaltyPercent": 20,
  "isActive": true
}
```

**Response `201`:** Created FraudRule.

---

#### `PATCH /settings/fraud-rules/:id`

All fields optional. **Response `200`:** Updated FraudRule.

---

#### `DELETE /settings/fraud-rules/:id`

**Response `200`:** `{ "success": true }`

---

#### `GET /settings/badges`

**Response `200`:**

```json
{
  "data": [
    {
      "id": "badge-uuid",
      "name": "Rising Star",
      "description": "Complete your first 5 reels",
      "icon": "⭐",
      "unlockCriteria": "submission_count",
      "thresholdValue": 5,
      "rewardMultiplier": 1.1,
      "trustScoreBonus": 5,
      "isActive": true
    }
  ]
}
```

---

#### `POST /settings/badges`

**Request:**

```json
{
  "name": "Rising Star",
  "description": "Complete your first 5 reels",
  "icon": "⭐",
  "unlockCriteria": "submission_count",
  "thresholdValue": 5,
  "rewardMultiplier": 1.1,
  "trustScoreBonus": 5,
  "isActive": true
}
```

**`unlockCriteria`:** `submission_count` | `earnings_threshold` | `streak` | `rank` | `custom`

**Response `201`:** Created badge.

---

#### `PATCH /settings/badges/:id`

All fields optional. **Response `200`:** Updated badge.

---

#### `GET /settings/locations`

**Response `200`:**

```json
{
  "data": [
    {
      "id": "loc-1",
      "city": "Mumbai",
      "areaName": "Andheri West",
      "latitude": 19.1362,
      "longitude": 72.8296,
      "isActive": true
    }
  ]
}
```

---

#### `POST /settings/locations`

**Request:**

```json
{
  "city": "Delhi",
  "areaName": "Connaught Place",
  "latitude": 28.6327,
  "longitude": 77.2197,
  "isActive": true
}
```

**Response `201`:** Created location.

---

#### `PATCH /settings/locations/:id`

All fields optional. **Response `200`:** Updated location.

---

### 5.11 Audit Log

> **Requires `SUPERADMIN` role.**

#### `GET /audit-log`

**Query Params:**
| Param | Type | Values |
|-------|------|--------|
| `page` | number | |
| `limit` | number | |
| `category` | string | `AUTH` \| `SUBMISSION` \| `CAMPAIGN` \| `CREATOR` \| `PAYOUT` \| `SETTINGS` \| `ADMIN_MGMT` |
| `severity` | string | `INFO` \| `WARNING` \| `CRITICAL` |
| `adminId` | string | |
| `dateFrom` | ISO datetime | |
| `dateTo` | ISO datetime | |
| `search` | string | Search in `action` field |

**Response `200`:**

```json
{
  "data": [
    {
      "id": "log-uuid",
      "timestamp": "2026-03-08T10:00:00.000Z",
      "adminId": "admin-uuid",
      "adminName": "Super Admin",
      "adminRole": "SUPERADMIN",
      "action": "APPROVED_SUBMISSION",
      "category": "SUBMISSION",
      "targetType": "Submission",
      "targetId": "sub-uuid",
      "targetName": null,
      "severity": "INFO",
      "ipAddress": "103.x.x.x",
      "details": { "finalPayout": 620.0 }
    }
  ],
  "total": 5420,
  "page": 1,
  "limit": 20,
  "totalPages": 271,
  "hasNext": true,
  "hasPrev": false
}
```

---

### 5.12 Notifications

**Requires auth.** Returns notifications for the current admin + broadcast notifications (`adminId = null`).

#### `GET /notifications`

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | |
| `limit` | number | |
| `read` | `true`\|`false` | Filter by read status |
| `severity` | `INFO`\|`WARNING`\|`CRITICAL` | |

**Response `200`:**

```json
{
  "unreadCount": 5,
  "data": [
    {
      "id": "notif-uuid",
      "adminId": null,
      "type": "KYC_PENDING",
      "title": "42 KYC submissions pending",
      "message": "You have 42 unreviewed KYC records.",
      "read": false,
      "severity": "WARNING",
      "actionUrl": "/creators?kycStatus=pending",
      "createdAt": "2026-03-08T09:00:00.000Z"
    }
  ],
  "total": 18,
  "page": 1,
  "limit": 20,
  "totalPages": 1,
  "hasNext": false,
  "hasPrev": false
}
```

---

#### `PATCH /notifications/:id/read`

**Response `200`:** `{ "success": true }`

---

#### `PATCH /notifications/read-all`

Marks all notifications as read for the current admin.

**Response `200`:**

```json
{ "success": true, "updated": 5 }
```

> **Route order matters:** `/read-all` is registered before `/:id/read` — client must call exactly `/notifications/read-all`.

---

## 6. Business Rules

### Campaign Status (no `status` field in DB)

| UI State       | DB Condition                                             |
| -------------- | -------------------------------------------------------- |
| Active         | `isActive: true` AND `deadline > now`                    |
| Expired        | `deadline < now`                                         |
| Inactive/Draft | `isActive: false`                                        |
| Paused         | `isActive: false` (same as inactive — no separate state) |

### Submission Approval

- Approve → `APPROVED` + `finalPayout` calculated + `WalletTransaction(LOCKED)` created
- Reject → `REJECTED` (requires `rejectionReason`)
- After approve + payout release → status becomes `PAID`

### Payout Calculation

```
base         = campaign.payoutBase
viewBonus    = views >= requiredViews ? floor((views/1000) * bonusPerThousandViews) : 0
trustBonus   = creator.trustScore >= 80 ? base * 0.10 : 0
penalties    = sum(triggeredFraudRules.penaltyPercent / 100 * base)
raw          = base + viewBonus + trustBonus - penalties
finalPayout  = clamp(raw, payoutMin, payoutMax)
```

### Trust Score

```
kycScore      = VERIFIED→100, SUBMITTED→50, PENDING→0
approvalScore = approvedCount / max(totalCount,1) * 100
integrityScore = 100 - (fraudFlags.length * 10)
trustScore    = (kycScore * 0.30) + (approvalScore * 0.35) + (integrityScore * 0.25) + leaderboardBonus
trustScore    = clamp(trustScore, 0, 100)
```

---

## 7. Enum Reference

| Enum                    | Values                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `AdminRole`             | `SUPERADMIN`, `ADMIN`                                                                                                      |
| `SubmissionStatus`      | `PENDING`, `APPROVED`, `REJECTED`, `PAID`                                                                                  |
| `VerificationStage`     | `T0`, `H24`, `H72`, `COMPLETED`                                                                                            |
| `KycStatus (Creator)`   | `PENDING`, `SUBMITTED`, `VERIFIED`                                                                                         |
| `KycStatus (KycRecord)` | `PENDING`, `VERIFIED`, `REJECTED`                                                                                          |
| `Difficulty`            | `EASY`, `MEDIUM`, `HARD`                                                                                                   |
| `WalletTxStatus`        | `LOCKED`, `PROCESSING`, `PAID`, `FAILED`                                                                                   |
| `PoolTxnType`           | `DEPOSIT`, `PAYOUT`                                                                                                        |
| `FraudCondition`        | `POST_DELETED`, `CAPTION_EDITED`, `VIEW_DROP`, `DUPLICATE_BILL`, `GPS_MISMATCH`, `LOW_ENGAGEMENT`, `NEW_ACCOUNT`, `CUSTOM` |
| `FraudSeverity`         | `WARNING`, `CRITICAL`, `AUTO_REJECT`                                                                                       |
| `AuditCategory`         | `AUTH`, `SUBMISSION`, `CAMPAIGN`, `CREATOR`, `PAYOUT`, `SETTINGS`, `ADMIN_MGMT`                                            |
| `AuditSeverity`         | `INFO`, `WARNING`, `CRITICAL`                                                                                              |
| `NotificationType`      | `SUBMISSION_NEW`, `PAYOUT_FAILED`, `KYC_PENDING`, `CAMPAIGN_EXPIRING`, `FRAUD_FLAG`, `SYSTEM`                              |
| `NotificationSeverity`  | `INFO`, `WARNING`, `CRITICAL`                                                                                              |

---

## 8. Pagination Convention

All list endpoints return:

```json
{
  "data": [...],
  "total": 234,
  "page": 1,
  "limit": 20,
  "totalPages": 12,
  "hasNext": true,
  "hasPrev": false
}
```

Some endpoints also include a `stats` or `summary` object alongside the pagination fields.

**Default values:** `page=1`, `limit=20`, `sortOrder=desc`

---

## 9. Error Format

```json
{
  "error": "error_code",
  "message": "Human-readable description"
}
```

| HTTP Code | Meaning                                |
| --------- | -------------------------------------- |
| `200`     | Success                                |
| `201`     | Created                                |
| `400`     | Validation error                       |
| `401`     | Missing/invalid/expired token          |
| `403`     | Insufficient role / city access denied |
| `404`     | Resource not found                     |
| `500`     | Server error                           |

| Error Code                  | Meaning                         |
| --------------------------- | ------------------------------- |
| `invalid_credentials`       | Wrong email/password            |
| `invalid_token`             | JWT invalid or expired          |
| `account_inactive`          | Admin account deactivated       |
| `not_found`                 | Resource not found              |
| `CITY_ACCESS_DENIED`        | Admin doesn't manage this city  |
| `POOL_INSUFFICIENT_BALANCE` | Pool balance too low to release |

---

_Generated from actual backend implementation — Version 2.0 — March 2026_
