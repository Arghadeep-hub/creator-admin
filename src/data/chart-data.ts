// ─── Creator Growth (Last 12 months) ────────────────────
export const CREATOR_GROWTH_DATA = [
  { month: 'Apr 2025', total: 1420, new: 95 },
  { month: 'May 2025', total: 1530, new: 110 },
  { month: 'Jun 2025', total: 1650, new: 120 },
  { month: 'Jul 2025', total: 1790, new: 140 },
  { month: 'Aug 2025', total: 1910, new: 120 },
  { month: 'Sep 2025', total: 2020, new: 110 },
  { month: 'Oct 2025', total: 2100, new: 80 },
  { month: 'Nov 2025', total: 2180, new: 80 },
  { month: 'Dec 2025', total: 2210, new: 30 },
  { month: 'Jan 2026', total: 2280, new: 70 },
  { month: 'Feb 2026', total: 2310, new: 30 },
  { month: 'Mar 2026', total: 2437, new: 127 },
];

// ─── Submission Volume & Approval Rate (Last 8 weeks) ───
export const SUBMISSION_WEEKLY_DATA = [
  { week: 'W1 Jan', total: 78, approved: 62, rejected: 10, pending: 6, approvalRate: 79 },
  { week: 'W2 Jan', total: 85, approved: 70, rejected: 8, pending: 7, approvalRate: 82 },
  { week: 'W3 Jan', total: 92, approved: 78, rejected: 9, pending: 5, approvalRate: 85 },
  { week: 'W4 Jan', total: 88, approved: 74, rejected: 7, pending: 7, approvalRate: 84 },
  { week: 'W1 Feb', total: 95, approved: 82, rejected: 8, pending: 5, approvalRate: 86 },
  { week: 'W2 Feb', total: 102, approved: 88, rejected: 9, pending: 5, approvalRate: 86 },
  { week: 'W3 Feb', total: 98, approved: 85, rejected: 6, pending: 7, approvalRate: 87 },
  { week: 'W4 Feb', total: 110, approved: 96, rejected: 8, pending: 6, approvalRate: 87 },
];

// ─── Daily Payouts (Last 30 days) ───────────────────────
export const DAILY_PAYOUTS_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 1, i + 1);
  const paid = Math.floor(Math.random() * 45000) + 15000;
  const processing = Math.floor(Math.random() * 12000) + 3000;
  const failed = Math.floor(Math.random() * 3000);
  return {
    date: date.toISOString().split('T')[0],
    paid,
    processing,
    failed,
  };
});

// ─── Payout Distribution ────────────────────────────────
export const PAYOUT_DISTRIBUTION_DATA = [
  { range: '₹0-500', count: 12 },
  { range: '₹500-1K', count: 28 },
  { range: '₹1K-1.5K', count: 35 },
  { range: '₹1.5K-2K', count: 22 },
  { range: '₹2K-3K', count: 18 },
  { range: '₹3K-5K', count: 8 },
  { range: '₹5K+', count: 3 },
];

// ─── Top Campaigns by Payout ────────────────────────────
export const TOP_CAMPAIGNS_PAYOUT = [
  { name: 'Volt Fitness Studio', totalPaid: 285000 },
  { name: 'GlowSkin Clinic', totalPaid: 242000 },
  { name: 'Bombay Bistro', totalPaid: 198000 },
  { name: 'Masala Mania', totalPaid: 175000 },
  { name: 'Chai Point Express', totalPaid: 156000 },
  { name: 'FitZone Gym', totalPaid: 134000 },
  { name: 'Spice Garden', totalPaid: 112000 },
  { name: 'Urban Bites', totalPaid: 98000 },
  { name: 'The Yoga House', totalPaid: 87000 },
  { name: 'Neon Nails Studio', totalPaid: 72000 },
];

// ─── KYC Status Distribution ────────────────────────────
export const KYC_DISTRIBUTION = [
  { status: 'Verified', count: 1580, color: '#10b981' },
  { status: 'Pending', count: 620, color: '#f59e0b' },
  { status: 'Rejected', count: 237, color: '#ef4444' },
];

// ─── Trust Score Distribution ───────────────────────────
export const TRUST_SCORE_DISTRIBUTION = [
  { range: '0-20', count: 45 },
  { range: '21-40', count: 120 },
  { range: '41-60', count: 380 },
  { range: '61-80', count: 1050 },
  { range: '81-100', count: 842 },
];

// ─── Campaign by City ───────────────────────────────────
export const CAMPAIGNS_BY_CITY = [
  { city: 'Mumbai', count: 14 },
  { city: 'Delhi', count: 11 },
  { city: 'Bangalore', count: 9 },
  { city: 'Pune', count: 7 },
  { city: 'Hyderabad', count: 5 },
  { city: 'Chennai', count: 4 },
  { city: 'Kolkata', count: 3 },
  { city: 'Gurgaon', count: 3 },
];

// ─── Difficulty Distribution ────────────────────────────
export const DIFFICULTY_DISTRIBUTION = [
  { difficulty: 'Easy', count: 18, color: '#10b981' },
  { difficulty: 'Medium', count: 22, color: '#f59e0b' },
  { difficulty: 'Hard', count: 8, color: '#ef4444' },
];

// ─── Success Rate by Category ───────────────────────────
export const SUCCESS_RATE_BY_CATEGORY = [
  { category: 'Restaurant', successRate: 88, count: 24 },
  { category: 'Fitness', successRate: 82, count: 8 },
  { category: 'Beauty', successRate: 85, count: 6 },
  { category: 'Fashion', successRate: 78, count: 4 },
  { category: 'Travel', successRate: 75, count: 3 },
  { category: 'Education', successRate: 90, count: 2 },
  { category: 'Other', successRate: 80, count: 1 },
];

// ─── Submission Heatmap ─────────────────────────────────
export const SUBMISSION_HEATMAP = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data: Array<{ day: string; hour: number; count: number }> = [];
  days.forEach(day => {
    hours.forEach(hour => {
      let base = 2;
      if (hour >= 10 && hour <= 14) base = 8;
      if (hour >= 17 && hour <= 21) base = 12;
      if (day === 'Sat' || day === 'Sun') base = Math.floor(base * 1.3);
      data.push({ day, hour, count: Math.floor(Math.random() * base) + 1 });
    });
  });
  return data;
})();

// ─── Fraud Analytics ────────────────────────────────────
export const FRAUD_TREND_DATA = [
  { week: 'W1 Dec', rate: 8.2 },
  { week: 'W2 Dec', rate: 7.5 },
  { week: 'W3 Dec', rate: 9.1 },
  { week: 'W4 Dec', rate: 6.8 },
  { week: 'W1 Jan', rate: 7.2 },
  { week: 'W2 Jan', rate: 6.5 },
  { week: 'W3 Jan', rate: 5.8 },
  { week: 'W4 Jan', rate: 6.1 },
  { week: 'W1 Feb', rate: 5.4 },
  { week: 'W2 Feb', rate: 4.9 },
  { week: 'W3 Feb', rate: 5.2 },
  { week: 'W4 Feb', rate: 4.7 },
];

export const FRAUD_TYPE_BREAKDOWN = [
  { type: 'Post Deleted', count: 18, color: '#ef4444' },
  { type: 'Caption Edited', count: 12, color: '#f59e0b' },
  { type: 'Low Engagement', count: 8, color: '#8b5cf6' },
  { type: 'Duplicate Bill', count: 5, color: '#3b82f6' },
  { type: 'GPS Mismatch', count: 3, color: '#06b6d4' },
];

// ─── Activation Funnel ──────────────────────────────────
export const ACTIVATION_FUNNEL_DATA = [
  { step: 'Profile Created', count: 2437, percent: 100 },
  { step: 'Instagram Connected', count: 2190, percent: 89.9 },
  { step: 'KYC Submitted', count: 1820, percent: 74.7 },
  { step: 'UPI Added', count: 1650, percent: 67.7 },
  { step: 'Terms Accepted', count: 1580, percent: 64.8 },
  { step: 'First Campaign Joined', count: 1240, percent: 50.9 },
  { step: 'First Submission', count: 980, percent: 40.2 },
];

// ─── Payout Status Distribution ─────────────────────────
export const PAYOUT_STATUS_DATA = [
  { status: 'Paid', value: 62, color: '#10b981' },
  { status: 'Processing', value: 18, color: '#0ea5e9' },
  { status: 'Locked (72h)', value: 12, color: '#f97316' },
  { status: 'Failed', value: 8, color: '#ef4444' },
];

// ─── Dashboard Top Campaigns ────────────────────────────
export const DASHBOARD_TOP_CAMPAIGNS = [
  { name: 'Volt Fitness Studio', submissions: 34, avgPayout: 1820, success: 92 },
  { name: 'GlowSkin Clinic', submissions: 28, avgPayout: 1540, success: 85 },
  { name: 'Bombay Bistro', submissions: 26, avgPayout: 1680, success: 88 },
  { name: 'Masala Mania', submissions: 22, avgPayout: 1420, success: 82 },
  { name: 'Chai Point Express', submissions: 19, avgPayout: 1260, success: 90 },
];

// ─── SLA Metrics ────────────────────────────────────────
export const SLA_METRICS = {
  avgSubmissionToPayout: 82,
  avgLockedHours: 72,
  avgProcessingHours: 6,
  slaBreachRate: 8.5,
  bottleneck: 'Processing',
};
