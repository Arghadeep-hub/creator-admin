import { memo } from 'react'
import { IndianRupee, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import type { PoolSummary } from '@/types'

interface AddFundsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pool: PoolSummary
  fundAmount: string
  fundDescription: string
  onFundAmountChange: (value: string) => void
  onFundDescriptionChange: (value: string) => void
  onSubmit: () => void
}

const QUICK_AMOUNTS = [
  { label: '+50K', value: 50000 },
  { label: '+1L', value: 100000 },
  { label: '+5L', value: 500000 },
]

export const AddFundsDialog = memo(function AddFundsDialog({
  open,
  onOpenChange,
  pool,
  fundAmount,
  fundDescription,
  onFundAmountChange,
  onFundDescriptionChange,
  onSubmit,
}: AddFundsDialogProps) {
  const parsedAmount = parseFloat(fundAmount) || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Funds to Pool</DialogTitle>
          <DialogDescription>Deposit money into the campaign pool. Super Admins will release funds to creators.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-2">
          <div className="relative overflow-hidden bg-linear-to-r from-slate-50 to-slate-100/50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
            <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-slate-400 to-slate-500" />
            <span className="text-sm text-muted-foreground">Current balance</span>
            <span className="font-black num-font text-2xl">{formatCurrency(pool.balance)}</span>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-1.5 block">Amount (INR)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="number" placeholder="50000" value={fundAmount} onChange={e => onFundAmountChange(e.target.value)} className="pl-9 rounded-xl h-11" min={1} />
            </div>
            <div className="flex gap-2 mt-2">
              {QUICK_AMOUNTS.map(qa => (
                <button
                  key={qa.value}
                  type="button"
                  onClick={() => onFundAmountChange(String((parsedAmount || 0) + qa.value))}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 hover:shadow-md hover:-translate-y-0.5 text-xs font-semibold text-slate-600 transition-all duration-200 active:scale-[0.96] cursor-pointer shadow-sm"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-1.5 block">Description</label>
            <Input placeholder="March campaign budget" value={fundDescription} onChange={e => onFundDescriptionChange(e.target.value)} className="rounded-xl h-11" />
          </div>
          {parsedAmount > 0 && (
            <div className="relative overflow-hidden bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-emerald-500 to-emerald-600" />
              <span className="text-sm text-emerald-700">New balance</span>
              <span className="font-black num-font text-emerald-700 text-lg">{formatCurrency(pool.balance + parsedAmount)}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
          <Button onClick={onSubmit} disabled={parsedAmount <= 0} className="rounded-xl active:scale-[0.98]">
            <Plus className="h-4 w-4" />Add {parsedAmount > 0 ? formatCurrency(parsedAmount) : 'Funds'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
