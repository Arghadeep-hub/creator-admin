import type { AuditLogEntry } from '@/types';

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  // ── Critical (8) ─────────────────────────────────────
  {
    id: 'audit-001', timestamp: '2026-03-02T09:15:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Changed fraud sensitivity to Critical', category: 'SETTINGS',
    severity: 'CRITICAL', ipAddress: '192.168.1.42', details: { from: 'medium', to: 'high' },
  },
  {
    id: 'audit-002', timestamp: '2026-03-01T22:05:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Overrode payout to ₹4,500 for sub-012', category: 'PAYOUT',
    targetType: 'submission', targetId: 'sub-012', targetName: 'Volt Fitness Studio Submission',
    severity: 'CRITICAL', ipAddress: '10.0.0.15', details: { original: 2100, overridden: 4500, reason: 'Manual review approved' },
  },
  {
    id: 'audit-003', timestamp: '2026-02-28T11:30:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Flagged creator creator-018 for fraud investigation', category: 'CREATOR',
    targetType: 'creator', targetId: 'creator-018', targetName: 'Rohan Mehta',
    severity: 'CRITICAL', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-004', timestamp: '2026-02-27T14:00:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Reset trust score for creator-022 due to integrity violation', category: 'CREATOR',
    targetType: 'creator', targetId: 'creator-022', targetName: 'Deepak Verma',
    severity: 'CRITICAL', ipAddress: '192.168.1.42', details: { from: 78, to: 32 },
  },
  {
    id: 'audit-005', timestamp: '2026-02-25T09:20:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Deactivated admin account arjun@trythemenu.com', category: 'ADMIN_MGMT',
    targetType: 'admin', targetId: 'admin-003', targetName: 'Arjun Nair',
    severity: 'CRITICAL', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-006', timestamp: '2026-02-20T16:45:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Bulk rejected 8 submissions for duplicate bill fraud', category: 'SUBMISSION',
    severity: 'CRITICAL', ipAddress: '10.0.0.22', details: { count: 8, reason: 'Duplicate bill #BILL-2026-44521' },
  },
  {
    id: 'audit-007', timestamp: '2026-02-18T10:00:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Updated payout formula: engagementBonus weight changed to 1.5x', category: 'SETTINGS',
    severity: 'CRITICAL', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-008', timestamp: '2026-02-15T08:30:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Exported all creator PII data (KYC export)', category: 'SETTINGS',
    severity: 'CRITICAL', ipAddress: '192.168.1.42',
  },

  // ── Warning (12) ─────────────────────────────────────
  {
    id: 'audit-009', timestamp: '2026-03-02T08:45:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Rejected KYC for creator-011 - document mismatch', category: 'CREATOR',
    targetType: 'creator', targetId: 'creator-011', targetName: 'Meera Joshi',
    severity: 'WARNING', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-010', timestamp: '2026-03-01T19:30:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Manually retried 3 failed payouts for creator-005', category: 'PAYOUT',
    targetType: 'creator', targetId: 'creator-005', targetName: 'Ravi Kumar',
    severity: 'WARNING', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-011', timestamp: '2026-03-01T15:10:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Paused campaign camp-008 due to budget depletion', category: 'CAMPAIGN',
    targetType: 'campaign', targetId: 'camp-008', targetName: 'Neon Nails Studio',
    severity: 'WARNING', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-012', timestamp: '2026-03-01T11:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Added fraud flag note to submission sub-034', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-034', severity: 'WARNING', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-013', timestamp: '2026-02-28T17:20:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Increased campaign spots for camp-003 from 50 to 80', category: 'CAMPAIGN',
    targetType: 'campaign', targetId: 'camp-003', targetName: 'Volt Fitness Studio',
    severity: 'WARNING', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-014', timestamp: '2026-02-28T09:05:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Unlocked earnings early for creator-003 (manual override)', category: 'PAYOUT',
    severity: 'WARNING', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-015', timestamp: '2026-02-27T13:45:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Changed platform KYC requirement from optional to mandatory', category: 'SETTINGS',
    severity: 'WARNING', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-016', timestamp: '2026-02-26T16:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Rejected submission sub-041 for low engagement (1.2%)', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-041', severity: 'WARNING', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-017', timestamp: '2026-02-24T10:30:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Invited new admin sneha@trythemenu.com with Admin role', category: 'ADMIN_MGMT',
    severity: 'WARNING', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-018', timestamp: '2026-02-22T14:15:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Edited campaign deadline for camp-005 (extended by 7 days)', category: 'CAMPAIGN',
    targetType: 'campaign', targetId: 'camp-005', severity: 'WARNING', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-019', timestamp: '2026-02-20T09:00:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Disabled auto-retry for failed payouts', category: 'SETTINGS',
    severity: 'WARNING', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-020', timestamp: '2026-02-18T15:30:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Bulk approved 12 submissions for camp-001', category: 'SUBMISSION',
    severity: 'WARNING', ipAddress: '10.0.0.22', details: { count: 12, campaign: 'Bombay Bistro' },
  },

  // ── Info (35) ─────────────────────────────────────────
  {
    id: 'audit-021', timestamp: '2026-03-02T09:30:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Login from 192.168.1.42', category: 'AUTH',
    severity: 'INFO', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-022', timestamp: '2026-03-02T08:15:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Login from 10.0.0.22', category: 'AUTH',
    severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-023', timestamp: '2026-03-01T18:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Approved submission sub-028 for Bombay Bistro', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-028', severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-024', timestamp: '2026-03-01T17:45:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Approved submission sub-029 for Volt Fitness Studio', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-029', severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-025', timestamp: '2026-03-01T16:00:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Released payout of ₹2,140 for creator-007', category: 'PAYOUT',
    targetType: 'creator', targetId: 'creator-007', targetName: 'Neha Reddy',
    severity: 'INFO', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-026', timestamp: '2026-03-01T14:30:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Verified KYC for Priya Sharma (creator-001)', category: 'CREATOR',
    targetType: 'creator', targetId: 'creator-001', targetName: 'Priya Sharma',
    severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-027', timestamp: '2026-03-01T13:00:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: "Created new campaign 'Spice Garden Kolkata'", category: 'CAMPAIGN',
    targetType: 'campaign', targetId: 'camp-014', targetName: 'Spice Garden Kolkata',
    severity: 'INFO', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-028', timestamp: '2026-03-01T11:30:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Released payout of ₹3,580 for creator-003', category: 'PAYOUT',
    severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-029', timestamp: '2026-03-01T10:15:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Login from 192.168.1.88', category: 'AUTH',
    severity: 'INFO', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-030', timestamp: '2026-03-01T09:00:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Approved submission sub-031 for GlowSkin Clinic', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-031', severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-031', timestamp: '2026-02-28T19:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Logout', category: 'AUTH', severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-032', timestamp: '2026-02-28T15:00:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Updated leaderboard tier thresholds', category: 'SETTINGS',
    severity: 'INFO', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-033', timestamp: '2026-02-28T13:30:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Added admin note to submission sub-038', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-038', severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-034', timestamp: '2026-02-28T10:00:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Activated milestone badge: Clean Integrity Streak', category: 'SETTINGS',
    severity: 'INFO', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-035', timestamp: '2026-02-27T18:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Approved submission sub-033 for Masala Mania', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-033', severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-036', timestamp: '2026-02-27T15:30:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Released payout of ₹1,850 for creator-009', category: 'PAYOUT',
    severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-037', timestamp: '2026-02-27T11:00:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Archived expired campaign camp-010', category: 'CAMPAIGN',
    targetType: 'campaign', targetId: 'camp-010', severity: 'INFO', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-038', timestamp: '2026-02-26T17:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Login from 10.0.0.15', category: 'AUTH',
    severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-039', timestamp: '2026-02-26T14:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Approved submission sub-025 for Chai Point Express', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-025', severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-040', timestamp: '2026-02-26T10:30:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Verified KYC for Aisha Khan (creator-003)', category: 'CREATOR',
    targetType: 'creator', targetId: 'creator-003', severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-041', timestamp: '2026-02-25T18:30:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Toggled push notifications OFF', category: 'SETTINGS',
    severity: 'INFO', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-042', timestamp: '2026-02-25T14:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Released payout of ₹2,960 for creator-005', category: 'PAYOUT',
    severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-043', timestamp: '2026-02-24T17:00:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Created campaign draft: Urban Bites Gurgaon', category: 'CAMPAIGN',
    targetType: 'campaign', targetId: 'camp-009', severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-044', timestamp: '2026-02-24T11:00:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Login from 192.168.1.88', category: 'AUTH',
    severity: 'INFO', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-045', timestamp: '2026-02-23T16:30:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Approved submission sub-019 for FitZone Gym', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-019', severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-046', timestamp: '2026-02-23T12:00:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Verified KYC for Arjun Patel (creator-009)', category: 'CREATOR',
    targetType: 'creator', targetId: 'creator-009', severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-047', timestamp: '2026-02-22T18:00:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Published campaign Volt Fitness Studio', category: 'CAMPAIGN',
    targetType: 'campaign', targetId: 'camp-003', severity: 'INFO', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-048', timestamp: '2026-02-22T10:00:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Released bulk payouts: 8 transactions processed', category: 'PAYOUT',
    severity: 'INFO', ipAddress: '10.0.0.15', details: { count: 8, totalAmount: 18640 },
  },
  {
    id: 'audit-049', timestamp: '2026-02-21T16:00:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Updated platform name to TryTheMenu v2', category: 'SETTINGS',
    severity: 'INFO', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-050', timestamp: '2026-02-21T11:30:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Approved submission sub-015 for GlowSkin Clinic', category: 'SUBMISSION',
    targetType: 'submission', targetId: 'sub-015', severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-051', timestamp: '2026-02-20T18:30:00Z', adminId: 'admin-001', adminName: 'Vikram Singh',
    adminRole: 'ADMIN', action: 'Logout', category: 'AUTH', severity: 'INFO', ipAddress: '10.0.0.15',
  },
  {
    id: 'audit-052', timestamp: '2026-02-20T14:00:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'Added managed location: Cyber Hub, Gurgaon', category: 'SETTINGS',
    severity: 'INFO', ipAddress: '192.168.1.42',
  },
  {
    id: 'audit-053', timestamp: '2026-02-19T17:00:00Z', adminId: 'admin-002', adminName: 'Sneha Patil',
    adminRole: 'ADMIN', action: 'Released payout of ₹1,420 for creator-015', category: 'PAYOUT',
    severity: 'INFO', ipAddress: '10.0.0.22',
  },
  {
    id: 'audit-054', timestamp: '2026-02-18T12:00:00Z', adminId: 'sa-002', adminName: 'Ananya Iyer',
    adminRole: 'SUPERADMIN', action: 'Activated new fraud rule: Duplicate Bill Detection', category: 'SETTINGS',
    severity: 'INFO', ipAddress: '192.168.1.88',
  },
  {
    id: 'audit-055', timestamp: '2026-02-17T10:00:00Z', adminId: 'sa-001', adminName: 'Rahul Mehta',
    adminRole: 'SUPERADMIN', action: 'System: Weekly leaderboard snapshot generated', category: 'SETTINGS',
    severity: 'INFO', ipAddress: '127.0.0.1',
  },
];
