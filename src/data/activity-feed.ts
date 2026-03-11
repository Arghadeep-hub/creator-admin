import type { ActivityFeedEntry } from '@/types';

export const MOCK_ACTIVITY_FEED: ActivityFeedEntry[] = [
  {
    type: 'approval', submissionId: 'sub-028', status: 'APPROVED', timestamp: '2026-03-02T09:10:00Z',
    creator: { id: 'creator-001', name: 'Vikram Singh', instagramHandle: '@vikram.foodie' },
    campaign: { id: 'camp-001', restaurantName: 'Bombay Bistro' },
  },
  {
    type: 'submission', submissionId: 'sub-059', status: 'PENDING', timestamp: '2026-03-02T08:55:00Z',
    creator: { id: 'creator-002', name: 'Priya Sharma', instagramHandle: '@priya.eats' },
    campaign: { id: 'camp-003', restaurantName: 'Volt Fitness Studio' },
  },
  {
    type: 'approval', submissionId: 'sub-060', status: 'APPROVED', timestamp: '2026-03-02T08:45:00Z',
    creator: { id: 'creator-003', name: 'Sneha Patil', instagramHandle: '@sneha.reviews' },
    campaign: { id: 'camp-004', restaurantName: 'GlowSkin Clinic' },
  },
  {
    type: 'submission', submissionId: 'sub-061', status: 'PENDING', timestamp: '2026-03-02T08:30:00Z',
    creator: { id: 'creator-005', name: 'Ravi Kumar', instagramHandle: '@ravi.explorer' },
    campaign: { id: 'camp-004', restaurantName: 'GlowSkin Clinic' },
  },
  {
    type: 'approval', submissionId: 'sub-012', status: 'PAID', timestamp: '2026-03-02T08:00:00Z',
    creator: { id: 'creator-007', name: 'Neha Reddy', instagramHandle: '@neha.bites' },
    campaign: { id: 'camp-003', restaurantName: 'Volt Fitness Studio' },
  },
  {
    type: 'submission', submissionId: 'sub-050', status: 'PENDING', timestamp: '2026-03-01T22:30:00Z',
    creator: { id: 'creator-008', name: 'Ananya Iyer', instagramHandle: '@ananya.foodie' },
    campaign: { id: 'camp-008', restaurantName: 'Neon Nails Studio' },
  },
  {
    type: 'submission', submissionId: 'sub-055', status: 'PENDING', timestamp: '2026-03-01T21:15:00Z',
    creator: { id: 'creator-009', name: 'Arjun Patel', instagramHandle: '@arjun.grills' },
    campaign: { id: 'camp-005', restaurantName: 'Masala Mania Delhi' },
  },
  {
    type: 'approval', submissionId: 'sub-041', status: 'REJECTED', timestamp: '2026-03-01T20:00:00Z',
    creator: { id: 'creator-010', name: 'Meera Joshi', instagramHandle: '@meera.tastes' },
    campaign: { id: 'camp-006', restaurantName: 'Chai Point Express' },
  },
  {
    type: 'submission', submissionId: 'sub-048', status: 'PENDING', timestamp: '2026-03-01T19:45:00Z',
    creator: { id: 'creator-011', name: 'Vikash Yadav', instagramHandle: '@vikash.eats' },
    campaign: { id: 'camp-001', restaurantName: 'Bombay Bistro' },
  },
  {
    type: 'approval', submissionId: 'sub-031', status: 'APPROVED', timestamp: '2026-03-01T18:30:00Z',
    creator: { id: 'creator-012', name: 'Kavya Nair', instagramHandle: '@kavya.food' },
    campaign: { id: 'camp-004', restaurantName: 'GlowSkin Clinic' },
  },
  {
    type: 'submission', submissionId: 'sub-033', status: 'APPROVED', timestamp: '2026-03-01T17:00:00Z',
    creator: { id: 'creator-013', name: 'Siddharth Das', instagramHandle: '@sid.bites' },
    campaign: { id: 'camp-014', restaurantName: 'Spice Garden Kolkata' },
  },
  {
    type: 'approval', submissionId: 'sub-025', status: 'PAID', timestamp: '2026-03-01T15:30:00Z',
    creator: { id: 'creator-002', name: 'Rohit Gupta', instagramHandle: '@rohit.grub' },
    campaign: { id: 'camp-003', restaurantName: 'Volt Fitness Studio' },
  },
  {
    type: 'approval', submissionId: 'sub-019', status: 'APPROVED', timestamp: '2026-03-01T14:00:00Z',
    creator: { id: 'creator-001', name: 'Priya Sharma', instagramHandle: '@priya.eats' },
    campaign: { id: 'camp-005', restaurantName: 'Masala Mania Delhi' },
  },
  {
    type: 'submission', submissionId: 'sub-046', status: 'PENDING', timestamp: '2026-03-01T12:30:00Z',
    creator: { id: 'creator-014', name: 'Deepak Verma', instagramHandle: '@deepak.dines' },
    campaign: { id: 'camp-007', restaurantName: 'FitZone Gym' },
  },
  {
    type: 'approval', submissionId: 'sub-044', status: 'APPROVED', timestamp: '2026-03-01T11:00:00Z',
    creator: { id: 'creator-015', name: 'Shruti Iyer', instagramHandle: '@shruti.eats' },
    campaign: { id: 'camp-009', restaurantName: 'The Yoga House' },
  },
  {
    type: 'submission', submissionId: 'sub-038', status: 'PENDING', timestamp: '2026-03-01T10:00:00Z',
    creator: { id: 'creator-010', name: 'Ananya Menon', instagramHandle: '@ananya.foodie' },
    campaign: { id: 'camp-001', restaurantName: 'Bombay Bistro' },
  },
  {
    type: 'approval', submissionId: 'sub-035', status: 'REJECTED', timestamp: '2026-03-01T09:30:00Z',
    creator: { id: 'creator-013', name: 'Karan Malhotra', instagramHandle: '@karan.eats' },
    campaign: { id: 'camp-004', restaurantName: 'GlowSkin Clinic' },
  },
  {
    type: 'submission', submissionId: 'sub-034', status: 'PENDING', timestamp: '2026-02-28T22:00:00Z',
    creator: { id: 'creator-011', name: 'Vikash Yadav', instagramHandle: '@vikash.eats' },
    campaign: { id: 'camp-001', restaurantName: 'Bombay Bistro' },
  },
  {
    type: 'approval', submissionId: 'sub-030', status: 'APPROVED', timestamp: '2026-02-28T18:30:00Z',
    creator: { id: 'creator-001', name: 'Priya Sharma', instagramHandle: '@priya.eats' },
    campaign: { id: 'camp-005', restaurantName: 'Masala Mania Delhi' },
  },
  {
    type: 'submission', submissionId: 'sub-029', status: 'PENDING', timestamp: '2026-02-28T17:00:00Z',
    creator: { id: 'creator-016', name: 'Pooja Deshmukh', instagramHandle: '@pooja.bites' },
    campaign: { id: 'camp-003', restaurantName: 'Volt Fitness Studio' },
  },
  {
    type: 'approval', submissionId: 'sub-026', status: 'APPROVED', timestamp: '2026-02-28T15:30:00Z',
    creator: { id: 'creator-001', name: 'Vikram Singh', instagramHandle: '@vikram.foodie' },
    campaign: { id: 'camp-006', restaurantName: 'Chai Point Express' },
  },
  {
    type: 'submission', submissionId: 'sub-024', status: 'PENDING', timestamp: '2026-02-28T14:00:00Z',
    creator: { id: 'creator-008', name: 'Ananya Iyer', instagramHandle: '@ananya.foodie' },
    campaign: { id: 'camp-003', restaurantName: 'Volt Fitness Studio' },
  },
  {
    type: 'submission', submissionId: 'sub-023', status: 'PENDING', timestamp: '2026-02-28T12:30:00Z',
    creator: { id: 'creator-014', name: 'Deepak Verma', instagramHandle: '@deepak.dines' },
    campaign: { id: 'camp-007', restaurantName: 'FitZone Gym' },
  },
  {
    type: 'approval', submissionId: 'sub-022', status: 'APPROVED', timestamp: '2026-02-28T11:00:00Z',
    creator: { id: 'creator-009', name: 'Arjun Patel', instagramHandle: '@arjun.grills' },
    campaign: { id: 'camp-005', restaurantName: 'Masala Mania Delhi' },
  },
  {
    type: 'submission', submissionId: 'sub-021', status: 'APPROVED', timestamp: '2026-02-28T09:00:00Z',
    creator: { id: 'creator-001', name: 'Priya Sharma', instagramHandle: '@priya.eats' },
    campaign: { id: 'camp-001', restaurantName: 'Bombay Bistro' },
  },
  {
    type: 'approval', submissionId: 'sub-020', status: 'PAID', timestamp: '2026-02-27T17:00:00Z',
    creator: { id: 'creator-001', name: 'Vikram Singh', instagramHandle: '@vikram.foodie' },
    campaign: { id: 'camp-001', restaurantName: 'Bombay Bistro' },
  },
  {
    type: 'submission', submissionId: 'sub-018', status: 'PENDING', timestamp: '2026-02-27T15:30:00Z',
    creator: { id: 'creator-015', name: 'Shruti Iyer', instagramHandle: '@shruti.eats' },
    campaign: { id: 'camp-009', restaurantName: 'The Yoga House' },
  },
  {
    type: 'approval', submissionId: 'sub-017', status: 'APPROVED', timestamp: '2026-02-27T12:00:00Z',
    creator: { id: 'creator-001', name: 'Rahul Mehta', instagramHandle: '@rahul.explores' },
    campaign: { id: 'camp-010', restaurantName: 'Beach Bites 2025' },
  },
  {
    type: 'approval', submissionId: 'sub-016', status: 'APPROVED', timestamp: '2026-02-27T10:30:00Z',
    creator: { id: 'creator-003', name: 'Sneha Patil', instagramHandle: '@sneha.reviews' },
    campaign: { id: 'camp-007', restaurantName: 'FitZone Gym' },
  },
  {
    type: 'submission', submissionId: 'sub-015', status: 'APPROVED', timestamp: '2026-02-26T16:00:00Z',
    creator: { id: 'creator-008', name: 'Ananya Iyer', instagramHandle: '@ananya.foodie' },
    campaign: { id: 'camp-003', restaurantName: 'Volt Fitness Studio' },
  },
];
