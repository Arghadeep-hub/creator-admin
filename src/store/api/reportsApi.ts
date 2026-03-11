import { baseApi } from './baseApi'

// ─── Report Types ──────────────────────────────────────────────────────────

export interface ReportQueryParams {
  period?: '7d' | '30d' | '90d'
  city?: string
}

export interface CreatorsReport {
  kpis: {
    totalCreators: number
    newThisMonth: number
    growthRate: number
    activeRate: number
    avgTrustScore: number
    kycVerifiedRate: number
  }
  growthChart: Array<{ week: string; count: number }>
  cityBreakdown: Array<{ city: string; count: number }>
  activationFunnel: {
    registered: number
    instagramConnected: number
    kycSubmitted: number
    kycVerified: number
    firstSubmission: number
  }
  totalCreators: number
  newCreators: number
  kycVerified: number
  activeCreators: number
  avgTrustScore: number
  byCity: Array<{ city: string; count: number }>
  growthByMonth: Array<{ month: string; total: number; new: number }>
  kycDistribution: Array<{ status: string; count: number }>
}

export interface SubmissionsReport {
  kpis: {
    total: number
    approvalRate: number
    avgProcessingHours: number
    fraudRate: number
  }
  weeklyChart: Array<{ week: string; submissions: number; approved: number; rejected: number }>
  totalSubmissions: number
  approvedSubmissions: number
  rejectedSubmissions: number
  approvalRate: number
  byCampaign: Array<{ campaignName: string; submissions: number; approved: number }>
  volumeByDay: Array<{ date: string; submitted: number; approved: number; rejected: number }>
}

export interface RevenueReport {
  kpis: {
    totalDisbursed: number
    avgPayoutPerSubmission: number
    poolHealth: number
    pendingPayouts: number
  }
  dailyPayoutsChart: Array<{ date: string; amount: number }>
  campaignPayouts: Array<{ campaignId: string; campaignName: string; totalPaid: number }>
  totalPaidOut: number
  avgPayoutPerCreator: number
  totalLocked: number
  byMonth: Array<{ month: string; payouts: number }>
}

export interface FraudReport {
  kpis: {
    totalFlagged: number
    autoRejected: number
    fraudRate: number
    avgTrustScore: number
  }
  trendChart: Array<{ week: string; flagged: number }>
  breakdownByType: Array<{ type: string; count: number }>
  fraudRatePercent: number
  totalFraudFlags: number
  byType: Array<{ type: string; count: number }>
  trendByDay: Array<{ date: string; flagged: number }>
}

export interface KycReport {
  pending: number
  verified: number
  rejected: number
  pieData: Array<{ label: string; value: number; color: string }>
  totalVerified: number
}

// ─── Reports API ──────────────────────────────────────────────────────────

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorsReport: builder.query<CreatorsReport, ReportQueryParams>({
      query: (params) => ({ url: '/reports/creators', params }),
      transformResponse: (raw: { data: CreatorsReport }) => raw.data,
      providesTags: ['Reports'],
    }),

    getSubmissionsReport: builder.query<SubmissionsReport, ReportQueryParams>({
      query: (params) => ({ url: '/reports/submissions', params }),
      transformResponse: (raw: { data: SubmissionsReport }) => raw.data,
      providesTags: ['Reports'],
    }),

    getRevenueReport: builder.query<RevenueReport, ReportQueryParams>({
      query: (params) => ({ url: '/reports/revenue', params }),
      transformResponse: (raw: { data: RevenueReport }) => raw.data,
      providesTags: ['Reports'],
    }),

    getFraudReport: builder.query<FraudReport, ReportQueryParams>({
      query: (params) => ({ url: '/reports/fraud', params }),
      transformResponse: (raw: { data: FraudReport }) => raw.data,
      providesTags: ['Reports'],
    }),

    getKycReport: builder.query<KycReport, ReportQueryParams>({
      query: (params) => ({ url: '/reports/kyc', params }),
      transformResponse: (raw: { data: KycReport }) => raw.data,
      providesTags: ['Reports'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCreatorsReportQuery,
  useGetSubmissionsReportQuery,
  useGetRevenueReportQuery,
  useGetFraudReportQuery,
  useGetKycReportQuery,
} = reportsApi
