import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  rules: string[]
  setRules: Dispatch<SetStateAction<string[]>>
}

export function RulesCard({ rules, setRules }: Props) {
  const [newRule, setNewRule] = useState('')

  function add() {
    if (!newRule.trim()) return
    setRules(r => [...r, newRule.trim()])
    setNewRule('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rules.map((rule, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {i + 1}
            </span>
            <Input
              value={rule}
              onChange={e => setRules(r => r.map((x, idx) => (idx === i ? e.target.value : x)))}
            />
            <button
              onClick={() => setRules(r => r.filter((_, idx) => idx !== i))}
              className="text-slate-400 hover:text-red-500 cursor-pointer shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={newRule}
            onChange={e => setNewRule(e.target.value)}
            placeholder="Add a rule..."
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <Button variant="outline" onClick={add}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
