import type { Dispatch, SetStateAction } from 'react'
import { memo, useState } from 'react'
import { ClipboardList, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  rules: string[]
  setRules: Dispatch<SetStateAction<string[]>>
}

export const RulesCard = memo(function RulesCard({ rules, setRules }: Props) {
  const [newRule, setNewRule] = useState('')

  function add() {
    if (!newRule.trim()) return
    setRules(r => [...r, newRule.trim()])
    setNewRule('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <ClipboardList className="h-3.5 w-3.5 text-amber-600" />
          </div>
          Campaign Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rules.length > 0 ? (
          <div className="space-y-2">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <Input
                  value={rule}
                  onChange={e => setRules(r => r.map((x, idx) => (idx === i ? e.target.value : x)))}
                  className="border-0 bg-transparent shadow-none px-0 focus-visible:ring-0"
                />
                <button
                  onClick={() => setRules(r => r.filter((_, idx) => idx !== i))}
                  className="flex items-center justify-center h-9 w-9 sm:h-8 sm:w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 py-5 text-center">
            <p className="text-xs text-slate-400">No rules added yet</p>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newRule}
            onChange={e => setNewRule(e.target.value)}
            placeholder="Add a rule..."
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <Button variant="outline" onClick={add} className="rounded-xl shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})
