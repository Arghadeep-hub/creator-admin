import type { MilestoneBadge } from '@/types';

export const MOCK_BADGES: MilestoneBadge[] = [
  {
    id: 'badge-001',
    label: 'First Approved Reel',
    description: 'First submission approved by admin',
    icon: 'Star',
    unlockCriteria: 'submission_count',
    thresholdValue: 1,
    rewardMultiplier: 1.0,
    trustScoreBonus: 2,
    isActive: true,

    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'badge-002',
    label: '₹10k Weekly Sprint',
    description: 'Earn ₹10,000+ in a single week',
    icon: 'Zap',
    unlockCriteria: 'earnings_threshold',
    thresholdValue: 10000,
    rewardMultiplier: 1.05,
    trustScoreBonus: 5,
    isActive: true,

    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'badge-003',
    label: 'Clean Integrity Streak',
    description: '5 consecutive submissions with zero fraud flags',
    icon: 'Shield',
    unlockCriteria: 'streak',
    thresholdValue: 5,
    rewardMultiplier: 1.03,
    trustScoreBonus: 8,
    isActive: true,

    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'badge-004',
    label: 'Leaderboard Top 10',
    description: 'Reach top 10 on the weekly leaderboard',
    icon: 'Trophy',
    unlockCriteria: 'rank',
    thresholdValue: 10,
    rewardMultiplier: 1.08,
    trustScoreBonus: 10,
    isActive: true,

    createdAt: '2024-02-01T10:00:00Z',
  },
];
