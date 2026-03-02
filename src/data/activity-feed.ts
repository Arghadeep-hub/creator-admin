import type { ActivityFeedEntry } from '@/types';

export const MOCK_ACTIVITY_FEED: ActivityFeedEntry[] = [
  {
    id: 'act-001', actorName: 'Vikram Singh', actorAvatar: '',
    action: 'approved submission', target: 'sub-028 (Bombay Bistro)',
    targetUrl: 'submissions/sub-028', timestamp: '2026-03-02T09:10:00Z',
  },
  {
    id: 'act-002', actorName: 'Priya Sharma', actorAvatar: '',
    action: 'submitted reel for', target: 'Volt Fitness Studio',
    targetUrl: 'submissions/sub-059', timestamp: '2026-03-02T08:55:00Z',
  },
  {
    id: 'act-003', actorName: 'Sneha Patil', actorAvatar: '',
    action: 'verified KYC for', target: 'Aisha Khan',
    targetUrl: 'creators/creator-003', timestamp: '2026-03-02T08:45:00Z',
  },
  {
    id: 'act-004', actorName: 'Ravi Kumar', actorAvatar: '',
    action: 'submitted reel for', target: 'GlowSkin Clinic',
    targetUrl: 'submissions/sub-060', timestamp: '2026-03-02T08:30:00Z',
  },
  {
    id: 'act-005', actorName: 'Rahul Mehta', actorAvatar: '',
    action: 'released payout of ₹3,580 for', target: 'Neha Reddy',
    targetUrl: 'creators/creator-007', timestamp: '2026-03-02T08:00:00Z',
  },
  {
    id: 'act-006', actorName: 'Ananya Iyer', actorAvatar: '',
    action: 'paused campaign', target: 'Neon Nails Studio',
    targetUrl: 'campaigns/camp-008', timestamp: '2026-03-01T22:30:00Z',
  },
  {
    id: 'act-007', actorName: 'Arjun Patel', actorAvatar: '',
    action: 'completed onboarding', target: 'Creator Profile',
    targetUrl: 'creators/creator-009', timestamp: '2026-03-01T21:15:00Z',
  },
  {
    id: 'act-008', actorName: 'Vikram Singh', actorAvatar: '',
    action: 'rejected submission', target: 'sub-041 (GPS mismatch)',
    targetUrl: 'submissions/sub-041', timestamp: '2026-03-01T20:00:00Z',
  },
  {
    id: 'act-009', actorName: 'Meera Joshi', actorAvatar: '',
    action: 'submitted reel for', target: 'Masala Mania Delhi',
    targetUrl: 'submissions/sub-055', timestamp: '2026-03-01T19:45:00Z',
  },
  {
    id: 'act-010', actorName: 'Sneha Patil', actorAvatar: '',
    action: 'approved submission', target: 'sub-031 (GlowSkin Clinic)',
    targetUrl: 'submissions/sub-031', timestamp: '2026-03-01T18:30:00Z',
  },
  {
    id: 'act-011', actorName: 'Rahul Mehta', actorAvatar: '',
    action: 'created campaign', target: 'Spice Garden Kolkata',
    targetUrl: 'campaigns/camp-014', timestamp: '2026-03-01T17:00:00Z',
  },
  {
    id: 'act-012', actorName: 'Kavya Nair', actorAvatar: '',
    action: 'unlocked earnings for', target: 'Volt Fitness Studio submission',
    targetUrl: 'submissions/sub-012', timestamp: '2026-03-01T15:30:00Z',
  },
  {
    id: 'act-013', actorName: 'Vikram Singh', actorAvatar: '',
    action: 'approved submission', target: 'sub-033 (Masala Mania)',
    targetUrl: 'submissions/sub-033', timestamp: '2026-03-01T14:00:00Z',
  },
  {
    id: 'act-014', actorName: 'Siddharth Das', actorAvatar: '',
    action: 'submitted reel for', target: 'Chai Point Express',
    targetUrl: 'submissions/sub-050', timestamp: '2026-03-01T12:30:00Z',
  },
  {
    id: 'act-015', actorName: 'Ananya Iyer', actorAvatar: '',
    action: 'released payout of ₹2,140 for', target: 'Rohit Gupta',
    targetUrl: 'creators/creator-002', timestamp: '2026-03-01T11:00:00Z',
  },
  {
    id: 'act-016', actorName: 'Ananya Menon', actorAvatar: '',
    action: 'connected Instagram account', target: '@ananya.foodie',
    targetUrl: 'creators/creator-010', timestamp: '2026-03-01T10:00:00Z',
  },
  {
    id: 'act-017', actorName: 'Sneha Patil', actorAvatar: '',
    action: 'rejected KYC for', target: 'Karan Malhotra (document mismatch)',
    targetUrl: 'creators/creator-013', timestamp: '2026-03-01T09:30:00Z',
  },
  {
    id: 'act-018', actorName: 'Vikash Yadav', actorAvatar: '',
    action: 'submitted reel for', target: 'Bombay Bistro',
    targetUrl: 'submissions/sub-048', timestamp: '2026-02-28T22:00:00Z',
  },
  {
    id: 'act-019', actorName: 'Rahul Mehta', actorAvatar: '',
    action: 'updated leaderboard tiers for', target: 'Week Mar 2',
    targetUrl: 'leaderboard', timestamp: '2026-02-28T18:30:00Z',
  },
  {
    id: 'act-020', actorName: 'Pooja Deshmukh', actorAvatar: '',
    action: 'completed onboarding', target: 'Creator Profile',
    targetUrl: 'creators/creator-012', timestamp: '2026-02-28T17:00:00Z',
  },
  {
    id: 'act-021', actorName: 'Vikram Singh', actorAvatar: '',
    action: 'approved submission', target: 'sub-025 (Chai Point Express)',
    targetUrl: 'submissions/sub-025', timestamp: '2026-02-28T15:30:00Z',
  },
  {
    id: 'act-022', actorName: 'Ananya Iyer', actorAvatar: '',
    action: 'increased spots for', target: 'Volt Fitness Studio (50 → 80)',
    targetUrl: 'campaigns/camp-003', timestamp: '2026-02-28T14:00:00Z',
  },
  {
    id: 'act-023', actorName: 'Deepak Verma', actorAvatar: '',
    action: 'submitted reel for', target: 'FitZone Gym',
    targetUrl: 'submissions/sub-046', timestamp: '2026-02-28T12:30:00Z',
  },
  {
    id: 'act-024', actorName: 'Sneha Patil', actorAvatar: '',
    action: 'verified KYC for', target: 'Arjun Patel',
    targetUrl: 'creators/creator-009', timestamp: '2026-02-28T11:00:00Z',
  },
  {
    id: 'act-025', actorName: 'Priya Sharma', actorAvatar: '',
    action: 'earned badge', target: '₹10k Weekly Sprint',
    targetUrl: 'creators/creator-001', timestamp: '2026-02-28T09:00:00Z',
  },
  {
    id: 'act-026', actorName: 'Vikram Singh', actorAvatar: '',
    action: 'released bulk payouts for', target: '8 creators (₹18,640 total)',
    targetUrl: 'payouts', timestamp: '2026-02-27T17:00:00Z',
  },
  {
    id: 'act-027', actorName: 'Shruti Iyer', actorAvatar: '',
    action: 'submitted reel for', target: 'The Yoga House',
    targetUrl: 'submissions/sub-044', timestamp: '2026-02-27T15:30:00Z',
  },
  {
    id: 'act-028', actorName: 'Rahul Mehta', actorAvatar: '',
    action: 'archived expired campaign', target: 'Beach Bites 2025',
    targetUrl: 'campaigns/camp-010', timestamp: '2026-02-27T12:00:00Z',
  },
  {
    id: 'act-029', actorName: 'Sneha Patil', actorAvatar: '',
    action: 'approved submission', target: 'sub-019 (FitZone Gym)',
    targetUrl: 'submissions/sub-019', timestamp: '2026-02-27T10:30:00Z',
  },
  {
    id: 'act-030', actorName: 'Ananya Iyer', actorAvatar: '',
    action: 'published campaign', target: 'Volt Fitness Studio',
    targetUrl: 'campaigns/camp-003', timestamp: '2026-02-26T16:00:00Z',
  },
];
