import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import type { MilestoneBadge } from '@/types'

interface BadgeEditorProps {
  badges: MilestoneBadge[]
  onToggle: (id: string, currentActive: boolean) => void
}

export default function BadgeEditor({ badges, onToggle }: BadgeEditorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {badges.map(badge => (
        <Card key={badge.id}>
          <CardContent className="p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">{badge.label}</p>
              </div>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span>Criteria: {badge.unlockCriteria?.replace(/_/g, ' ') ?? '—'}</span>
                <span>Threshold: {badge.thresholdValue ?? '—'}</span>
                {badge.rewardMultiplier && <span>+{((badge.rewardMultiplier - 1) * 100).toFixed(0)}% bonus</span>}
              </div>
            </div>
            <Switch
              checked={badge.isActive}
              onCheckedChange={() => onToggle(badge.id, badge.isActive)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
