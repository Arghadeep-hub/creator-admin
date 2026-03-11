// ─── Admin ──────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN';
  avatar: string | null;
  phone: string | null;
  department: string | null;
  managedCities?: string[];
  createdAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
  updatedAt: string;
}

export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin'; // normalized frontend format
  avatar: string;
  loginAt: string;
}

// ─── Campaign (Admin-side) ──────────────────────────────
export interface CampaignAdmin {
  id: string;
  restaurantName: string;
  restaurantLogo: string | null;
  city: string;
  cuisine: string | null;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  payoutBase: number;
  payoutMin: number;
  payoutMax: number;
  requiredViews: number;
  bonusPerThousandViews: number;
  requiredHashtags: string[];
  rules: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  totalSpots: number;
  spotsLeft: number;
  deadline: string;
  isActive: boolean;
  successRate: number;
  averageEarning: number;
  estimatedVisitTimeMins: number;
  checkInRadiusMeters: number;
  createdById: string | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  // Aggregated fields (list response)
  submissionsCount: number;
  joinsCount: number;
}

// ─── Creator (Admin-side view) ──────────────────────────
export interface CreatorAdmin {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  profileImage: string | null;
  instagramId: string;
  instagramHandle: string | null;
  instagramFollowers: number;
  instagramConnected: boolean;
  kycStatus: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  upiId: string | null;
  trustScore: number;
  walletBalance: number;
  lockedEarnings: number;
  lifetimeEarnings: number;
  weeklyEarnings: number;
  reelsDone: number;
  activationProgress: number;
  termsAccepted: boolean;
  joinedAt: string;
  updatedAt: string;
  // Detail-only fields
  kycRecords?: Array<{
    id: string;
    panNumber: string;
    aadhaarLast4: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    adminNotes: string | null;
    submittedAt: string;
    reviewedAt: string | null;
  }>;
  accountStatus?: 'active' | 'inactive' | 'flagged';
  flagReason?: string;
  consecutiveApprovedCount?: number;
  totalReels?: number;
  avgReach?: number;
  avgEngagement?: number;
  lastActiveAt?: string | null;
  assignedAdmin?: string | null;
  totalSubmissions?: number;
  approvedSubmissions?: number;
  rejectedSubmissions?: number;
  instagramMetrics?: {
    avgReach: number;
    avgEngagement: number;
    totalReelsSubmitted: number;
  };
  activationStepsCompleted?: Record<string, boolean>;
  milestoneBadges?: Array<{
    id: string;
    name: string;
    isUnlocked: boolean;
    earnedAt: string | null;
  }>;
}

// ─── Creator Submission Item (used in creator detail submissions tab) ───────
export interface CreatorSubmissionItem {
  id: string;
  campaignId: string;
  restaurantName: string;
  city: string;
  reelUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  verificationStage: 'T0' | 'H24' | 'H72' | 'COMPLETED';
  submittedAt: string;
  projectedPayout: number;
  finalPayout: number | null;
  fraudFlags: string[];
  latestViews: number;
  latestLikes: number;
}

// ─── Submission (Admin-side view) ────────────────────────
export interface SubmissionAdmin {
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  verificationStage: 'T0' | 'H24' | 'H72' | 'COMPLETED';
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
  notes: Array<{
    id: string;
    submissionId: string;
    adminId: string;
    adminName: string;
    note: string;
    createdAt: string;
  }>;
  submissionMetrics: Array<{
    id: string;
    submissionId: string;
    label: 'T0' | 'H24' | 'H72';
    recordedAt: string;
    views: number;
    likes: number;
    comments: number;
  }>;
  // Joined fields
  creator?: {
    id: string;
    name: string;
    instagramHandle: string | null;
    instagramFollowers: number;
    trustScore: number;
  };
  campaign?: {
    id: string;
    restaurantName: string;
  };
}

// ─── Payout/Transaction (Admin-side) ────────────────────
export interface PayoutTransaction {
  id: string;
  creatorId: string;
  submissionId: string | null;
  amount: number;
  type: string;
  status: 'locked' | 'processing' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  // Admin-joined display fields
  creatorName?: string;
  restaurantName?: string;
  upiId?: string;
  unlockAt?: string;
  failureReason?: string;
  processedBy?: string;
}

// ─── Pool / Fund Management ─────────────────────────────
export interface PoolSummary {
  balance: number;
  totalDeposited: number;
  totalDisbursed: number;
  totalAllocated: number;
  updatedAt: string;
}

export interface PoolTransaction {
  id: string;
  type: 'DEPOSIT' | 'PAYOUT';
  amount: number;
  description: string;
  performedById: string;
  performedByName: string;
  balanceAfter: number;
  relatedTxnId: string | null;
  createdAt: string;
}

// ─── Audit Log ──────────────────────────────────────────
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminRole: 'SUPERADMIN' | 'ADMIN';
  action: string;
  category: 'AUTH' | 'SUBMISSION' | 'CAMPAIGN' | 'CREATOR' | 'PAYOUT' | 'SETTINGS' | 'ADMIN_MGMT';
  targetType?: string | null;
  targetId?: string | null;
  targetName?: string | null;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  ipAddress?: string | null;
  details?: Record<string, unknown> | null;
}

// ─── Platform Settings ──────────────────────────────────
export interface PlatformSettings {
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
  payout: {
    minWithdrawalAmount: number;
    processingDelayHours: number;
    dailyTransactionLimit: number;
    autoRetryFailed: boolean;
    maxRetries: number;
  };
  trustScore?: {
    kycWeight: number;
    approvalRateWeight: number;
    integrityWeight: number;
    leaderboardWeight: number;
    premiumCampaignMinScore: number;
  };
  notifications?: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    events: Record<string, boolean>;
  };
}

// ─── Notification ───────────────────────────────────────
export interface AdminNotification {
  id: string;
  adminId: string | null;
  type: 'SUBMISSION_NEW' | 'PAYOUT_FAILED' | 'KYC_PENDING' | 'CAMPAIGN_EXPIRING' | 'FRAUD_FLAG' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  createdAt: string;
}

// ─── Dashboard Stats ────────────────────────────────────
export interface DashboardStats {
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
export interface ActivityFeedEntry {
  type: 'submission' | 'approval';
  submissionId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  timestamp: string;
  creator: {
    id: string;
    name: string;
    instagramHandle: string | null;
  };
  campaign: {
    id: string;
    restaurantName: string;
  };
}

// ─── Fraud Rule ─────────────────────────────────────────
export interface FraudRule {
  id: string;
  name: string;
  description: string;
  condition: 'POST_DELETED' | 'CAPTION_EDITED' | 'VIEW_DROP' | 'DUPLICATE_BILL' | 'GPS_MISMATCH' | 'LOW_ENGAGEMENT' | 'NEW_ACCOUNT' | 'CUSTOM';
  threshold: number | null;
  severity: 'WARNING' | 'CRITICAL' | 'AUTO_REJECT';
  penaltyPercent: number;
  isActive: boolean;
  timesTriggered: number;
  lastTriggeredAt: string | null;
  createdById: string;
  createdAt: string;
}

// ─── Milestone Badge ────────────────────────────────────
export interface MilestoneBadge {
  id: string;
  label: string;
  description: string;
  icon: string | null;
  unlockCriteria: string | null;
  thresholdValue: number | null;
  rewardMultiplier?: number | null;
  trustScoreBonus?: number | null;
  isActive: boolean;
  createdAt: string;
}

// ─── Leaderboard ────────────────────────────────────────
export interface LeaderboardEntry {
  id: string;
  creatorId: string;
  weeklyEarnings: number;
  totalPoints: number;
  rank: number;
  creator: {
    id: string;
    name: string;
    instagramHandle: string | null;
    city: string | null;
    profileImage: string | null;
  };
}

export interface LeaderboardConfig {
  tiers: Array<{
    name: string;
    rankMin: number;
    rankMax: number;
    minWeeklyEarnings: number;
    payoutMultiplier: number;
    color: string;
  }>;
  resetDay: string;
  resetTime: string;
  timezone: string;
}

// ─── Managed Location ───────────────────────────────────
export interface ManagedLocation {
  id: string;
  city: string;
  areaName: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}
