import { memo } from 'react'
import { Send, RefreshCw } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import type { PayoutTransaction, PoolSummary } from '@/types'

interface ReleaseConfirmDialogProps {
  confirmRelease: { txns: PayoutTransaction[]; type: 'release' | 'retry' } | null
  pool: PoolSummary
  onConfirm: () => void
  onCancel: () => void
}

export const ReleaseConfirmDialog = memo(function ReleaseConfirmDialog({
  confirmRelease,
  pool,
  onConfirm,
  onCancel,
}: ReleaseConfirmDialogProps) {
  return (
    <Dialog open={!!confirmRelease} onOpenChange={open => { if (!open) onCancel() }}>
      <DialogContent onClose={onCancel} className="max-w-md">
        {confirmRelease && (
          <>
            <DialogHeader>
              <DialogTitle>
                {confirmRelease.type === 'release'
                  ? `Release ${confirmRelease.txns.length} Payout${confirmRelease.txns.length > 1 ? 's' : ''}`
                  : `Retry ${confirmRelease.txns.length} Failed Payout${confirmRelease.txns.length > 1 ? 's' : ''}`}
              </DialogTitle>
              <DialogDescription>
                {confirmRelease.type === 'release'
                  ? 'Funds transfer directly to creator UPI accounts. This cannot be undone.'
                  : 'Re-attempts failed transactions using the original payment method.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 my-2">
              <div className="relative overflow-hidden bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-primary to-primary/80" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total amount</span>
                  <span className="font-black num-font text-2xl text-primary">
                    {formatCurrency(confirmRelease.txns.reduce((s, t) => s + t.amount, 0))}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payouts</span>
                  <span className="font-bold">{confirmRelease.txns.length}</span>
                </div>
                {confirmRelease.type === 'release' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pool after</span>
                    <span className="font-bold num-font text-emerald-600">
                      {formatCurrency(pool.balance - confirmRelease.txns.reduce((s, t) => s + t.amount, 0))}
                    </span>
                  </div>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5">
                {confirmRelease.txns.slice(0, 5).map(txn => (
                  <div key={txn.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-100 hover:bg-slate-50/50 transition-colors duration-150">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={txn.creatorName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate leading-tight">{txn.creatorName}</p>
                        <p className="text-[11px] text-muted-foreground">{txn.upiId}</p>
                      </div>
                    </div>
                    <p className="font-bold num-font text-sm shrink-0">{formatCurrency(txn.amount)}</p>
                  </div>
                ))}
                {confirmRelease.txns.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground py-1">+ {confirmRelease.txns.length - 5} more</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onCancel} className="rounded-xl">Cancel</Button>
              <Button variant={confirmRelease.type === 'retry' ? 'warning' : 'default'} onClick={onConfirm} className="rounded-xl active:scale-[0.98]">
                {confirmRelease.type === 'release'
                  ? <><Send className="h-4 w-4" />Confirm Release</>
                  : <><RefreshCw className="h-4 w-4" />Confirm Retry</>}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
})
