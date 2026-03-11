import { memo, useMemo } from 'react'
import { Send, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { cn, formatCurrency } from '@/lib/utils'
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
  const totalAmount = useMemo(
    () => confirmRelease?.txns.reduce((s, t) => s + t.amount, 0) ?? 0,
    [confirmRelease],
  )

  const poolAfter = pool.balance - totalAmount
  const usagePercent = pool.balance > 0 ? (totalAmount / pool.balance) * 100 : 0
  const isHighUsage = usagePercent > 80

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
              {/* Amount summary card */}
              <div className="relative overflow-hidden bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-primary to-primary/80" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total amount</span>
                  <span className="font-black num-font text-2xl text-primary">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payouts</span>
                  <span className="font-bold">{confirmRelease.txns.length}</span>
                </div>

                {/* Pool balance impact (release only) */}
                {confirmRelease.type === 'release' && (
                  <>
                    <div className="h-px bg-slate-200" />
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pool Balance Impact</p>
                      <div className="flex items-center gap-2 justify-between">
                        <div className="text-center flex-1">
                          <p className="text-[10px] text-muted-foreground mb-0.5">Before</p>
                          <p className="font-bold num-font text-sm">{formatCurrency(pool.balance)}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="text-center flex-1">
                          <p className="text-[10px] text-muted-foreground mb-0.5">After</p>
                          <p className={cn(
                            'font-bold num-font text-sm',
                            poolAfter >= 0 ? 'text-emerald-600' : 'text-red-600',
                          )}>
                            {formatCurrency(poolAfter)}
                          </p>
                        </div>
                      </div>
                      {/* Usage bar */}
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isHighUsage ? 'bg-amber-500' : 'bg-emerald-500',
                          )}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground text-right">
                        {usagePercent.toFixed(0)}% of pool balance
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* High usage warning */}
              {confirmRelease.type === 'release' && isHighUsage && (
                <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200/60 p-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">High pool usage warning</p>
                    <p className="text-[11px] text-amber-700/80 mt-0.5">
                      This release uses {usagePercent.toFixed(0)}% of available pool funds. Consider adding more funds soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Creator breakdown */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 -mx-1 px-1">
                {confirmRelease.txns.slice(0, 5).map(txn => (
                  <div key={txn.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-100 hover:bg-slate-50/50 transition-colors duration-150">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={txn.creatorName ?? 'Unknown'} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate leading-tight">{txn.creatorName ?? 'Unknown'}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{txn.upiId ?? ''}</p>
                      </div>
                    </div>
                    <p className="font-bold num-font text-sm shrink-0 ml-2">{formatCurrency(txn.amount)}</p>
                  </div>
                ))}
                {confirmRelease.txns.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground py-1">+ {confirmRelease.txns.length - 5} more</p>
                )}
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={onCancel} className="rounded-xl w-full sm:w-auto">Cancel</Button>
              <Button
                variant={confirmRelease.type === 'retry' ? 'warning' : 'default'}
                onClick={onConfirm}
                className="rounded-xl active:scale-[0.98] w-full sm:w-auto"
              >
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
