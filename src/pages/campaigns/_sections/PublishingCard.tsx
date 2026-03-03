import { memo } from 'react'
import { Info, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STATUSES } from './types'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'status' | 'deadline'>
  set: SetField
}

export const PublishingCard = memo(function PublishingCard({ form, set }: Props) {
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
            <Select
              value={form.status}
              onValueChange={v => set('status', v)}
              options={STATUSES}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Deadline <span className="text-red-500">*</span></Label>
            <Input
              type="date"
              value={form.deadline}
              onChange={e => set('deadline', e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>
        <div className="flex items-start sm:items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2.5 text-xs text-blue-700">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            Campaigns set to <strong>Draft</strong> won't appear in creator feeds. Switch to{' '}
            <strong>Active</strong> to make them discoverable.
          </span>
        </div>
      </CardContent>
    </Card>
  )
})
