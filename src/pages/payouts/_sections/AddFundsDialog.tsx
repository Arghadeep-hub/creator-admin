import { memo, useState, useCallback, useEffect } from 'react'
import { CreditCard, IndianRupee, Loader2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay'
import { useCreateDepositOrderMutation, useVerifyDepositPaymentMutation } from '@/store/api/payoutsApi'
import { useToast } from '@/contexts/ToastContext'
import type { PoolSummary } from '@/types'

interface AddFundsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pool: PoolSummary
  fundAmount: string
  fundDescription: string
  onFundAmountChange: (value: string) => void
  onFundDescriptionChange: (value: string) => void
  onSubmit?: () => void
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
  onSubmit: _onSubmit,
}: AddFundsDialogProps) {
  const { success, error: showError } = useToast()
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateDepositOrderMutation()
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyDepositPaymentMutation()
  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'verifying'>('input')

  const parsedAmount = parseFloat(fundAmount) || 0
  const isProcessing = isCreatingOrder || isVerifying || paymentStep !== 'input'

  // Preload Razorpay SDK when dialog opens
  useEffect(() => {
    if (open) {
      loadRazorpayScript().catch(() => {})
    }
  }, [open])

  // Reset step when dialog closes
  useEffect(() => {
    if (!open) setPaymentStep('input')
  }, [open])

  const handlePayWithRazorpay = useCallback(async () => {
    if (parsedAmount <= 0) return
    const description = fundDescription || 'Pool fund deposit'

    try {
      setPaymentStep('processing')

      // 1. Load Razorpay script
      await loadRazorpayScript()

      // 2. Create order on backend
      const order = await createOrder({ amount: parsedAmount, description }).unwrap()

      // 3. Open Razorpay Checkout
      openRazorpayCheckout({
        key: order.keyId,
        amount: order.amountInPaise,
        currency: order.currency,
        name: 'Creator Hub',
        description: `Pool Deposit: ${description}`,
        order_id: order.orderId,
        prefill: order.prefill,
        theme: { color: '#f97316' },
        handler: async (response) => {
          // 4. Verify payment on backend
          try {
            setPaymentStep('verifying')
            const result = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }).unwrap()

            success(
              `${formatCurrency(result.deposited)} added to pool`,
              `Payment ID: ${result.paymentId}`,
            )
            onFundAmountChange('')
            onFundDescriptionChange('')
            onOpenChange(false)
          } catch {
            showError('Payment verification failed. Contact support if money was deducted.')
          } finally {
            setPaymentStep('input')
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStep('input')
          },
        },
      })
    } catch {
      showError('Failed to initiate payment. Please try again.')
      setPaymentStep('input')
    }
  }, [parsedAmount, fundDescription, createOrder, verifyPayment, success, showError, onFundAmountChange, onFundDescriptionChange, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={isProcessing ? () => {} : onOpenChange}>
      <DialogContent onClose={isProcessing ? undefined : () => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Funds to Pool</DialogTitle>
          <DialogDescription>Pay via Razorpay to deposit money into the campaign pool.</DialogDescription>
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
              <Input
                type="number"
                placeholder="50000"
                value={fundAmount}
                onChange={e => onFundAmountChange(e.target.value)}
                className="pl-9 rounded-xl h-11"
                min={1}
                disabled={isProcessing}
              />
            </div>
            <div className="flex gap-2 mt-2">
              {QUICK_AMOUNTS.map(qa => (
                <button
                  key={qa.value}
                  type="button"
                  onClick={() => onFundAmountChange(String((parsedAmount || 0) + qa.value))}
                  disabled={isProcessing}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 hover:shadow-md hover:-translate-y-0.5 text-xs font-semibold text-slate-600 transition-all duration-200 active:scale-[0.96] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-1.5 block">Description</label>
            <Input
              placeholder="March campaign budget"
              value={fundDescription}
              onChange={e => onFundDescriptionChange(e.target.value)}
              className="rounded-xl h-11"
              disabled={isProcessing}
            />
          </div>
          {parsedAmount > 0 && (
            <div className="relative overflow-hidden bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-emerald-500 to-emerald-600" />
              <span className="text-sm text-emerald-700">New balance</span>
              <span className="font-black num-font text-emerald-700 text-lg">{formatCurrency(pool.balance + parsedAmount)}</span>
            </div>
          )}

          {/* Payment security note */}
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2">
            <Shield className="h-4 w-4 text-blue-500 shrink-0" />
            <p className="text-[11px] text-blue-700">Payments are processed securely via Razorpay. UPI, cards, and net banking accepted.</p>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl" disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handlePayWithRazorpay}
            disabled={parsedAmount <= 0 || isProcessing}
            className="rounded-xl active:scale-[0.98] gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {paymentStep === 'verifying' ? 'Verifying...' : 'Processing...'}
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Pay {parsedAmount > 0 ? formatCurrency(parsedAmount) : 'Now'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
