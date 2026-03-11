import { useState, useMemo } from 'react'
import { Search, Download, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PageLoader } from '@/components/ui/PageLoader'
import { useAuth } from '@/contexts/AuthContext'
import { Shield } from 'lucide-react'
import { getRelativeTime } from '@/lib/utils'
import { useGetAuditLogQuery } from '@/store/api/auditLogApi'
import type { AuditLogEntry } from '@/types'

const SEVERITY_CONFIG: Record<string, { icon: typeof Info; color: string; bg: string; label: string }> = {
  INFO:     { icon: Info,          color: 'text-blue-500',  bg: 'bg-blue-50',  label: 'Info' },
  WARNING:  { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Warning' },
  CRITICAL: { icon: AlertCircle,   color: 'text-red-500',   bg: 'bg-red-50',   label: 'Critical' },
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'AUTH', label: 'Auth' },
  { value: 'SUBMISSION', label: 'Submission' },
  { value: 'CAMPAIGN', label: 'Campaign' },
  { value: 'CREATOR', label: 'Creator' },
  { value: 'PAYOUT', label: 'Payout' },
  { value: 'SETTINGS', label: 'Settings' },
  { value: 'ADMIN_MGMT', label: 'Admin Mgmt' },
]

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severity' },
  { value: 'INFO', label: 'Info' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'CRITICAL', label: 'Critical' },
]

export function AuditLogPage() {
  const { session } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState('')

  const { data: auditLogData, isLoading, refetch } = useGetAuditLogQuery({
    page: 1,
    limit: 200,
    category: category ? (category as AuditLogEntry['category']) : undefined,
    severity: severity ? (severity as AuditLogEntry['severity']) : undefined,
  })

  const allEntries = auditLogData?.data ?? []

  const filtered = useMemo(() => {
    if (!search) return allEntries
    const q = search.toLowerCase()
    return allEntries.filter(entry =>
      entry.action.toLowerCase().includes(q) || entry.adminName.toLowerCase().includes(q)
    )
  }, [allEntries, search])

  if (session?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-600">Super Admin access required</p>
        </div>
      </div>
    )
  }

  if (isLoading) return <PageLoader />

  const severityCounts: Record<string, number> = {
    CRITICAL: allEntries.filter(e => e.severity === 'CRITICAL').length,
    WARNING:  allEntries.filter(e => e.severity === 'WARNING').length,
    INFO:     allEntries.filter(e => e.severity === 'INFO').length,
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Audit Log" subtitle={`${allEntries.length} entries`}>
        <Button variant="outline" size="sm"><Download className="h-4 w-4" />Export</Button>
      </PageHeader>

      {/* Severity Summary */}
      <div className="grid grid-cols-3 gap-3">
        {(['CRITICAL', 'WARNING', 'INFO'] as const).map(s => {
          const cfg = SEVERITY_CONFIG[s]
          const Icon = cfg.icon
          return (
            <button
              key={s}
              onClick={() => setSeverity(severity === s ? '' : s)}
              className={`admin-card p-3 flex items-center gap-3 text-left cursor-pointer hover:shadow-md transition-shadow ${severity === s ? 'ring-2 ring-primary/30' : ''}`}
            >
              <div className={`p-2 rounded-lg ${cfg.bg}`}>
                <Icon className={`h-4 w-4 ${cfg.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground capitalize">{s}</p>
                <p className="text-xl font-bold num-font">{severityCounts[s]}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search actions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory} options={CATEGORY_OPTIONS} className="w-44" />
        <Select value={severity} onValueChange={setSeverity} options={SEVERITY_OPTIONS} className="w-36" />
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} entries</p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No entries found"
          actionLabel="Clear Filters"
          onAction={() => { setSearch(''); setCategory(''); setSeverity(''); refetch() }}
        />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Severity', 'Action', 'Admin', 'Category', 'IP', 'Time'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(entry => {
                  const cfg = SEVERITY_CONFIG[entry.severity] ?? SEVERITY_CONFIG['INFO']
                  const Icon = cfg.icon
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${cfg.bg}`}>
                          <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium max-w-xs truncate">{entry.action}</p>
                        {entry.targetName && (
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.targetName}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={entry.adminName} size="sm" />
                          <div>
                            <p className="font-medium text-xs">{entry.adminName}</p>
                            <RoleBadge role={entry.adminRole} className="text-[10px]" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="gray" className="text-xs capitalize">{entry.category.replace('_', ' ')}</Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{entry.ipAddress}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">{getRelativeTime(entry.timestamp)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
