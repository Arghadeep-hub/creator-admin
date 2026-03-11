import { memo } from 'react'
import { Briefcase } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CATEGORIES, DIFFICULTIES } from './types'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'name' | 'restaurantName' | 'cuisine' | 'difficulty' | 'city' | 'address' | 'description'>
  set: SetField
}

export const BasicInfoCard = memo(function BasicInfoCard({ form, set }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
          </div>
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Campaign Name <span className="text-red-500">*</span></Label>
            <Input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Bombay Bistro Summer"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Business Name <span className="text-red-500">*</span></Label>
            <Input
              value={form.restaurantName}
              onChange={e => set('restaurantName', e.target.value)}
              placeholder="e.g. Bombay Bistro"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Category <span className="text-red-500">*</span></Label>
            <Select
              value={form.cuisine}
              onValueChange={v => set('cuisine', v)}
              options={CATEGORIES}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Difficulty</Label>
            <Select
              value={form.difficulty}
              onValueChange={v => set('difficulty', v)}
              options={DIFFICULTIES}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>City <span className="text-red-500">*</span></Label>
            <Input
              value={form.city}
              onChange={e => set('city', e.target.value)}
              placeholder="e.g. Mumbai"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder="Full street address"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Describe what creators should do, what makes this campaign unique, and what to expect during the visit..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  )
})
