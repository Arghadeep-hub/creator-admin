// Mock submission data — shape diverges from SubmissionAdmin (API type) intentionally for UI demos

// ─── Campaign name mapping ─────────────────────────────
const campaignNames: Record<string, string> = {
  'camp-001': 'Transformation Workout Reel at Volt Fitness Studio',
  'camp-002': 'Trust-First Skincare Reel at GlowSkin Clinic',
  'camp-003': 'Mentor-Led Edtech Demo Reel for CodeNest Academy',
  'camp-004': 'Transition Lookbook Reel for TrendKart Fashion',
  'camp-005': 'Wanderlust Itinerary Reel with TripNest Holidays',
  'camp-006': 'Paradise Biryani Experience',
  'camp-007': 'Wow! Momo Street Bites',
  'camp-008': 'Behrouz Royal Biryani',
  'camp-009': 'Pizza Hut Meltdown Deal',
  'camp-010': 'Theobroma Dessert Trail',
  'camp-011': 'Chaayos Kulhad Special',
  'camp-012': 'Social Offline Brunch',
  'camp-013': 'Burger King Whopper Fest',
  'camp-014': 'Sagar Ratna Thali Review',
  'camp-015': 'Natural Ice Cream Tasting',
};

// ─── Creator pool ──────────────────────────────────────
const creators: Record<string, { name: string; handle: string }> = {
  'creator-001': { name: 'Priya Sharma', handle: '@priya_eats' },
  'creator-002': { name: 'Arjun Nair', handle: '@arjun_foodie' },
  'creator-003': { name: 'Meghna Reddy', handle: '@meghna_bites' },
  'creator-004': { name: 'Rohit Kapoor', handle: '@rohit_tastes' },
  'creator-005': { name: 'Ananya Desai', handle: '@ananya_cravings' },
  'creator-006': { name: 'Karthik Iyer', handle: '@karthik_grub' },
  'creator-007': { name: 'Sanya Malhotra', handle: '@sanya_foodgram' },
  'creator-008': { name: 'Vikash Gupta', handle: '@vikash_plates' },
  'creator-009': { name: 'Neha Joshi', handle: '@neha_dines' },
  'creator-010': { name: 'Aditya Verma', handle: '@aditya_munches' },
  'creator-011': { name: 'Riya Banerjee', handle: '@riya_reviews' },
  'creator-012': { name: 'Manish Tiwari', handle: '@manish_bhojan' },
  'creator-013': { name: 'Shruti Patel', handle: '@shruti_khana' },
  'creator-014': { name: 'Deepak Rao', handle: '@deepak_flavours' },
  'creator-015': { name: 'Kavya Menon', handle: '@kavya_foodvibes' },
  'creator-016': { name: 'Amit Sinha', handle: '@amit_gastro' },
  'creator-017': { name: 'Pooja Chauhan', handle: '@pooja_nomnom' },
  'creator-018': { name: 'Nikhil Das', handle: '@nikhil_eatsout' },
  'creator-019': { name: 'Ishita Agarwal', handle: '@ishita_platter' },
  'creator-020': { name: 'Sameer Khan', handle: '@sameer_zaika' },
  'creator-021': { name: 'Tanvi Kulkarni', handle: '@tanvi_tastings' },
  'creator-022': { name: 'Gaurav Saxena', handle: '@gaurav_chaska' },
  'creator-023': { name: 'Divya Rajput', handle: '@divya_cuisines' },
  'creator-024': { name: 'Harsh Pandey', handle: '@harsh_bitesize' },
  'creator-025': { name: 'Nisha Choudhary', handle: '@nisha_thefoodie' },
};

// ─── Indian city locations ─────────────────────────────
const cityLocations = [
  { city: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { city: 'Delhi', lat: 28.6139, lng: 77.209 },
  { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { city: 'Pune', lat: 18.5204, lng: 73.8567 },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { city: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { city: 'Lucknow', lat: 26.8467, lng: 80.9462 },
];

// ─── Helper: date offsetter ────────────────────────────
function daysAgo(days: number, hoursOffset = 0): string {
  const d = new Date('2026-03-02T12:00:00+05:30');
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() + hoursOffset);
  return d.toISOString();
}

function hoursAfter(iso: string, hours: number): string {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function minutesBefore(iso: string, minutes: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
}

// ─── Captions ──────────────────────────────────────────
const captions = [
  'Absolutely loved the biryani here! The flavours are out of this world 🔥 #BiryaniBlues #TryTheMenu #FoodieLife #DelhiFood',
  'Morning chai never tasted this good ☕ Perfect start to my day! #ChaiPoint #TryTheMenu #ChaiLovers #MorningVibes',
  'Healthy eating made delicious! This bowl is everything 🥗 #FreshMenu #TryTheMenu #HealthyEating #CleanEats',
  'Unlimited kebabs and this amazing ambience! What more could you ask for? 🍖 #BarbequeNation #TryTheMenu #Foodgasm',
  'Festival vibes with the sweetest treats 🍬 #Haldiram #TryTheMenu #SweetTooth #FestivalFood',
  'The OG Hyderabadi biryani experience! Layers of perfection 🍚 #ParadiseBiryani #TryTheMenu #HyderabadFood',
  'These momos are literally the best street food find! 🥟 #WowMomo #TryTheMenu #StreetFood #MomoLovers',
  'Royal biryani delivered to your doorstep, tastes like a feast! 👑 #Behrouz #TryTheMenu #BiryaniLovers',
  'Cheesy, saucy, and absolutely loaded! Pizza night done right 🍕 #PizzaHut #TryTheMenu #PizzaLovers',
  'Dessert heaven exists and it is called Theobroma 🍰 #Theobroma #TryTheMenu #DessertLovers #Mumbai',
  'Kulhad chai in this cozy corner is a whole mood 🫖 #Chaayos #TryTheMenu #ChaiTime #WinterVibes',
  'Brunch goals at Social! The vibe, the food, the company ✨ #SocialOffline #TryTheMenu #BrunchVibes',
  'Whopper challenge accepted and conquered! 🍔 #BurgerKing #TryTheMenu #BurgerLovers #Foodie',
  'South Indian thali done right! Every dish was perfect 🍛 #SagarRatna #TryTheMenu #ThaliLove',
  'Natural ice cream on a sunny day - pure bliss! 🍦 #NaturalIceCream #TryTheMenu #IceCreamLovers',
  'Cannot stop coming back here for the butter chicken biryani combo! 🤤 #BiryaniBlues #TryTheMenu #ComfortFood',
  'Masala chai with bun maska - the Mumbai special! ☕ #ChaiPoint #TryTheMenu #MumbaiStreetFood',
  'This protein bowl is my new post-gym ritual 💪 #FreshMenu #TryTheMenu #FitnessFood #GymLife',
  'Weekend unlimited buffet = best decision ever! 🎉 #BarbequeNation #TryTheMenu #WeekendVibes',
  'Kaju katli that melts in your mouth! Pure gold ✨ #Haldiram #TryTheMenu #IndianSweets',
  'Family special biryani for 4 and we all loved it! 👨‍👩‍👧‍👦 #ParadiseBiryani #TryTheMenu #FamilyDining',
  'Spicy momos with that fiery chutney - perfect combo! 🌶️ #WowMomo #TryTheMenu #SpicyFood',
  'Dum biryani that takes you back to Mughal era! 🏰 #Behrouz #TryTheMenu #RoyalFeast',
  'New stuffed crust is a game changer fr! 🍕 #PizzaHut #TryTheMenu #NewLaunch #FoodReview',
  'Brownies from heaven! Best chocolate dessert in the city 🍫 #Theobroma #TryTheMenu #Brownies',
  'Tried their new winter special menu and I am hooked! 🫖 #Chaayos #TryTheMenu #WinterSpecial',
  'This appetizer platter is worth every rupee! 🍽️ #SocialOffline #TryTheMenu #Appetizers',
  'Kids meal deal is actually so good even adults love it 😂 #BurgerKing #TryTheMenu #ValueMeal',
  'Dosa varieties I never knew existed! Mind blown 🤯 #SagarRatna #TryTheMenu #SouthIndian',
  'Sitaphal ice cream - you HAVE to try this seasonal special! 🍨 #NaturalIceCream #TryTheMenu #Seasonal',
  'Late night biryani cravings sorted! Open till 2 AM 🌙 #BiryaniBlues #TryTheMenu #LateNight',
  'Iced chai latte for the summer days ahead ❄️ #ChaiPoint #TryTheMenu #IcedChai #SummerDrinks',
  'Meal prep made easy with their weekly subscription 📦 #FreshMenu #TryTheMenu #MealPrep',
  'Live grill station is the highlight of this place! 🔥 #BarbequeNation #TryTheMenu #LiveGrill',
  'Diwali special sweets box - gifted to everyone I know! 🪔 #Haldiram #TryTheMenu #DiwaliGifts',
  'Portion size is massive! Great value for money here 💰 #ParadiseBiryani #TryTheMenu #ValueForMoney',
  'Pan fried momos with cheese - need I say more? 🧀 #WowMomo #TryTheMenu #CheeseMomos',
  'Anniversary dinner sorted with this royal feast! 💕 #Behrouz #TryTheMenu #DateNight',
  'Garlic breadsticks are criminally underrated here 🧄 #PizzaHut #TryTheMenu #GarlicBread',
  'Mango mousse cake for the win this summer! 🥭 #Theobroma #TryTheMenu #MangoSeason',
  'Rainy day + kulhad chai + pakoras = perfection 🌧️ #Chaayos #TryTheMenu #RainyDay',
  'DJ night with amazing food - what a combo! 🎶 #SocialOffline #TryTheMenu #NightOut',
  'Flame grilled patty makes ALL the difference! 🔥 #BurgerKing #TryTheMenu #FlameGrilled',
  'Filter coffee and idli sambar - the classic combo 🫕 #SagarRatna #TryTheMenu #SouthIndianBreakfast',
  'Tender coconut ice cream on Marine Drive hits different 🌊 #NaturalIceCream #TryTheMenu #MarineDrive',
  'First time trying their mutton biryani - absolutely divine! 🐐 #BiryaniBlues #TryTheMenu #MuttonBiryani',
  'Chai and conversations - the perfect evening! ☕ #ChaiPoint #TryTheMenu #EveningTea',
  'Tried the new Thai curry bowl - fusion done right! 🍜 #FreshMenu #TryTheMenu #ThaiFood',
  'Dessert counter alone is worth the visit! 🎂 #BarbequeNation #TryTheMenu #DessertBuffet',
  'Gulab jamun that reminds me of grandma cooking! 🍩 #Haldiram #TryTheMenu #Nostalgia',
  'Solo dining experience was top notch! Great for introverts 😌 #ParadiseBiryani #TryTheMenu #SoloDining',
  'Momo burger - the crossover we did not know we needed! 🍔 #WowMomo #TryTheMenu #FusionFood',
  'Mutton seekh biryani is their best kept secret! 🤫 #Behrouz #TryTheMenu #SecretMenu',
  'Pan pizza with extra cheese = happiness equation solved 🧮 #PizzaHut #TryTheMenu #CheesePizza',
  'Red velvet pastry is a work of art here! 🎨 #Theobroma #TryTheMenu #RedVelvet',
  'New matcha latte added to the menu - finally! 🍵 #Chaayos #TryTheMenu #Matcha',
  'Rooftop vibes with sunset views and great cocktails 🌅 #SocialOffline #TryTheMenu #Rooftop',
  'Crispy chicken sandwich meal for under 200! 🐔 #BurgerKing #TryTheMenu #BudgetMeal',
  'Masala dosa with 5 different chutneys! 🫕 #SagarRatna #TryTheMenu #DosaLovers',
  'Alphonso mango season special is back! Do not miss it! 🥭 #NaturalIceCream #TryTheMenu #AlphonsoMango',
];

// ─── Submission builder ────────────────────────────────
interface SubmissionSeed {
  idx: number;
  campId: string;
  creatorId: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  verificationStage: 't0' | 'h24' | 'h72' | 'completed';
  daysBack: number;
  views: number;
  likes: number;
  comments: number;
  projectedPayout: number;
  base: number;
  engagementBonus: number;
  trustBonus: number;
  penalties: number;
  billVerificationStatus: 'pending' | 'verified' | 'rejected';
  hasFraudFlags: boolean;
  hasAdminNotes: boolean;
  captionEdited: boolean;
  hasCheckIn: boolean;
  cityIdx: number;
  distanceKm: number;
  withinRadius: boolean;
  ranking: number;
  totalRankEntries: number;
}

const seeds: SubmissionSeed[] = [
  // ── Pending (15): sub-001 to sub-015 ────────────────
  { idx: 1, campId: 'camp-001', creatorId: 'creator-001', status: 'pending', verificationStage: 't0', daysBack: 1, views: 820, likes: 65, comments: 12, projectedPayout: 1200, base: 800, engagementBonus: 300, trustBonus: 100, penalties: 0, billVerificationStatus: 'pending', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 0, distanceKm: 0.3, withinRadius: true, ranking: 5, totalRankEntries: 28 },
  { idx: 2, campId: 'camp-002', creatorId: 'creator-003', status: 'pending', verificationStage: 't0', daysBack: 1, views: 1200, likes: 95, comments: 18, projectedPayout: 1500, base: 900, engagementBonus: 400, trustBonus: 200, penalties: 0, billVerificationStatus: 'pending', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 1, distanceKm: 0.5, withinRadius: true, ranking: 3, totalRankEntries: 25 },
  { idx: 3, campId: 'camp-003', creatorId: 'creator-005', status: 'pending', verificationStage: 't0', daysBack: 2, views: 650, likes: 42, comments: 8, projectedPayout: 900, base: 600, engagementBonus: 200, trustBonus: 100, penalties: 0, billVerificationStatus: 'pending', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 2, distanceKm: 1.2, withinRadius: true, ranking: 12, totalRankEntries: 30 },
  { idx: 4, campId: 'camp-004', creatorId: 'creator-007', status: 'pending', verificationStage: 'h24', daysBack: 2, views: 3400, likes: 280, comments: 45, projectedPayout: 2500, base: 1200, engagementBonus: 1000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 3, distanceKm: 0.8, withinRadius: true, ranking: 2, totalRankEntries: 32 },
  { idx: 5, campId: 'camp-005', creatorId: 'creator-009', status: 'pending', verificationStage: 'h24', daysBack: 3, views: 2100, likes: 175, comments: 28, projectedPayout: 1800, base: 1000, engagementBonus: 600, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 4, distanceKm: 0.2, withinRadius: true, ranking: 7, totalRankEntries: 27 },
  { idx: 6, campId: 'camp-006', creatorId: 'creator-011', status: 'pending', verificationStage: 'h24', daysBack: 3, views: 4500, likes: 320, comments: 55, projectedPayout: 3200, base: 1300, engagementBonus: 1500, trustBonus: 200, penalties: 0, billVerificationStatus: 'pending', hasFraudFlags: true, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 3, distanceKm: 3.5, withinRadius: false, ranking: 1, totalRankEntries: 35 },
  { idx: 7, campId: 'camp-007', creatorId: 'creator-013', status: 'pending', verificationStage: 'h72', daysBack: 4, views: 5200, likes: 410, comments: 72, projectedPayout: 3800, base: 1400, engagementBonus: 1800, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 5, distanceKm: 0.6, withinRadius: true, ranking: 1, totalRankEntries: 22 },
  { idx: 8, campId: 'camp-008', creatorId: 'creator-015', status: 'pending', verificationStage: 'h72', daysBack: 4, views: 1800, likes: 140, comments: 22, projectedPayout: 1600, base: 900, engagementBonus: 500, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 6, distanceKm: 1.0, withinRadius: true, ranking: 9, totalRankEntries: 24 },
  { idx: 9, campId: 'camp-009', creatorId: 'creator-017', status: 'pending', verificationStage: 't0', daysBack: 1, views: 520, likes: 35, comments: 6, projectedPayout: 750, base: 500, engagementBonus: 150, trustBonus: 100, penalties: 0, billVerificationStatus: 'pending', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 7, distanceKm: 0.4, withinRadius: true, ranking: 18, totalRankEntries: 26 },
  { idx: 10, campId: 'camp-010', creatorId: 'creator-019', status: 'pending', verificationStage: 't0', daysBack: 1, views: 980, likes: 78, comments: 14, projectedPayout: 1100, base: 700, engagementBonus: 300, trustBonus: 100, penalties: 0, billVerificationStatus: 'pending', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 0, distanceKm: 0.7, withinRadius: true, ranking: 8, totalRankEntries: 29 },
  { idx: 11, campId: 'camp-011', creatorId: 'creator-021', status: 'pending', verificationStage: 'h24', daysBack: 2, views: 2800, likes: 220, comments: 38, projectedPayout: 2200, base: 1100, engagementBonus: 800, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 1, distanceKm: 0.9, withinRadius: true, ranking: 4, totalRankEntries: 31 },
  { idx: 12, campId: 'camp-012', creatorId: 'creator-023', status: 'pending', verificationStage: 'h72', daysBack: 5, views: 7200, likes: 580, comments: 95, projectedPayout: 4200, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 2, distanceKm: 0.3, withinRadius: true, ranking: 1, totalRankEntries: 38 },
  { idx: 13, campId: 'camp-013', creatorId: 'creator-025', status: 'pending', verificationStage: 't0', daysBack: 1, views: 600, likes: 48, comments: 9, projectedPayout: 850, base: 600, engagementBonus: 150, trustBonus: 100, penalties: 0, billVerificationStatus: 'pending', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 8, distanceKm: 1.5, withinRadius: true, ranking: 15, totalRankEntries: 23 },
  { idx: 14, campId: 'camp-014', creatorId: 'creator-002', status: 'pending', verificationStage: 'h24', daysBack: 3, views: 3100, likes: 245, comments: 40, projectedPayout: 2400, base: 1100, engagementBonus: 1000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 9, distanceKm: 0.4, withinRadius: true, ranking: 3, totalRankEntries: 33 },
  { idx: 15, campId: 'camp-015', creatorId: 'creator-004', status: 'pending', verificationStage: 't0', daysBack: 1, views: 710, likes: 55, comments: 10, projectedPayout: 950, base: 650, engagementBonus: 200, trustBonus: 100, penalties: 0, billVerificationStatus: 'pending', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 4, distanceKm: 0.6, withinRadius: true, ranking: 11, totalRankEntries: 20 },

  // ── Approved (25): sub-016 to sub-040 ───────────────
  { idx: 16, campId: 'camp-001', creatorId: 'creator-002', status: 'approved', verificationStage: 'completed', daysBack: 8, views: 12500, likes: 980, comments: 145, projectedPayout: 4500, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 0, distanceKm: 0.2, withinRadius: true, ranking: 1, totalRankEntries: 34 },
  { idx: 17, campId: 'camp-002', creatorId: 'creator-004', status: 'approved', verificationStage: 'completed', daysBack: 10, views: 8900, likes: 720, comments: 110, projectedPayout: 3800, base: 1300, engagementBonus: 1800, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 1, distanceKm: 0.4, withinRadius: true, ranking: 2, totalRankEntries: 28 },
  { idx: 18, campId: 'camp-003', creatorId: 'creator-006', status: 'approved', verificationStage: 'completed', daysBack: 12, views: 15200, likes: 1200, comments: 180, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 2, distanceKm: 0.5, withinRadius: true, ranking: 1, totalRankEntries: 36 },
  { idx: 19, campId: 'camp-004', creatorId: 'creator-008', status: 'approved', verificationStage: 'completed', daysBack: 7, views: 6800, likes: 540, comments: 85, projectedPayout: 3200, base: 1200, engagementBonus: 1500, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 3, distanceKm: 0.3, withinRadius: true, ranking: 3, totalRankEntries: 30 },
  { idx: 20, campId: 'camp-005', creatorId: 'creator-010', status: 'approved', verificationStage: 'completed', daysBack: 9, views: 22000, likes: 1800, comments: 290, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 4, distanceKm: 0.1, withinRadius: true, ranking: 1, totalRankEntries: 40 },
  { idx: 21, campId: 'camp-006', creatorId: 'creator-012', status: 'approved', verificationStage: 'completed', daysBack: 14, views: 9500, likes: 760, comments: 120, projectedPayout: 3900, base: 1300, engagementBonus: 1800, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 5, distanceKm: 0.6, withinRadius: true, ranking: 2, totalRankEntries: 32 },
  { idx: 22, campId: 'camp-007', creatorId: 'creator-014', status: 'approved', verificationStage: 'completed', daysBack: 11, views: 18500, likes: 1500, comments: 240, projectedPayout: 4800, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 6, distanceKm: 0.4, withinRadius: true, ranking: 1, totalRankEntries: 35 },
  { idx: 23, campId: 'camp-008', creatorId: 'creator-016', status: 'approved', verificationStage: 'completed', daysBack: 6, views: 5400, likes: 430, comments: 68, projectedPayout: 2800, base: 1100, engagementBonus: 1200, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 7, distanceKm: 0.8, withinRadius: true, ranking: 5, totalRankEntries: 26 },
  { idx: 24, campId: 'camp-009', creatorId: 'creator-018', status: 'approved', verificationStage: 'completed', daysBack: 15, views: 11000, likes: 880, comments: 135, projectedPayout: 4200, base: 1400, engagementBonus: 1800, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 8, distanceKm: 0.3, withinRadius: true, ranking: 2, totalRankEntries: 33 },
  { idx: 25, campId: 'camp-010', creatorId: 'creator-020', status: 'approved', verificationStage: 'completed', daysBack: 8, views: 7600, likes: 610, comments: 95, projectedPayout: 3500, base: 1200, engagementBonus: 1600, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 9, distanceKm: 0.5, withinRadius: true, ranking: 3, totalRankEntries: 29 },
  { idx: 26, campId: 'camp-011', creatorId: 'creator-022', status: 'approved', verificationStage: 'h72', daysBack: 5, views: 4800, likes: 380, comments: 62, projectedPayout: 2600, base: 1100, engagementBonus: 1100, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 0, distanceKm: 0.7, withinRadius: true, ranking: 4, totalRankEntries: 27 },
  { idx: 27, campId: 'camp-012', creatorId: 'creator-024', status: 'approved', verificationStage: 'h72', daysBack: 4, views: 3600, likes: 290, comments: 48, projectedPayout: 2300, base: 1000, engagementBonus: 900, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 1, distanceKm: 0.9, withinRadius: true, ranking: 6, totalRankEntries: 31 },
  { idx: 28, campId: 'camp-013', creatorId: 'creator-001', status: 'approved', verificationStage: 'completed', daysBack: 13, views: 28000, likes: 2200, comments: 350, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 2, distanceKm: 0.2, withinRadius: true, ranking: 1, totalRankEntries: 38 },
  { idx: 29, campId: 'camp-014', creatorId: 'creator-003', status: 'approved', verificationStage: 'completed', daysBack: 16, views: 13500, likes: 1080, comments: 165, projectedPayout: 4600, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 3, distanceKm: 0.3, withinRadius: true, ranking: 1, totalRankEntries: 34 },
  { idx: 30, campId: 'camp-015', creatorId: 'creator-005', status: 'approved', verificationStage: 'h72', daysBack: 5, views: 4200, likes: 340, comments: 55, projectedPayout: 2400, base: 1000, engagementBonus: 1000, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 4, distanceKm: 0.4, withinRadius: true, ranking: 5, totalRankEntries: 25 },
  { idx: 31, campId: 'camp-001', creatorId: 'creator-006', status: 'approved', verificationStage: 'completed', daysBack: 18, views: 35000, likes: 2800, comments: 420, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 5, distanceKm: 0.1, withinRadius: true, ranking: 1, totalRankEntries: 40 },
  { idx: 32, campId: 'camp-002', creatorId: 'creator-008', status: 'approved', verificationStage: 'completed', daysBack: 20, views: 10500, likes: 840, comments: 130, projectedPayout: 4100, base: 1400, engagementBonus: 1800, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 6, distanceKm: 0.6, withinRadius: true, ranking: 2, totalRankEntries: 30 },
  { idx: 33, campId: 'camp-003', creatorId: 'creator-010', status: 'approved', verificationStage: 'h72', daysBack: 4, views: 3900, likes: 310, comments: 50, projectedPayout: 2200, base: 1000, engagementBonus: 800, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 7, distanceKm: 0.5, withinRadius: true, ranking: 6, totalRankEntries: 28 },
  { idx: 34, campId: 'camp-004', creatorId: 'creator-012', status: 'approved', verificationStage: 'completed', daysBack: 10, views: 16000, likes: 1280, comments: 195, projectedPayout: 4700, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 8, distanceKm: 0.3, withinRadius: true, ranking: 1, totalRankEntries: 36 },
  { idx: 35, campId: 'camp-005', creatorId: 'creator-014', status: 'approved', verificationStage: 'completed', daysBack: 22, views: 42000, likes: 3000, comments: 480, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 9, distanceKm: 0.2, withinRadius: true, ranking: 1, totalRankEntries: 40 },
  { idx: 36, campId: 'camp-006', creatorId: 'creator-016', status: 'approved', verificationStage: 'h72', daysBack: 4, views: 5100, likes: 405, comments: 65, projectedPayout: 2700, base: 1100, engagementBonus: 1100, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 0, distanceKm: 0.8, withinRadius: true, ranking: 4, totalRankEntries: 29 },
  { idx: 37, campId: 'camp-007', creatorId: 'creator-018', status: 'approved', verificationStage: 'completed', daysBack: 9, views: 7200, likes: 575, comments: 90, projectedPayout: 3300, base: 1200, engagementBonus: 1500, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 1, distanceKm: 0.4, withinRadius: true, ranking: 3, totalRankEntries: 32 },
  { idx: 38, campId: 'camp-008', creatorId: 'creator-020', status: 'approved', verificationStage: 'completed', daysBack: 11, views: 19500, likes: 1560, comments: 250, projectedPayout: 4900, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 2, distanceKm: 0.3, withinRadius: true, ranking: 1, totalRankEntries: 37 },
  { idx: 39, campId: 'camp-009', creatorId: 'creator-022', status: 'approved', verificationStage: 'h72', daysBack: 5, views: 4500, likes: 360, comments: 58, projectedPayout: 2500, base: 1100, engagementBonus: 1000, trustBonus: 200, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 3, distanceKm: 0.6, withinRadius: true, ranking: 5, totalRankEntries: 26 },
  { idx: 40, campId: 'camp-010', creatorId: 'creator-024', status: 'approved', verificationStage: 'completed', daysBack: 7, views: 8200, likes: 660, comments: 100, projectedPayout: 3600, base: 1300, engagementBonus: 1600, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 4, distanceKm: 0.5, withinRadius: true, ranking: 2, totalRankEntries: 33 },

  // ── Rejected (10): sub-041 to sub-050 ───────────────
  { idx: 41, campId: 'camp-001', creatorId: 'creator-009', status: 'rejected', verificationStage: 'h24', daysBack: 6, views: 1500, likes: 45, comments: 8, projectedPayout: 0, base: 800, engagementBonus: 0, trustBonus: 0, penalties: -500, billVerificationStatus: 'rejected', hasFraudFlags: true, hasAdminNotes: true, captionEdited: true, hasCheckIn: true, cityIdx: 5, distanceKm: 4.8, withinRadius: false, ranking: 28, totalRankEntries: 34 },
  { idx: 42, campId: 'camp-003', creatorId: 'creator-011', status: 'rejected', verificationStage: 'h72', daysBack: 8, views: 2200, likes: 60, comments: 10, projectedPayout: 0, base: 700, engagementBonus: 0, trustBonus: 0, penalties: -400, billVerificationStatus: 'rejected', hasFraudFlags: true, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 6, distanceKm: 3.2, withinRadius: false, ranking: 25, totalRankEntries: 30 },
  { idx: 43, campId: 'camp-005', creatorId: 'creator-013', status: 'rejected', verificationStage: 'completed', daysBack: 12, views: 800, likes: 30, comments: 5, projectedPayout: 0, base: 600, engagementBonus: 0, trustBonus: 0, penalties: -300, billVerificationStatus: 'verified', hasFraudFlags: true, hasAdminNotes: true, captionEdited: false, hasCheckIn: false, cityIdx: 7, distanceKm: 0, withinRadius: false, ranking: 30, totalRankEntries: 27 },
  { idx: 44, campId: 'camp-007', creatorId: 'creator-015', status: 'rejected', verificationStage: 'h24', daysBack: 5, views: 3200, likes: 85, comments: 12, projectedPayout: 0, base: 900, engagementBonus: 0, trustBonus: 0, penalties: -450, billVerificationStatus: 'rejected', hasFraudFlags: true, hasAdminNotes: true, captionEdited: true, hasCheckIn: true, cityIdx: 8, distanceKm: 2.1, withinRadius: false, ranking: 22, totalRankEntries: 35 },
  { idx: 45, campId: 'camp-009', creatorId: 'creator-017', status: 'rejected', verificationStage: 'h72', daysBack: 10, views: 1100, likes: 38, comments: 7, projectedPayout: 0, base: 500, engagementBonus: 0, trustBonus: 0, penalties: -250, billVerificationStatus: 'rejected', hasFraudFlags: true, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 9, distanceKm: 4.2, withinRadius: false, ranking: 26, totalRankEntries: 26 },
  { idx: 46, campId: 'camp-011', creatorId: 'creator-019', status: 'rejected', verificationStage: 'completed', daysBack: 15, views: 950, likes: 32, comments: 6, projectedPayout: 0, base: 600, engagementBonus: 0, trustBonus: 0, penalties: -350, billVerificationStatus: 'verified', hasFraudFlags: true, hasAdminNotes: true, captionEdited: true, hasCheckIn: true, cityIdx: 0, distanceKm: 1.8, withinRadius: true, ranking: 29, totalRankEntries: 31 },
  { idx: 47, campId: 'camp-013', creatorId: 'creator-021', status: 'rejected', verificationStage: 'h24', daysBack: 7, views: 1800, likes: 50, comments: 9, projectedPayout: 0, base: 700, engagementBonus: 0, trustBonus: 0, penalties: -400, billVerificationStatus: 'rejected', hasFraudFlags: true, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 1, distanceKm: 3.8, withinRadius: false, ranking: 24, totalRankEntries: 28 },
  { idx: 48, campId: 'camp-015', creatorId: 'creator-023', status: 'rejected', verificationStage: 'h72', daysBack: 9, views: 2500, likes: 70, comments: 11, projectedPayout: 0, base: 800, engagementBonus: 0, trustBonus: 0, penalties: -500, billVerificationStatus: 'verified', hasFraudFlags: true, hasAdminNotes: true, captionEdited: true, hasCheckIn: true, cityIdx: 2, distanceKm: 2.5, withinRadius: false, ranking: 27, totalRankEntries: 32 },
  { idx: 49, campId: 'camp-002', creatorId: 'creator-025', status: 'rejected', verificationStage: 'completed', daysBack: 18, views: 600, likes: 35, comments: 5, projectedPayout: 0, base: 500, engagementBonus: 0, trustBonus: 0, penalties: -200, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 3, distanceKm: 1.5, withinRadius: true, ranking: 31, totalRankEntries: 25 },
  { idx: 50, campId: 'camp-004', creatorId: 'creator-007', status: 'rejected', verificationStage: 'h72', daysBack: 11, views: 1300, likes: 42, comments: 8, projectedPayout: 0, base: 600, engagementBonus: 0, trustBonus: 0, penalties: -300, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 4, distanceKm: 1.2, withinRadius: true, ranking: 33, totalRankEntries: 36 },

  // ── Paid (10): sub-051 to sub-060 ───────────────────
  { idx: 51, campId: 'camp-001', creatorId: 'creator-010', status: 'paid', verificationStage: 'completed', daysBack: 25, views: 45000, likes: 2900, comments: 450, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 5, distanceKm: 0.2, withinRadius: true, ranking: 1, totalRankEntries: 38 },
  { idx: 52, campId: 'camp-003', creatorId: 'creator-012', status: 'paid', verificationStage: 'completed', daysBack: 22, views: 32000, likes: 2500, comments: 380, projectedPayout: 4800, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 6, distanceKm: 0.3, withinRadius: true, ranking: 1, totalRankEntries: 35 },
  { idx: 53, campId: 'camp-005', creatorId: 'creator-014', status: 'paid', verificationStage: 'completed', daysBack: 20, views: 28500, likes: 2300, comments: 340, projectedPayout: 4600, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 7, distanceKm: 0.4, withinRadius: true, ranking: 1, totalRankEntries: 37 },
  { idx: 54, campId: 'camp-007', creatorId: 'creator-016', status: 'paid', verificationStage: 'completed', daysBack: 28, views: 50000, likes: 2800, comments: 500, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 8, distanceKm: 0.1, withinRadius: true, ranking: 1, totalRankEntries: 40 },
  { idx: 55, campId: 'camp-009', creatorId: 'creator-018', status: 'paid', verificationStage: 'completed', daysBack: 24, views: 18000, likes: 1450, comments: 220, projectedPayout: 4200, base: 1400, engagementBonus: 1800, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 9, distanceKm: 0.5, withinRadius: true, ranking: 2, totalRankEntries: 34 },
  { idx: 56, campId: 'camp-011', creatorId: 'creator-020', status: 'paid', verificationStage: 'completed', daysBack: 26, views: 21000, likes: 1680, comments: 260, projectedPayout: 4500, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 0, distanceKm: 0.3, withinRadius: true, ranking: 1, totalRankEntries: 36 },
  { idx: 57, campId: 'camp-013', creatorId: 'creator-022', status: 'paid', verificationStage: 'completed', daysBack: 23, views: 14500, likes: 1160, comments: 175, projectedPayout: 4000, base: 1400, engagementBonus: 1800, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 1, distanceKm: 0.6, withinRadius: true, ranking: 2, totalRankEntries: 32 },
  { idx: 58, campId: 'camp-015', creatorId: 'creator-024', status: 'paid', verificationStage: 'completed', daysBack: 27, views: 38000, likes: 2600, comments: 410, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 2, distanceKm: 0.2, withinRadius: true, ranking: 1, totalRankEntries: 39 },
  { idx: 59, campId: 'camp-002', creatorId: 'creator-001', status: 'paid', verificationStage: 'completed', daysBack: 29, views: 25000, likes: 2000, comments: 310, projectedPayout: 4700, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: false, captionEdited: false, hasCheckIn: true, cityIdx: 3, distanceKm: 0.4, withinRadius: true, ranking: 1, totalRankEntries: 37 },
  { idx: 60, campId: 'camp-004', creatorId: 'creator-003', status: 'paid', verificationStage: 'completed', daysBack: 30, views: 41000, likes: 2700, comments: 430, projectedPayout: 5000, base: 1500, engagementBonus: 2000, trustBonus: 300, penalties: 0, billVerificationStatus: 'verified', hasFraudFlags: false, hasAdminNotes: true, captionEdited: false, hasCheckIn: true, cityIdx: 4, distanceKm: 0.3, withinRadius: true, ranking: 1, totalRankEntries: 40 },
];

// ─── Build submissions from seeds ──────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSubmission(seed: SubmissionSeed): any {
  const id = `sub-${String(seed.idx).padStart(3, '0')}`;
  const campName = campaignNames[seed.campId] ?? 'Unknown Campaign';
  const creator = creators[seed.creatorId] ?? { name: 'Unknown Creator', handle: '@unknown' };
  const submittedAt = daysAgo(seed.daysBack, seed.idx % 12);
  const unlockAt = hoursAfter(submittedAt, 72);
  const reelImportedAt = minutesBefore(submittedAt, 5 + (seed.idx % 30));
  const billNum = `BILL-2026-${String(10000 + seed.idx * 137).slice(0, 5)}`;
  const reelId = `mock_${String(seed.idx).padStart(5, '0')}${String(seed.idx * 7 + 31).padStart(3, '0')}`;
  const location = cityLocations[seed.cityIdx];
  const captionText = captions[(seed.idx - 1) % captions.length];

  // Build required hashtags for the campaign
  const campHashtags = ['#TryTheMenu'];
  const campNameTag = campName.split(' ')[0];
  campHashtags.push(`#${campNameTag}`);
  campHashtags.push('#FoodReview');

  const hashtagsMatched = seed.status === 'rejected' && seed.idx % 3 === 0
    ? ['#TryTheMenu']
    : [...campHashtags];

  const hashtagsMissing = seed.status === 'rejected' && seed.idx % 3 === 0
    ? ['#FoodReview', `#${campNameTag}`]
    : [];

  // Caption editing
  const captionAtSubmission = captionText;
  const captionCurrent = seed.captionEdited
    ? captionText.replace(/#TryTheMenu\s?/, '').trim()
    : captionText;

  // Views progression for metricsTimeline
  const t0Views = Math.round(seed.views * 0.08);
  const h24Views = Math.round(seed.views * 0.45);
  const h72Views = seed.views;
  const t0Likes = Math.round(seed.likes * 0.05);
  const h24Likes = Math.round(seed.likes * 0.4);
  const t0Comments = Math.round(seed.comments * 0.04);
  const h24Comments = Math.round(seed.comments * 0.35);

  const t0Timestamp = submittedAt;
  const h24Timestamp = hoursAfter(submittedAt, 24);
  const h72Timestamp = hoursAfter(submittedAt, 72);

  // Stage timestamps
  const stageTimestamps: Record<string, string> = {
    t0: t0Timestamp,
  };
  if (seed.verificationStage === 'h24' || seed.verificationStage === 'h72' || seed.verificationStage === 'completed') {
    stageTimestamps.h24 = h24Timestamp;
  }
  if (seed.verificationStage === 'h72' || seed.verificationStage === 'completed') {
    stageTimestamps.h72 = h72Timestamp;
  }
  if (seed.verificationStage === 'completed') {
    stageTimestamps.completed = hoursAfter(submittedAt, 74);
  }

  // Rank history
  const rankHistory: Array<{ stage: string; rank: number; timestamp: string }> = [
    { stage: 'T0', rank: seed.ranking + 3 > seed.totalRankEntries ? seed.ranking : seed.ranking + 3, timestamp: t0Timestamp },
  ];
  if (stageTimestamps.h24) {
    rankHistory.push({ stage: '24h', rank: seed.ranking + 1 > seed.totalRankEntries ? seed.ranking : seed.ranking + 1, timestamp: h24Timestamp });
  }
  if (stageTimestamps.h72) {
    rankHistory.push({ stage: '72h', rank: seed.ranking, timestamp: h72Timestamp });
  }

  // Fraud flags
  const fraudFlags: string[] = [];
  if (seed.hasFraudFlags) {
    if (seed.captionEdited) fraudFlags.push('Caption edited after submission — #TryTheMenu removed');
    if (!seed.withinRadius) fraudFlags.push('GPS check-in outside campaign radius');
    if (seed.billVerificationStatus === 'rejected') fraudFlags.push('Bill verification failed — possible duplicate or unreadable');
    if (seed.views < 1000 && seed.likes < 40) fraudFlags.push('Abnormally low engagement rate detected');
    if (fraudFlags.length === 0) fraudFlags.push('Suspicious engagement pattern detected');
  }

  // Admin notes
  const adminNotes: Array<{ adminId: string; adminName: string; note: string; timestamp: string }> = [];
  if (seed.hasAdminNotes) {
    const adminPool = [
      { id: 'admin-001', name: 'Vikram Singh' },
      { id: 'admin-002', name: 'Sneha Patil' },
      { id: 'admin-003', name: 'Rahul Mehta' },
    ];
    const admin = adminPool[seed.idx % 3];

    if (seed.status === 'rejected') {
      adminNotes.push({
        adminId: admin.id,
        adminName: admin.name,
        note: seed.hasFraudFlags
          ? 'Reviewed and flagged for fraud. Multiple trust signals failed. Rejecting submission.'
          : 'Content does not meet campaign guidelines. Insufficient brand visibility in the reel.',
        timestamp: hoursAfter(submittedAt, 48 + (seed.idx % 12)),
      });
    } else if (seed.status === 'paid') {
      adminNotes.push({
        adminId: admin.id,
        adminName: admin.name,
        note: 'Excellent content quality. High engagement metrics verified. Approved for payout.',
        timestamp: hoursAfter(submittedAt, 76),
      });
    } else if (seed.status === 'approved') {
      adminNotes.push({
        adminId: admin.id,
        adminName: admin.name,
        note: 'All verification checks passed. Content quality is good. Approved.',
        timestamp: hoursAfter(submittedAt, 74 + (seed.idx % 8)),
      });
    } else {
      // pending with notes
      adminNotes.push({
        adminId: admin.id,
        adminName: admin.name,
        note: seed.hasFraudFlags
          ? 'Flagged for review — GPS mismatch detected. Awaiting manual verification.'
          : 'High view count, monitoring for 72h window completion.',
        timestamp: hoursAfter(submittedAt, 12 + (seed.idx % 6)),
      });
    }
  }

  // Trust signals
  const trustSignals: Record<string, boolean> = {
    gpsVerified: seed.withinRadius && seed.hasCheckIn,
    billVerified: seed.billVerificationStatus === 'verified',
    postDeleted: false,
    captionEdited: seed.captionEdited,
    lowEngagement: seed.views < 1000 && seed.likes < 40,
  };

  // Payout breakdown
  const payoutTotal = seed.status === 'rejected'
    ? 0
    : seed.base + seed.engagementBonus + seed.trustBonus + seed.penalties;

  const payoutBreakdown: Record<string, number> = {
    base: seed.base,
    engagementBonus: seed.engagementBonus,
    trustBonus: seed.trustBonus,
    penalties: seed.penalties,
    total: payoutTotal,
  };

  // Check-in location
  const checkInLocation = seed.hasCheckIn
    ? {
        latitude: location.lat + (seed.idx % 7) * 0.001 - 0.003,
        longitude: location.lng + (seed.idx % 5) * 0.001 - 0.002,
        timestamp: minutesBefore(submittedAt, 60 + (seed.idx % 45)),
        distanceFromCampaign: seed.distanceKm,
        withinRadius: seed.withinRadius,
      }
    : undefined;

  // Rejection reason
  const rejectionReason = seed.status === 'rejected'
    ? seed.hasFraudFlags
      ? 'Submission failed fraud verification checks. Trust signals indicate potential policy violation.'
      : 'Content does not meet the minimum campaign requirements.'
    : undefined;

  // Reviewed fields for non-pending
  const reviewedBy = seed.status !== 'pending'
    ? ['Vikram Singh', 'Sneha Patil', 'Rahul Mehta'][seed.idx % 3]
    : undefined;
  const reviewedAt = seed.status !== 'pending'
    ? hoursAfter(submittedAt, 74 + (seed.idx % 10))
    : undefined;

  // Final payout for paid
  const finalPayout = seed.status === 'paid' ? payoutTotal : undefined;

  // Bill rejection reason
  const billRejectionReason = seed.billVerificationStatus === 'rejected'
    ? 'Bill image is blurry or does not match the campaign restaurant.'
    : undefined;

  return {
    id,
    campaignId: seed.campId,
    campaignName: campName,
    campaignLogo: '',
    creatorId: seed.creatorId,
    creatorName: creator.name,
    creatorHandle: creator.handle,
    creatorAvatar: '',
    reelUrl: `https://instagram.com/reel/${reelId}`,
    reelThumbnail: '',
    caption: captionText,
    billNumber: billNum,
    billImageUrl: '',
    submittedAt,
    unlockAt,
    status: seed.status,
    verificationStage: seed.verificationStage,
    ranking: seed.ranking,
    totalRankEntries: seed.totalRankEntries,
    projectedPayout: seed.projectedPayout,
    finalPayout,
    metricsCurrent: {
      views: seed.views,
      likes: seed.likes,
      comments: seed.comments,
    },
    metricsTimeline: [
      { label: 'T0', timestamp: t0Timestamp, views: t0Views, likes: t0Likes, comments: t0Comments },
      { label: '24h', timestamp: h24Timestamp, views: h24Views, likes: h24Likes, comments: h24Comments },
      { label: '72h', timestamp: h72Timestamp, views: h72Views, likes: seed.likes, comments: seed.comments },
    ],
    payoutBreakdown,
    trustSignals,
    fraudFlags,
    adminNotes,
    reviewedBy,
    reviewedAt,
    rejectionReason,
    checkInLocation,
    captionAtSubmission,
    captionCurrent,
    hashtagsMatched,
    hashtagsMissing,
    reelImportedAt,
    billVerificationStatus: seed.billVerificationStatus,
    billRejectionReason,
    stageTimestamps,
    rankHistory,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MOCK_SUBMISSIONS: any[] = seeds.map(buildSubmission);
