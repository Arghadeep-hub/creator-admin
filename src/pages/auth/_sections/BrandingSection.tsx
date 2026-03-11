import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'

const operationsMetrics = [
  { icon: Users, value: '2,437', label: 'Active creators under review' },
  { icon: Wallet, value: '₹12.8L', label: 'Monthly payouts supervised' },
  { icon: Zap, value: '48', label: 'Campaigns live this week' },
]

const operationHighlights = [
  'Moderate creator submissions and trust flags from a single review queue.',
  'Approve payouts with role checks, maker-checker controls, and full timestamps.',
  'Track campaign velocity with daily trends, city splits, and fraud indicators.',
]

const trustPillars = ['Role-based permissions', 'Immutable admin audit log', 'Session and device monitoring']

export function BrandingSection() {
  return (
    <section className="space-y-7 text-white lg:pr-4">
      <div className="flex items-center gap-3">
        <BrandLogo className="h-10 w-auto brightness-0 invert" alt="TryTheMenu" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Creator Admin Workspace</p>
          <p className="text-xs text-white/45">Operations and payout governance</p>
        </div>
      </div>

      <p className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/45 bg-orange-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-100 backdrop-blur-sm">
        <Sparkles className="h-3.5 w-3.5" />
        Platform Control Tower
      </p>

      <div>
        <h1 className="font-display text-3xl leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3.15rem]">
          Keep campaigns, trust checks, and payouts in one secure admin command center.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Sign in to manage campaign performance, protect payout integrity, and preserve complete accountability for every admin action.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {operationsMetrics.map(stat => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/12 bg-white/6 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
          >
            <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/14 text-orange-200">
              <stat.icon className="h-4 w-4" />
            </span>
            <p className="num-font text-xl font-bold tabular-nums text-white">{stat.value}</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">{stat.label}</p>
          </article>
        ))}
      </div>

      <ul className="space-y-2.5">
        {operationHighlights.map(point => (
          <li
            key={point}
            className="flex items-start gap-3 rounded-xl border border-white/12 bg-white/6 px-3.5 py-3 text-sm leading-6 text-slate-200 backdrop-blur-sm"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/18">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
            </span>
            {point}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2.5">
        {trustPillars.map(item => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/12 px-3 py-1.5 text-xs font-semibold text-emerald-100"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
