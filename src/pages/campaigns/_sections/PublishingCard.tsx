import { memo, useMemo } from 'react'
import { AlertTriangle, Info, Send, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'isActive' | 'deadline'>
  set: SetField
}

export const PublishingCard = memo(function PublishingCard({ form, set }: Props) {
  const deadlineInfo = useMemo(() => {
    if (!form.deadline) return null
    const deadlineDate = new Date(form.deadline + 'T23:59:59')
    const now = new Date()
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return { diffDays, isPast: diffDays < 0, isToday: diffDays === 0, isSoon: diffDays > 0 && diffDays <= 3 }
  }, [form.deadline])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
            <Send className="h-3.5 w-3.5 text-blue-600" />
          </div>
          Publishing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              className={`relative w-full h-12 sm:h-10 rounded-xl sm:rounded-lg border px-4 sm:px-3 text-sm font-medium text-left transition-all cursor-pointer flex items-center gap-3 ${
                form.isActive
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <span
                className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
                  form.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    form.isActive ? 'translate-x-4.5' : 'translate-x-0.75'
                  }`}
                />
              </span>
              <span className="truncate">
                {form.isActive ? 'Active' : 'Inactive'}
              </span>
            </button>
          </div>
          <div className="space-y-1.5">
            <Label>Deadline <span className="text-red-500">*</span></Label>
            <Input
              type="date"
              value={form.deadline}
              onChange={e => set('deadline', e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="h-12 sm:h-10 text-base sm:text-sm"
            />
            {/* Deadline countdown */}
            {deadlineInfo && (
              <div className={`flex items-center gap-1.5 text-[11px] font-medium mt-1 ${
                deadlineInfo.isPast
                  ? 'text-red-600'
                  : deadlineInfo.isSoon
                    ? 'text-amber-600'
                    : 'text-slate-500'
              }`}>
                <Clock className="h-3 w-3" />
                {deadlineInfo.isPast
                  ? `Expired ${Math.abs(deadlineInfo.diffDays)} day${Math.abs(deadlineInfo.diffDays) !== 1 ? 's' : ''} ago`
                  : deadlineInfo.isToday
                    ? 'Expires today'
                    : `${deadlineInfo.diffDays} day${deadlineInfo.diffDays !== 1 ? 's' : ''} remaining`
                }
              </div>
            )}
          </div>
        </div>

        {/* Past deadline warning */}
        {deadlineInfo?.isPast && (
          <div className="flex items-start sm:items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              The deadline is in the past. Creators will not be able to sign up. Update the deadline or set the campaign to inactive.
            </span>
          </div>
        )}

        <div className="flex items-start sm:items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2.5 text-xs text-blue-700">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Inactive</strong> campaigns won't appear in creator feeds. Toggle to{' '}
            <strong>Active</strong> to make them discoverable.
          </span>
        </div>
      </CardContent>
    </Card>
  )
})
