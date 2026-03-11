// Mock leaderboard data — shape diverges from LeaderboardConfig/LeaderboardEntry (API types) for UI demos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateWeekEntries = (weekOffset: number): any[] => {
  const creators = [
    { id: 'creator-001', name: 'Priya Sharma', avatar: '' },
    { id: 'creator-003', name: 'Aisha Khan', avatar: '' },
    { id: 'creator-005', name: 'Ravi Kumar', avatar: '' },
    { id: 'creator-007', name: 'Neha Reddy', avatar: '' },
    { id: 'creator-009', name: 'Arjun Patel', avatar: '' },
    { id: 'creator-011', name: 'Meera Joshi', avatar: '' },
    { id: 'creator-002', name: 'Rohit Gupta', avatar: '' },
    { id: 'creator-004', name: 'Kavya Nair', avatar: '' },
    { id: 'creator-006', name: 'Siddharth Das', avatar: '' },
    { id: 'creator-008', name: 'Ananya Menon', avatar: '' },
    { id: 'creator-010', name: 'Vikash Yadav', avatar: '' },
    { id: 'creator-012', name: 'Pooja Deshmukh', avatar: '' },
    { id: 'creator-013', name: 'Karan Malhotra', avatar: '' },
    { id: 'creator-014', name: 'Shruti Iyer', avatar: '' },
    { id: 'creator-015', name: 'Deepak Verma', avatar: '' },
  ];

  const shuffled = [...creators].sort(() => Math.random() - 0.5);
  const baseEarnings = 14000 - weekOffset * 500;

  return shuffled.map((c, i) => {
    const earnings = Math.max(1000, baseEarnings - i * 800 + Math.floor(Math.random() * 600));
    const tier: 'gold' | 'silver' | 'bronze' = i < 3 ? 'gold' : i < 10 ? 'silver' : 'bronze';
    const badges: string[] = [];
    if (i < 10) badges.push('Top 10');
    if (earnings > 10000) badges.push('₹10k Sprint');

    return {
      rank: i + 1,
      creatorId: c.id,
      creatorName: c.name,
      creatorAvatar: c.avatar,
      weeklyEarnings: earnings,
      points: Math.floor(earnings / 10),
      submissions: Math.floor(Math.random() * 5) + 2,
      tier,
      badges,
    };
  });
};

const getWeekDates = (weeksAgo: number) => {
  const now = new Date(2026, 2, 2); // March 2, 2026
  const start = new Date(now);
  start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1) - weeksAgo * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return {
    weekStart: start.toISOString().split('T')[0],
    weekEnd: end.toISOString().split('T')[0],
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MOCK_LEADERBOARD_CONFIG: any = {
  tiers: [
    { name: 'Gold', rankRange: { min: 1, max: 3 }, minWeeklyEarnings: 12000, payoutMultiplier: 1.12, color: 'amber-500' },
    { name: 'Silver', rankRange: { min: 4, max: 10 }, minWeeklyEarnings: 6000, payoutMultiplier: 1.07, color: 'slate-400' },
    { name: 'Bronze', rankRange: { min: 11, max: null }, minWeeklyEarnings: 0, payoutMultiplier: 1.0, color: 'amber-700' },
  ],
  resetDay: 'monday',
  resetTime: '00:00',
  timezone: 'Asia/Kolkata',
  badgeTypes: [
    { name: 'Top 10', criteria: 'Rank ≤ 10', autoAssign: true },
    { name: 'Consistency Pro', criteria: '4+ submissions in the week', autoAssign: true },
    { name: 'Verified', criteria: 'KYC verified + Trust ≥ 85', autoAssign: true },
  ],
  weeklySnapshots: [
    { ...getWeekDates(0), entries: generateWeekEntries(0) },
    { ...getWeekDates(1), entries: generateWeekEntries(1) },
    { ...getWeekDates(2), entries: generateWeekEntries(2) },
    { ...getWeekDates(3), entries: generateWeekEntries(3) },
  ],
};

export const CURRENT_LEADERBOARD = MOCK_LEADERBOARD_CONFIG.weeklySnapshots[0].entries;
