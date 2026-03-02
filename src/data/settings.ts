import type { PlatformSettings } from '@/types';

export const DEFAULT_SETTINGS: PlatformSettings = {
  general: {
    platformName: 'TryTheMenu',
    supportEmail: 'support@trythemenu.com',
    supportPhone: '+91 1800 123 4567',
    timezone: 'Asia/Kolkata',
    currencyFormat: '₹',
  },
  campaignDefaults: {
    defaultPayoutMin: 500,
    defaultPayoutMax: 3000,
    defaultRequiredViews: 5000,
    defaultCheckInRadius: 200,
    defaultDeadlineDays: 30,
    autoExpireAfterDeadline: true,
  },
  verification: {
    windowHours: 72,
    autoApproveThreshold: 90,
    fraudSensitivity: 'medium',
    postDeletionPenaltyPercent: 100,
    captionEditPenaltyPercent: 50,
  },
  trustScore: {
    kycWeight: 25,
    approvalRateWeight: 35,
    integrityWeight: 25,
    leaderboardWeight: 15,
    premiumCampaignMinScore: 70,
  },
  payout: {
    minWithdrawalAmount: 100,
    processingDelayHours: 4,
    dailyTransactionLimit: 50,
    autoRetryFailed: true,
    maxRetries: 3,
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: false,
    events: {
      submission_new: true,
      payout_processed: true,
      kyc_pending: true,
      campaign_expiring: true,
      fraud_flag: true,
    },
  },
};
