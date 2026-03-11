import { baseApi } from './baseApi'
import type { AuditLogEntry } from '../../types'
import type { PaginatedResponse } from './adminUsersApi'

// ─── Request / Response Types ──────────────────────────────────────────────

export interface GetAuditLogParams {
  page?: number
  limit?: number
  adminId?: string
  category?: AuditLogEntry['category']
  severity?: AuditLogEntry['severity']
  action?: string
  dateFrom?: string
  dateTo?: string
  targetType?: string
  targetId?: string
}

// ─── Audit Log API ────────────────────────────────────────────────────────

export const auditLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLog: builder.query<PaginatedResponse<AuditLogEntry>, GetAuditLogParams>({
      query: (params) => ({
        url: '/audit-log',
        params,
      }),
      providesTags: ['AuditLog'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetAuditLogQuery } = auditLogApi
