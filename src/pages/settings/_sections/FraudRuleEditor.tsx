import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import type { FraudRule } from '@/types'

interface FraudRuleEditorProps {
  fraudRules: FraudRule[]
  onToggle: (id: string, currentActive: boolean) => void
}

export default function FraudRuleEditor({ fraudRules, onToggle }: FraudRuleEditorProps) {
  return (
    <div className="space-y-3">
      {fraudRules.map(rule => (
        <Card key={rule.id}>
          <CardContent className="p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">{rule.name}</p>
                <Badge
                  variant={rule.severity === 'AUTO_REJECT' || rule.severity === 'CRITICAL' ? 'error' : 'warning'}
                  className="text-xs"
                >
                  {rule.severity}
                </Badge>
                <Badge variant="gray" className="text-xs">{rule.penaltyPercent}% penalty</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{rule.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Triggered {rule.timesTriggered} times
                {rule.lastTriggeredAt && ` · Last: ${new Date(rule.lastTriggeredAt).toLocaleDateString('en-IN')}`}
              </p>
            </div>
            <Switch
              checked={rule.isActive}
              onCheckedChange={() => onToggle(rule.id, rule.isActive)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
