// ─── Admin ──────────────────────────────────────────────
export interface AdminUser {
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

export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  avatar: string;
  loginAt: string;
}

// ─── Campaign (Admin-side) ──────────────────────────────
export interface CampaignAdmin {
  id: string;
  createdBy: string;
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
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  totalPaidOut: number;
  averageEarning: number;
  autoCalculateMetrics: boolean;
  socialProofTemplate?: string;
}

// ─── Creator (Admin-side view) ──────────────────────────
export interface CreatorAdmin {
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
    panNumber: string;
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
  assignedAdmin?: string;
  activationProgress: number;
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

// ─── Submission (Admin-side view) ────────────────────────
export interface SubmissionAdmin {
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
  totalRankEntries: number;
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
  checkInLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    distanceFromCampaign: number;
    withinRadius: boolean;
  };
  captionAtSubmission: string;
  captionCurrent: string;
  hashtagsMatched: string[];
  hashtagsMissing: string[];
  reelImportedAt: string;
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

// ─── Payout/Transaction (Admin-side) ────────────────────
export interface PayoutTransaction {
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
  processedBy?: string;
}

// ─── Audit Log ──────────────────────────────────────────
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminRole: 'super_admin' | 'admin';
  action: string;
  category: 'auth' | 'submission' | 'campaign' | 'creator' | 'payout' | 'settings' | 'admin_mgmt';
  targetType?: string;
  targetId?: string;
  targetName?: string;
  severity: 'info' | 'warning' | 'critical';
  ipAddress: string;
  details?: Record<string, unknown>;
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
export interface AdminNotification {
  id: string;
  type: 'submission_new' | 'payout_failed' | 'kyc_pending' | 'campaign_expiring' | 'fraud_flag' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  severity: 'info' | 'warning' | 'critical';
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
  id: string;
  actorName: string;
  actorAvatar: string;
  action: string;
  target: string;
  targetUrl: string;
  timestamp: string;
}

// ─── Fraud Rule ─────────────────────────────────────────
export interface FraudRule {
  id: string;
  name: string;
  description: string;
  condition: 'post_deleted' | 'caption_edited' | 'view_drop' | 'duplicate_bill' | 'gps_mismatch' | 'low_engagement' | 'new_account' | 'custom';
  threshold?: number;
  severity: 'warning' | 'critical' | 'auto_reject';
  penaltyPercent: number;
  isActive: boolean;
  timesTriggered: number;
  lastTriggeredAt?: string;
  createdBy: string;
  createdAt: string;
}

// ─── Milestone Badge ────────────────────────────────────
export interface MilestoneBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCriteria: 'submission_count' | 'earnings_threshold' | 'streak' | 'rank' | 'custom';
  thresholdValue: number;
  rewardMultiplier?: number;
  trustScoreBonus?: number;
  isActive: boolean;
  totalEarned: number;
  createdAt: string;
}

// ─── Leaderboard ────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  weeklyEarnings: number;
  points: number;
  submissions: number;
  tier: 'gold' | 'silver' | 'bronze';
  badges: string[];
}

export interface LeaderboardConfig {
  tiers: Array<{
    name: string;
    rankRange: { min: number; max: number | null };
    minWeeklyEarnings: number;
    payoutMultiplier: number;
    color: string;
  }>;
  resetDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  resetTime: string;
  timezone: string;
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

// ─── Managed Location ───────────────────────────────────
export interface ManagedLocation {
  id: string;
  city: string;
  areaName: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}
