# TryTheMenu — Admin Panel API Documentation

**Base URL:** `http://localhost:3000/api/admin`
**Content-Type:** `application/json`
**Auth:** All endpoints (except `/auth/login` and `/auth/refresh`) require:
```
Authorization: Bearer <accessToken>
```

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Admin Users](#2-admin-users)
3. [Dashboard](#3-dashboard)
4. [Campaigns](#4-campaigns)
5. [Creators](#5-creators)
6. [Submissions](#6-submissions)
7. [Payouts & Pool](#7-payouts--pool)
8. [Leaderboard](#8-leaderboard)
9. [Reports](#9-reports)
10. [Platform Settings](#10-platform-settings)
11. [Audit Log](#11-audit-log)
12. [Notifications](#12-notifications)

---

## Common Patterns

### Paginated Response
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": false
}
```

### Error Response
```json
{
  "error": "error_code",
  "message": "Human-readable message"
}
```

### Common Status Codes
| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error |
| `401` | Unauthenticated |
| `403` | Forbidden (wrong role) |
| `404` | Not found |
| `500` | Server error |

---

## 1. Authentication

### POST `/auth/login`
Login with email and password.

**Public — No auth required**

**Request Body:**
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

**Roles:** `SUPERADMIN`, `ADMIN`
**Token TTL:** Access token = 8 hours, Refresh token = 7 days

---

### POST `/auth/logout`
Blacklist the current access token.

**Request Body:** _(empty)_

**Response `200`:**
```json
{ "success": true }
```

---

### GET `/auth/me`
Get the currently logged-in admin's profile.

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

### POST `/auth/refresh`
Issue a new access token using a valid refresh token.

**Public — No auth required**

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 28800
}
```

---

## 2. Admin Users

> **Requires role:** `SUPERADMIN` for all endpoints

### GET `/admin-users`
List all admin users.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max 100) |
| `role` | `SUPERADMIN` \| `ADMIN` | — | Filter by role |
| `isActive` | `true` \| `false` | — | Filter by active status |
| `city` | string | — | Filter by managed city |

**Response `200`:** Paginated list of admin users (no `passwordHash`).

---

### POST `/admin-users`
Create a new admin user.

**Request Body:**
```json
{
  "name": "Ops Admin",
  "email": "ops@trythemenu.com",
  "password": "StrongPass@1",
  "role": "ADMIN",
  "department": "Operations",
  "phone": "+919876543210",
  "avatar": "https://example.com/avatar.jpg",
  "managedCities": ["Mumbai", "Pune"]
}
```

**Validations:**
- `name` min 2 chars
- `email` valid email
- `password` min 8 chars
- `role` one of `SUPERADMIN`, `ADMIN`

**Response `201`:** Created admin user object.

---

### PATCH `/admin-users/:id`
Update an admin user (cannot change email or password here).

**Request Body (all optional):**
```json
{
  "name": "Updated Name",
  "role": "ADMIN",
  "department": "Marketing",
  "phone": "+919876543210",
  "avatar": "https://...",
  "managedCities": ["Delhi"]
}
```

**Response `200`:** Updated admin user.

---

### PATCH `/admin-users/:id/password`
Reset an admin user's password.

**Request Body:**
```json
{
  "newPassword": "NewPass@123"
}
```

**Response `200`:** `{ "success": true }`

---

### PATCH `/admin-users/:id/status`
Activate or deactivate an admin user.

**Request Body:**
```json
{
  "isActive": false
}
```

**Response `200`:** Updated admin user.

---

### DELETE `/admin-users/:id`
Soft-delete (deactivate) an admin user.

**Response `200`:** `{ "success": true }`

---

## 3. Dashboard

> **Requires role:** `ADMIN` or `SUPERADMIN`
> City-scoped: `ADMIN` role only sees data for their `managedCities`.

### GET `/dashboard/stats`
Top-level KPI cards.

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| `period` | `7d` \| `30d` \| `90d` | `30d` |

**Response `200`:**
```json
{
  "data": {
    "totalCreators": 1240,
    "creatorsGrowthPercent": 12.5,
    "newCreatorsThisMonth": 138,
    "activeCampaigns": 34,
    "campaignsEndingThisWeek": 5,
    "pendingSubmissions": 87,
    "submissionsNeedReviewToday": 23,
    "submissionsGrowthPercent": 8.3,
    "totalPayoutsThisMonth": 284500.00,
    "pendingPayouts": 42300.00,
    "payoutsGrowthPercent": -2.1,
    "approvalRate": 78.4,
    "lastMonthApprovalRate": 75.2
  }
}
```

---

### GET `/dashboard/creator-growth`
Weekly creator signup trend.

**Query Params:** `period` (same as above)

**Response `200`:**
```json
{
  "data": [
    { "week": "W1 Jan", "creators": 45 },
    { "week": "W2 Jan", "creators": 52 }
  ]
}
```

---

### GET `/dashboard/submission-volume`
Weekly submission trend with approval breakdown.

**Query Params:** `period`

**Response `200`:**
```json
{
  "data": [
    { "week": "W1 Jan", "submissions": 120, "approved": 89, "rejected": 31 }
  ]
}
```

---

### GET `/dashboard/top-campaigns`
Best performing campaigns.

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| `limit` | number | `5` |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Summer Burger Fest",
      "successRate": 84.5,
      "totalSubmissions": 200,
      "totalPaidOut": 48000.00
    }
  ]
}
```

---

### GET `/dashboard/activation-funnel`
Creator activation funnel steps.

**Response `200`:**
```json
{
  "data": {
    "registered": 1240,
    "instagramConnected": 1100,
    "kycSubmitted": 870,
    "kycVerified": 720,
    "firstSubmission": 540
  }
}
```

---

### GET `/dashboard/activity-feed`
Recent platform activity (submissions, approvals, creator joins).

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| `limit` | number | `20` |

**Response `200`:**
```json
{
  "data": [
    {
      "type": "submission",
      "creatorName": "Rahul Sharma",
      "campaignName": "Burger Fest",
      "status": "PENDING",
      "timestamp": "2026-03-08T09:45:00.000Z"
    }
  ]
}
```

---

### GET `/dashboard/operational-health`
Platform health snapshot.

**Response `200`:**
```json
{
  "data": {
    "poolBalance": 850000.00,
    "failedPayoutsLast24h": 3,
    "pendingKycCount": 42,
    "fraudFlaggedToday": 7,
    "avgSubmissionReviewHours": 4.2
  }
}
```

---

## 4. Campaigns

> **Requires role:** `ADMIN` or `SUPERADMIN`

### GET `/campaigns`
Paginated list of campaigns.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | |
| `limit` | number | `20` | |
| `isActive` | `true` \| `false` | — | Filter active/inactive |
| `category` | string | — | e.g. `Restaurant` |
| `city` | string | — | Filter by city |
| `search` | string | — | Search by name |
| `sortBy` | `createdAt` \| `deadline` \| `successRate` \| `totalSpots` | `createdAt` | |
| `sortOrder` | `asc` \| `desc` | `desc` | |

**Response `200`:** Paginated campaigns with stats header:
```json
{
  "stats": { "total": 80, "active": 34, "inactive": 46 },
  "data": [...],
  "total": 80,
  "page": 1,
  "limit": 20
}
```

---

### GET `/campaigns/:id`
Full campaign details.

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "restaurantName": "Burger Shack",
    "restaurantLogo": "https://...",
    "city": "Mumbai",
    "cuisine": "Restaurant",
    "address": "42, MG Road",
    "latitude": 19.076,
    "longitude": 72.877,
    "description": "...",
    "payoutMin": 300.00,
    "payoutMax": 800.00,
    "payoutBase": 500.00,
    "bonusPerThousandViews": 50.00,
    "requiredViews": 5000,
    "requiredHashtags": ["#BurgerShack", "#TTM"],
    "rules": ["Visit during lunch hours"],
    "difficulty": "MEDIUM",
    "totalSpots": 100,
    "spotsLeft": 62,
    "successRate": 78.00,
    "deadline": "2026-04-01T00:00:00.000Z",
    "estimatedVisitTimeMins": 60,
    "checkInRadiusMeters": 500,
    "isActive": true,
    "createdAt": "2026-03-01T00:00:00.000Z"
  }
}
```

---

### POST `/campaigns`
Create a new campaign.

**Request Body:**
```json
{
  "businessName": "Burger Shack",
  "businessLogo": "https://...",
  "category": "Restaurant",
  "name": "Summer Burger Fest",
  "city": "Mumbai",
  "address": "42, MG Road, Andheri",
  "latitude": 19.076,
  "longitude": 72.877,
  "description": "Visit us and create a reel!",
  "payoutBase": 500,
  "payoutMin": 300,
  "payoutMax": 800,
  "requiredViews": 5000,
  "bonusPerThousandViews": 50,
  "requiredHashtags": ["#BurgerShack"],
  "rules": ["Must visit during open hours"],
  "difficulty": "Medium",
  "totalSpots": 100,
  "deadline": "2026-04-01T00:00:00.000Z",
  "estimatedVisitTimeMins": 60,
  "checkInRadiusMeters": 500,
  "isActive": false
}
```

**Validations:**
- `category`: `Restaurant` | `Fitness` | `Beauty` | `Fashion` | `Travel` | `Education` | `Other`
- `difficulty`: `Easy` | `Medium` | `Hard`
- `deadline`: ISO 8601 datetime string
- `payoutBase`, `payoutMax` must be positive; `payoutMin` non-negative

**Response `201`:** Created campaign object.

---

### PATCH `/campaigns/:id`
Partially update a campaign. All fields optional.

**Request Body:** Any subset of the POST body fields.

**Response `200`:** Updated campaign.

---

### DELETE `/campaigns/:id`
Soft-delete a campaign (sets `isActive = false`).

**Response `200`:** `{ "success": true }`

---

### PATCH `/campaigns/:id/status`
Toggle campaign active status.

**Request Body:**
```json
{ "isActive": true }
```

**Response `200`:** Updated campaign.

---

### GET `/campaigns/:id/submissions`
Paginated submissions for a specific campaign.

**Query Params:**
| Param | Type | Values |
|-------|------|--------|
| `page` | number | |
| `limit` | number | |
| `status` | string | `PENDING` \| `APPROVED` \| `REJECTED` \| `PAID` |
| `stage` | string | `T0` \| `H24` \| `H72` \| `COMPLETED` |

**Response `200`:** Paginated submission list.

---

### GET `/campaigns/:id/analytics`
Aggregated analytics for a campaign.

**Response `200`:**
```json
{
  "data": {
    "totalSubmissions": 120,
    "approved": 89,
    "rejected": 22,
    "pending": 9,
    "totalPaidOut": 42000.00,
    "avgPayout": 472.00,
    "successRate": 80.18,
    "submissionTimeline": [
      { "date": "2026-03-01", "count": 12 }
    ],
    "topCreators": [
      { "creatorId": "uuid", "name": "Rahul", "submissions": 5 }
    ]
  }
}
```

---

## 5. Creators

> **Requires role:** `ADMIN` or `SUPERADMIN`
> City-scoped automatically.

### GET `/creators`
Paginated creator list.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | |
| `limit` | number | `20` | |
| `search` | string | — | Search name / email / Instagram handle |
| `kycStatus` | string | — | `pending` \| `verified` \| `rejected` |
| `accountStatus` | string | — | `active` \| `inactive` \| `flagged` |
| `city` | string | — | Filter by city |
| `sortBy` | string | `joinedAt` | `joinedAt` \| `trustScore` \| `earnings` \| `submissions` |

**Response `200`:**
```json
{
  "stats": { "total": 1240, "active": 980, "kycPending": 120, "flagged": 15 },
  "data": [...],
  "total": 1240,
  "page": 1,
  "limit": 20
}
```

---

### GET `/creators/:id`
Full creator profile.

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+919876543210",
    "city": "Mumbai",
    "instagramHandle": "rahul_creates",
    "instagramFollowers": 12400,
    "instagramConnected": true,
    "kycStatus": "VERIFIED",
    "trustScore": 88,
    "walletBalance": 2400.00,
    "lockedEarnings": 500.00,
    "lifetimeEarnings": 18600.00,
    "reelsDone": 23,
    "joinedAt": "2026-01-15T00:00:00.000Z"
  }
}
```

---

### PATCH `/creators/:id`
Update a creator's account status or assigned admin.

**Request Body (all optional, strict — no extra keys):**
```json
{
  "accountStatus": "active",
  "flagReason": null,
  "assignedAdmin": "admin-user-id"
}
```

**Response `200`:** Updated creator.

---

### PATCH `/creators/:id/kyc`
Update a creator's KYC status.

**Request Body:**
```json
{
  "kycStatus": "verified",
  "reason": "Documents verified successfully"
}
```

**Values:** `kycStatus` → `pending` | `verified` | `rejected`

**Response `200`:** Updated creator.

**Side Effects:** Updates both `KycRecord` and `Creator.kycStatus`.

---

### PATCH `/creators/:id/flag`
Flag or unflag a creator.

**Request Body:**
```json
{
  "accountStatus": "flagged",
  "flagReason": "Suspected fake engagement"
}
```

**Values:** `accountStatus` → `active` | `flagged`

**Response `200`:** `{ "success": true }`

---

### GET `/creators/:id/submissions`
Paginated submissions by this creator.

**Query Params:**
| Param | Type |
|-------|------|
| `page` | number |
| `limit` | number |
| `status` | `pending` \| `approved` \| `rejected` \| `paid` |

**Response `200`:** Paginated submission list.

---

### GET `/creators/:id/transactions`
Paginated wallet transactions for this creator.

**Query Params:**
| Param | Type |
|-------|------|
| `page` | number |
| `limit` | number |
| `status` | `locked` \| `processing` \| `paid` \| `failed` |

**Response `200`:** Paginated transaction list.

---

## 6. Submissions

> **Requires role:** `ADMIN` or `SUPERADMIN`

### GET `/submissions`
Paginated list of all submissions.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | |
| `limit` | number | |
| `status` | string | `pending` \| `approved` \| `rejected` \| `paid` |
| `stage` | string | `t0` \| `h24` \| `h72` \| `completed` |
| `campaignId` | string | Filter by campaign |
| `creatorId` | string | Filter by creator |
| `search` | string | Search by reel URL or creator name |
| `fraudFlagged` | boolean | `true` to show only fraud-flagged |

**Response `200`:**
```json
{
  "stats": { "pending": 87, "approved": 540, "rejected": 120, "paid": 380 },
  "data": [...],
  "total": 1127
}
```

---

### GET `/submissions/:id`
Full submission detail.

**Response `200`:**
```json
{
  "data": {
    "id": "uuid",
    "creatorId": "uuid",
    "campaignId": "uuid",
    "reelUrl": "https://instagram.com/reel/...",
    "reelCode": "CxY123",
    "status": "PENDING",
    "verificationStage": "H24",
    "submittedAt": "2026-03-07T14:00:00.000Z",
    "unlockAt": "2026-03-08T14:00:00.000Z",
    "projectedPayout": 620.00,
    "finalPayout": null,
    "payoutBase": 500.00,
    "payoutEngagementBonus": 120.00,
    "payoutTrustBonus": 0.00,
    "payoutPenalties": 0.00,
    "fraudFlags": [],
    "gpsVerified": true,
    "billVerified": true,
    "postDeleted": false,
    "captionEdited": false,
    "reviewedById": null,
    "reviewedAt": null,
    "notes": [],
    "submissionMetrics": [
      { "label": "H24", "views": 8200, "likes": 340, "comments": 22 }
    ]
  }
}
```

---

### PATCH `/submissions/:id/review`
Approve or reject a submission.

**Request Body:**
```json
{
  "action": "approve"
}
```
or
```json
{
  "action": "reject",
  "rejectionReason": "Post deleted before 72h window"
}
```

> `rejectionReason` is **required** when `action` is `"reject"`.

**Response `200`:** Updated submission.

**Side Effects (on approve):**
- Calculates final payout
- Credits creator's wallet
- Decrements `campaign.spotsLeft`
- Logs audit

**Side Effects (on reject):**
- Releases locked earnings back to creator
- Logs audit

---

### POST `/submissions/:id/notes`
Add an internal admin note to a submission.

**Request Body:**
```json
{
  "note": "Checked reel metrics manually — seems organic."
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "note-id",
    "submissionId": "uuid",
    "adminId": "admin-id",
    "adminName": "Super Admin",
    "note": "Checked reel metrics manually...",
    "createdAt": "2026-03-08T10:30:00.000Z"
  }
}
```

---

### PATCH `/submissions/:id/payout-override`
Override the calculated payout amount.

**Request Body:**
```json
{
  "amount": 750.00,
  "reason": "Manual adjustment — viral reel"
}
```

**Response `200`:** Updated submission.

---

### PATCH `/submissions/:id/stage`
Manually advance the verification stage.

**Request Body:**
```json
{
  "stage": "h72",
  "metrics": {
    "views": 24000,
    "likes": 980,
    "comments": 140
  }
}
```

**Values:** `stage` → `h24` | `h72` | `completed`
`metrics` is optional — if provided, a new `SubmissionMetric` record is created.

**Response `200`:** Updated submission.

---

## 7. Payouts & Pool

> **Requires role:** `ADMIN` or `SUPERADMIN`

### GET `/payouts/pool`
Get the current pool fund balance.

**Response `200`:**
```json
{
  "data": {
    "id": "pool-id",
    "balance": 850000.00,
    "totalDeposited": 1200000.00,
    "totalDisbursed": 340000.00,
    "totalAllocated": 10000.00,
    "updatedAt": "2026-03-08T09:00:00.000Z"
  }
}
```

---

### GET `/payouts/pool/transactions`
Paginated pool fund ledger.

**Query Params:**
| Param | Type |
|-------|------|
| `page` | number |
| `limit` | number |
| `type` | `DEPOSIT` \| `PAYOUT` |

**Response `200`:** Paginated pool transaction list.

---

### POST `/payouts/pool/deposit`
Deposit funds into the pool.

**Request Body:**
```json
{
  "amount": 500000.00,
  "description": "March 2026 top-up"
}
```

**Response `200`:**
```json
{
  "data": {
    "newBalance": 1350000.00,
    "transaction": { "id": "...", "type": "DEPOSIT", "amount": 500000.00, ... }
  }
}
```

---

### GET `/payouts/transactions`
Paginated list of all creator payout transactions.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | |
| `limit` | number | |
| `status` | string | `locked` \| `processing` \| `paid` \| `failed` |
| `creatorId` | string | |
| `campaignId` | string | |
| `dateFrom` | ISO datetime | |
| `dateTo` | ISO datetime | |

**Response `200`:** Paginated wallet transactions.

---

### GET `/payouts/queue`
Get payout queue grouped by status.

**Response `200`:**
```json
{
  "data": {
    "locked": {
      "count": 34,
      "totalAmount": 18200.00,
      "transactions": [...]
    },
    "processing": {
      "count": 8,
      "totalAmount": 4100.00,
      "transactions": [...]
    },
    "failed": {
      "count": 3,
      "totalAmount": 1500.00,
      "transactions": [...]
    }
  }
}
```

---

### POST `/payouts/release`
Release locked payouts for processing.

**Option A — Release specific transactions:**
```json
{
  "transactionIds": ["txn-id-1", "txn-id-2"]
}
```

**Option B — Release all (with optional cap):**
```json
{
  "releaseAll": true,
  "maxAmount": 100000.00
}
```

**Response `200`:**
```json
{
  "data": {
    "released": 12,
    "totalAmount": 6800.00,
    "newPoolBalance": 843200.00
  }
}
```

---

### POST `/payouts/:id/retry`
Retry a failed payout transaction.

**Response `200`:** Updated transaction (status → `processing`).

---

## 8. Leaderboard

> **Requires role:** `ADMIN` or `SUPERADMIN`

### GET `/leaderboard`
Current live leaderboard.

**Response `200`:**
```json
{
  "data": [
    {
      "rank": 1,
      "creatorId": "uuid",
      "creatorName": "Priya Singh",
      "instagramHandle": "priya_creates",
      "city": "Mumbai",
      "weeklyEarnings": 4200.00,
      "totalPoints": 8400
    }
  ]
}
```

---

### GET `/leaderboard/config`
Get leaderboard configuration.

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
      }
    ],
    "resetDay": "monday",
    "resetTime": "00:00",
    "timezone": "Asia/Kolkata"
  }
}
```

---

### PATCH `/leaderboard/config`
Update leaderboard configuration.

**Request Body (all optional):**
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

### GET `/leaderboard/snapshots`
Paginated list of past weekly leaderboard snapshots.

**Query Params:** `page`, `limit`

**Response `200`:** Paginated snapshots list.

---

### GET `/leaderboard/snapshots/:weekStart`
Get a specific week's leaderboard snapshot by week start date.

**Path Param:** `weekStart` — ISO date string e.g. `2026-03-02`

**Response `200`:** Snapshot detail.

---

### POST `/leaderboard/snapshot`
Manually trigger a leaderboard snapshot.

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

## 9. Reports

> **Requires role:** `ADMIN` or `SUPERADMIN`
> All reports are city-scoped for `ADMIN` role.

### GET `/reports/creators`
Creator analytics report.

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| `period` | string | `30d` |
| `city` | string | — |

**Response `200`:**
```json
{
  "data": {
    "kpis": {
      "totalCreators": 1240,
      "newThisMonth": 138,
      "growthRate": 12.5,
      "activeRate": 79.0,
      "avgTrustScore": 72.4,
      "kycVerifiedRate": 58.1
    },
    "growthChart": [
      { "week": "W1 Jan", "count": 45 }
    ],
    "cityBreakdown": [
      { "city": "Mumbai", "count": 520 }
    ],
    "activationFunnel": {
      "registered": 1240,
      "instagramConnected": 1100,
      "kycSubmitted": 870,
      "kycVerified": 720,
      "firstSubmission": 540
    }
  }
}
```

---

### GET `/reports/submissions`
Submission analytics report.

**Query Params:** `period`, `campaignId`, `city`

**Response `200`:**
```json
{
  "data": {
    "kpis": {
      "total": 2840,
      "approvalRate": 78.4,
      "avgProcessingHours": 4.2,
      "fraudRate": 3.1
    },
    "weeklyChart": [
      { "week": "W1 Jan", "submissions": 120, "approved": 89 }
    ]
  }
}
```

---

### GET `/reports/revenue`
Revenue and payout analytics report.

**Query Params:** `period`

**Response `200`:**
```json
{
  "data": {
    "kpis": {
      "totalDisbursed": 1200000.00,
      "avgPayoutPerSubmission": 472.00,
      "poolHealth": 70.8,
      "pendingPayouts": 42300.00
    },
    "dailyPayoutsChart": [
      { "date": "2026-03-01", "amount": 12400.00 }
    ],
    "campaignPayouts": [
      { "campaignId": "uuid", "campaignName": "Burger Fest", "totalPaid": 48000.00 }
    ]
  }
}
```

---

### GET `/reports/fraud`
Fraud detection report.

**Query Params:** `period`

**Response `200`:**
```json
{
  "data": {
    "kpis": {
      "totalFlagged": 88,
      "autoRejected": 34,
      "fraudRate": 3.1,
      "avgTrustScore": 52.0
    },
    "trendChart": [
      { "week": "W1 Jan", "flagged": 12 }
    ],
    "breakdownByType": [
      { "type": "POST_DELETED", "count": 28 },
      { "type": "GPS_MISMATCH", "count": 18 }
    ]
  }
}
```

---

### GET `/reports/kyc`
KYC status report.

**Response `200`:**
```json
{
  "data": {
    "pending": 120,
    "verified": 720,
    "rejected": 30,
    "pieData": [
      { "label": "Verified", "value": 720, "color": "#22c55e" },
      { "label": "Pending", "value": 120, "color": "#f59e0b" },
      { "label": "Rejected", "value": 30, "color": "#ef4444" }
    ]
  }
}
```

---

## 10. Platform Settings

> **Requires role:** `SUPERADMIN` for all settings endpoints

### GET `/settings`
Get all platform settings merged into one object.

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

### PATCH `/settings`
Update one or more settings sections (partial update supported).

**Request Body (all sections optional, fields within each section also optional):**
```json
{
  "general": {
    "supportEmail": "help@trythemenu.com"
  },
  "payout": {
    "minWithdrawalAmount": 150
  }
}
```

**Response `200`:** Updated settings object.

---

### GET `/settings/fraud-rules`
List all fraud detection rules.

**Response `200`:**
```json
{
  "data": [
    {
      "id": "rule-id",
      "name": "Post Deleted",
      "description": "Creator deleted the post before 72h window",
      "condition": "POST_DELETED",
      "threshold": null,
      "severity": "CRITICAL",
      "penaltyPercent": 50,
      "isActive": true,
      "timesTriggered": 28
    }
  ]
}
```

**Condition values:** `POST_DELETED` | `CAPTION_EDITED` | `VIEW_DROP` | `DUPLICATE_BILL` | `GPS_MISMATCH` | `LOW_ENGAGEMENT` | `NEW_ACCOUNT` | `CUSTOM`
**Severity values:** `WARNING` | `CRITICAL` | `AUTO_REJECT`

---

### POST `/settings/fraud-rules`
Create a new fraud rule.

**Request Body:**
```json
{
  "name": "Sudden View Drop",
  "description": "Views drop more than 50% in 24h",
  "condition": "VIEW_DROP",
  "threshold": 50,
  "severity": "WARNING",
  "penaltyPercent": 20,
  "isActive": true
}
```

**Response `201`:** Created rule.

---

### PATCH `/settings/fraud-rules/:id`
Update a fraud rule. All fields optional.

**Response `200`:** Updated rule.

---

### DELETE `/settings/fraud-rules/:id`
Delete a fraud rule.

**Response `200`:** `{ "success": true }`

---

### GET `/settings/badges`
List all creator badges / milestone definitions.

**Response `200`:**
```json
{
  "data": [
    {
      "id": "badge-id",
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

### POST `/settings/badges`
Create a new badge.

**Request Body:**
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

**`unlockCriteria` values:** `submission_count` | `earnings_threshold` | `streak` | `rank` | `custom`

**Response `201`:** Created badge.

---

### PATCH `/settings/badges/:id`
Update a badge. All fields optional.

**Response `200`:** Updated badge.

---

### GET `/settings/locations`
List configured service locations/cities.

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

### POST `/settings/locations`
Add a new location.

**Request Body:**
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

### PATCH `/settings/locations/:id`
Update a location. All fields optional.

**Response `200`:** Updated location.

---

## 11. Audit Log

> **Requires role:** `SUPERADMIN`

### GET `/audit-log`
Paginated audit trail of all admin actions.

**Query Params:**
| Param | Type | Values |
|-------|------|--------|
| `page` | number | |
| `limit` | number | |
| `category` | string | `AUTH` \| `SUBMISSION` \| `CAMPAIGN` \| `CREATOR` \| `PAYOUT` \| `SETTINGS` \| `ADMIN_MGMT` |
| `severity` | string | `INFO` \| `WARNING` \| `CRITICAL` |
| `adminId` | string | Filter by specific admin |
| `dateFrom` | ISO datetime | |
| `dateTo` | ISO datetime | |
| `search` | string | Search in action field |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "log-id",
      "timestamp": "2026-03-08T10:00:00.000Z",
      "adminId": "admin-id",
      "adminName": "Super Admin",
      "adminRole": "SUPERADMIN",
      "action": "APPROVED_SUBMISSION",
      "category": "SUBMISSION",
      "targetType": "Submission",
      "targetId": "uuid",
      "targetName": "SUB-001",
      "severity": "INFO",
      "ipAddress": "103.x.x.x",
      "details": { "finalPayout": 620.00 }
    }
  ],
  "total": 5420
}
```

---

## 12. Notifications

> **Requires role:** `ADMIN` or `SUPERADMIN`
> Returns notifications for the authenticated admin + broadcast notifications (`adminId = null`).

### GET `/notifications`
Paginated list of notifications.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | |
| `limit` | number | |
| `read` | `true` \| `false` | Filter by read status |
| `severity` | string | `INFO` \| `WARNING` \| `CRITICAL` |

**Response `200`:**
```json
{
  "unreadCount": 5,
  "data": [
    {
      "id": "notif-id",
      "type": "KYC_PENDING",
      "title": "42 KYC submissions pending review",
      "message": "You have 42 unreviewed KYC records.",
      "read": false,
      "severity": "WARNING",
      "actionUrl": "/admin/creators?kycStatus=pending",
      "createdAt": "2026-03-08T09:00:00.000Z"
    }
  ],
  "total": 18
}
```

**Notification types:** `SUBMISSION_NEW` | `PAYOUT_FAILED` | `KYC_PENDING` | `CAMPAIGN_EXPIRING` | `FRAUD_FLAG` | `SYSTEM`

---

### PATCH `/notifications/:id/read`
Mark a single notification as read.

**Response `200`:** `{ "success": true }`

---

### PATCH `/notifications/read-all`
Mark all notifications as read for the current admin.

**Response `200`:** `{ "success": true, "updated": 5 }`

---

## Appendix

### Enums Reference

| Enum | Values |
|------|--------|
| `AdminRole` | `SUPERADMIN`, `ADMIN` |
| `SubmissionStatus` | `PENDING`, `APPROVED`, `REJECTED`, `PAID` |
| `VerificationStage` | `T0`, `H24`, `H72`, `COMPLETED` |
| `KycStatus` | `PENDING`, `VERIFIED`, `REJECTED` |
| `FraudCondition` | `POST_DELETED`, `CAPTION_EDITED`, `VIEW_DROP`, `DUPLICATE_BILL`, `GPS_MISMATCH`, `LOW_ENGAGEMENT`, `NEW_ACCOUNT`, `CUSTOM` |
| `FraudSeverity` | `WARNING`, `CRITICAL`, `AUTO_REJECT` |
| `AuditCategory` | `AUTH`, `SUBMISSION`, `CAMPAIGN`, `CREATOR`, `PAYOUT`, `SETTINGS`, `ADMIN_MGMT` |
| `AuditSeverity` | `INFO`, `WARNING`, `CRITICAL` |
| `NotificationType` | `SUBMISSION_NEW`, `PAYOUT_FAILED`, `KYC_PENDING`, `CAMPAIGN_EXPIRING`, `FRAUD_FLAG`, `SYSTEM` |
| `PoolTxnType` | `DEPOSIT`, `PAYOUT` |
| `Difficulty` | `EASY`, `MEDIUM`, `HARD` |

### RBAC Summary

| Endpoint Group | SUPERADMIN | ADMIN |
|----------------|-----------|-------|
| Auth | ✅ | ✅ |
| Dashboard | ✅ | ✅ (city-scoped) |
| Campaigns | ✅ | ✅ (city-scoped) |
| Creators | ✅ | ✅ (city-scoped) |
| Submissions | ✅ | ✅ (city-scoped) |
| Payouts | ✅ | ✅ |
| Leaderboard | ✅ | ✅ |
| Reports | ✅ | ✅ (city-scoped) |
| Settings | ✅ | ❌ |
| Admin Users | ✅ | ❌ |
| Audit Log | ✅ | ❌ |
| Notifications | ✅ | ✅ |
