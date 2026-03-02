import { useState } from 'react'
import { Download, TrendingUp, Users, Megaphone, AlertTriangle, BarChart3, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'
import {
  CREATOR_GROWTH_DATA, SUBMISSION_WEEKLY_DATA, DAILY_PAYOUTS_DATA,
  SUCCESS_RATE_BY_CATEGORY, TRUST_SCORE_DISTRIBUTION, KYC_DISTRIBUTION,
  CAMPAIGNS_BY_CITY, FRAUD_TREND_DATA, FRAUD_TYPE_BREAKDOWN, ACTIVATION_FUNNEL_DATA
} from '@/data/chart-data'

const chartMargin = { top: 4, right: 4, bottom: 0, left: -10 }
const tooltipStyle = { fontSize: 12, borderRadius: 8 }
const tickProps = { fontSize: 10, fill: '#64748b' }

export function ReportsPage() {
  const [tab, setTab] = useState('overview')

  const latestCreatorData = CREATOR_GROWTH_DATA[CREATOR_GROWTH_DATA.length - 1]
  const latestSubmissionData = SUBMISSION_WEEKLY_DATA[SUBMISSION_WEEKLY_DATA.length - 1]
  const fraudMax = Math.max(...FRAUD_TYPE_BREAKDOWN.map(f => f.count))

  return (
    <div className="space-y-5">
      <PageHeader title="Reports & Analytics" subtitle="Platform-wide insights">
        <Button variant="outline" size="sm"><Download className="h-4 w-4" />Export Report</Button>
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview"><DollarSign className="h-3.5 w-3.5 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="platform"><Users className="h-3.5 w-3.5 mr-1" />Creators & Campaigns</TabsTrigger>
          <TabsTrigger value="integrity"><AlertTriangle className="h-3.5 w-3.5 mr-1" />Fraud & Funnel</TabsTrigger>
        </TabsList>

        {/* ── Overview: Revenue + Submissions ── */}
        <TabsContent value="overview">
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Paid Out', value: formatCurrency(12400000), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'This Month', value: formatCurrency(1240000), icon: TrendingUp, color: 'text-primary', bg: 'bg-orange-50' },
                { label: 'Avg per Creator', value: formatCurrency(5087), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Pending Release', value: formatCurrency(185000), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="admin-card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn('p-1.5 rounded-lg', s.bg)}>
                        <Icon className={cn('h-4 w-4', s.color)} />
                      </div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                    <p className={cn('text-xl font-bold num-font', s.color)}>{s.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Daily Payouts Chart */}
            <Card>
              <CardHeader><CardTitle>Daily Payouts (Last 30 Days)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={DAILY_PAYOUTS_DATA} margin={chartMargin}>
                    <defs>
                      <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={tickProps} tickLine={false} axisLine={false} />
                    <YAxis tick={tickProps} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip formatter={(v) => [typeof v === 'number' ? formatCurrency(v) : v, '']} contentStyle={tooltipStyle} />
                    <Legend />
                    <Area type="monotone" dataKey="paid" name="Paid" stroke="#10b981" fill="url(#paidGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="processing" name="Processing" stroke="#0ea5e9" strokeWidth={2} fillOpacity={0} />
                    <Area type="monotone" dataKey="failed" name="Failed" stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Submissions Chart */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Submissions This Week', value: latestSubmissionData.total, icon: BarChart3, color: 'text-slate-700', bg: 'bg-slate-50' },
                { label: 'Approved', value: latestSubmissionData.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Rejected', value: latestSubmissionData.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Approval Rate', value: `${latestSubmissionData.approvalRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="admin-card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn('p-1.5 rounded-lg', s.bg)}>
                        <Icon className={cn('h-4 w-4', s.color)} />
                      </div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                    <p className={cn('text-xl font-bold num-font', s.color)}>{s.value}</p>
                  </div>
                )
              })}
            </div>

            <Card>
              <CardHeader><CardTitle>Weekly Submission Trends</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={SUBMISSION_WEEKLY_DATA} margin={chartMargin}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={tickProps} tickLine={false} axisLine={false} />
                    <YAxis tick={tickProps} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="total" name="Total" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Creators & Campaigns ── */}
        <TabsContent value="platform">
          <div className="space-y-4">
            {/* Creator KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Creators', value: latestCreatorData.total.toLocaleString(), icon: Users, color: 'text-primary', bg: 'bg-orange-50' },
                { label: 'New This Month', value: `+${latestCreatorData.new}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'KYC Verified', value: KYC_DISTRIBUTION[0].count.toLocaleString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Active Campaigns', value: CAMPAIGNS_BY_CITY.reduce((s, c) => s + c.count, 0), icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="admin-card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn('p-1.5 rounded-lg', s.bg)}>
                        <Icon className={cn('h-4 w-4', s.color)} />
                      </div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                    <p className={cn('text-xl font-bold num-font', s.color)}>{s.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Creator Growth */}
              <Card>
                <CardHeader><CardTitle>Creator Growth</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={CREATOR_GROWTH_DATA} margin={chartMargin}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={tickProps} tickLine={false} axisLine={false} />
                      <YAxis tick={tickProps} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                      <Area type="monotone" dataKey="total" name="Total Creators" stroke="#f97316" fill="#fff7ed" strokeWidth={2} />
                      <Area type="monotone" dataKey="new" name="New" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* KYC Pie */}
              <Card>
                <CardHeader><CardTitle>KYC Status Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={KYC_DISTRIBUTION} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="status" label={({ status, count }) => `${status}: ${count}`}>
                        {KYC_DISTRIBUTION.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trust Score */}
              <Card>
                <CardHeader><CardTitle>Trust Score Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={TRUST_SCORE_DISTRIBUTION} margin={chartMargin}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="range" tick={tickProps} tickLine={false} axisLine={false} />
                      <YAxis tick={tickProps} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" name="Creators" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Campaigns by City */}
              <Card>
                <CardHeader><CardTitle>Campaigns by City</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={CAMPAIGNS_BY_CITY} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" tick={tickProps} tickLine={false} axisLine={false} />
                      <YAxis dataKey="city" type="category" tick={tickProps} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" name="Campaigns" fill="#f97316" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Success Rate */}
            <Card>
              <CardHeader><CardTitle>Success Rate by Category</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {SUCCESS_RATE_BY_CATEGORY.map(row => (
                    <div key={row.category}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{row.category}</span>
                        <span className="text-muted-foreground">{row.successRate}% · {row.count} campaigns</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${row.successRate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Fraud & Funnel ── */}
        <TabsContent value="integrity">
          <div className="space-y-4">
            {/* Fraud KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Current Fraud Rate', value: `${FRAUD_TREND_DATA[FRAUD_TREND_DATA.length - 1].rate}%`, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Total Fraud Cases', value: FRAUD_TYPE_BREAKDOWN.reduce((s, f) => s + f.count, 0), icon: XCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Activation Rate', value: `${ACTIVATION_FUNNEL_DATA[ACTIVATION_FUNNEL_DATA.length - 1].percent}%`, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="admin-card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn('p-1.5 rounded-lg', s.bg)}>
                        <Icon className={cn('h-4 w-4', s.color)} />
                      </div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                    <p className={cn('text-xl font-bold num-font', s.color)}>{s.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Fraud Trend */}
              <Card>
                <CardHeader><CardTitle>Fraud Rate Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={FRAUD_TREND_DATA} margin={chartMargin}>
                      <defs>
                        <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="week" tick={tickProps} tickLine={false} axisLine={false} />
                      <YAxis tick={tickProps} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={(v) => [`${v}%`, 'Fraud Rate']} contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="rate" name="Fraud Rate" stroke="#ef4444" fill="url(#fraudGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Fraud Breakdown */}
              <Card>
                <CardHeader><CardTitle>Fraud Type Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {FRAUD_TYPE_BREAKDOWN.map(item => (
                      <div key={item.type}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-muted-foreground">{item.count} cases</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${(item.count / fraudMax) * 100}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activation Funnel */}
            <Card>
              <CardHeader><CardTitle>Creator Activation Funnel</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {ACTIVATION_FUNNEL_DATA.map((step, i) => {
                  const dropoff = i < ACTIVATION_FUNNEL_DATA.length - 1
                    ? step.count - ACTIVATION_FUNNEL_DATA[i + 1].count
                    : 0
                  const dropoffPct = i < ACTIVATION_FUNNEL_DATA.length - 1
                    ? ((dropoff / step.count) * 100).toFixed(1)
                    : '0'
                  const isWorstDropoff = i < ACTIVATION_FUNNEL_DATA.length - 1 &&
                    dropoff === Math.max(
                      ...ACTIVATION_FUNNEL_DATA.slice(0, -1).map((s, j) => s.count - ACTIVATION_FUNNEL_DATA[j + 1].count)
                    )

                  return (
                    <div key={step.step} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{step.step}</span>
                          <span>
                            <span className="font-bold num-font">{step.count.toLocaleString()}</span>
                            <span className="text-muted-foreground ml-1">({step.percent}%)</span>
                          </span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${step.percent}%`, backgroundColor: `hsl(${25 + i * 12}, 80%, ${45 + i * 3}%)` }}
                          />
                        </div>
                        {i < ACTIVATION_FUNNEL_DATA.length - 1 && (
                          <p className={cn(
                            'text-xs mt-0.5',
                            isWorstDropoff ? 'text-red-600 font-semibold' : 'text-red-500'
                          )}>
                            Drop-off: {dropoff.toLocaleString()} ({dropoffPct}%)
                            {isWorstDropoff && ' — Biggest drop-off'}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
