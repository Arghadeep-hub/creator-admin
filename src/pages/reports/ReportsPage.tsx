import { useState } from 'react'
import { Download, TrendingUp, Users, Megaphone, Video, AlertTriangle, BarChart3 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import {
  CREATOR_GROWTH_DATA, SUBMISSION_WEEKLY_DATA, DAILY_PAYOUTS_DATA,
  SUCCESS_RATE_BY_CATEGORY, TRUST_SCORE_DISTRIBUTION, KYC_DISTRIBUTION,
  CAMPAIGNS_BY_CITY, FRAUD_TREND_DATA, FRAUD_TYPE_BREAKDOWN, ACTIVATION_FUNNEL_DATA
} from '@/data/chart-data'

export function ReportsPage() {
  const [tab, setTab] = useState('revenue')

  return (
    <div className="space-y-5">
      <PageHeader title="Reports & Analytics" subtitle="Platform-wide insights">
        <Button variant="outline" size="sm"><Download className="h-4 w-4" />Export Report</Button>
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="revenue"><TrendingUp className="h-3.5 w-3.5 mr-1" />Revenue</TabsTrigger>
          <TabsTrigger value="creator"><Users className="h-3.5 w-3.5 mr-1" />Creator</TabsTrigger>
          <TabsTrigger value="campaign"><Megaphone className="h-3.5 w-3.5 mr-1" />Campaign</TabsTrigger>
          <TabsTrigger value="submission"><Video className="h-3.5 w-3.5 mr-1" />Submission</TabsTrigger>
          <TabsTrigger value="fraud"><AlertTriangle className="h-3.5 w-3.5 mr-1" />Fraud</TabsTrigger>
          <TabsTrigger value="funnel"><BarChart3 className="h-3.5 w-3.5 mr-1" />Funnel</TabsTrigger>
        </TabsList>

        {/* ── Revenue ── */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Total Paid Out', value: formatCurrency(12400000) },
              { label: 'This Month', value: formatCurrency(1240000) },
              { label: 'Avg per Creator', value: formatCurrency(5087) },
              { label: 'Pending Release', value: formatCurrency(185000) },
            ].map(s => (
              <div key={s.label} className="admin-card p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold num-font text-primary mt-1">{s.value}</p>
              </div>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle>Daily Payouts (Last 30 Days)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={DAILY_PAYOUTS_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v) => [typeof v === 'number' ? formatCurrency(v) : v, '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Area type="monotone" dataKey="paid" name="Paid" stroke="#10b981" fill="url(#paidGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="processing" name="Processing" stroke="#0ea5e9" strokeWidth={2} fillOpacity={0} />
                  <Area type="monotone" dataKey="failed" name="Failed" stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Creator ── */}
        <TabsContent value="creator">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Creator Growth</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={CREATOR_GROWTH_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="total" name="Total Creators" stroke="#f97316" fill="#fff7ed" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>KYC Status Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={KYC_DISTRIBUTION} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="status">
                      {KYC_DISTRIBUTION.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Trust Score Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={TRUST_SCORE_DISTRIBUTION} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="count" name="Creators" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Campaign ── */}
        <TabsContent value="campaign">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Campaigns by City</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={CAMPAIGNS_BY_CITY} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="count" name="Campaigns" fill="#f97316" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Success Rate by Category</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {SUCCESS_RATE_BY_CATEGORY.map(row => (
                    <div key={row.category}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{row.category}</span>
                        <span className="text-muted-foreground">{row.successRate}% · {row.count} campaigns</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${row.successRate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Submission ── */}
        <TabsContent value="submission">
          <Card>
            <CardHeader><CardTitle>Weekly Submission Trends</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={SUBMISSION_WEEKLY_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="total" name="Total" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Fraud ── */}
        <TabsContent value="fraud">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Fraud Rate Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={FRAUD_TREND_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Fraud Rate']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="rate" name="Fraud Rate" stroke="#ef4444" fill="url(#fraudGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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
                        <div className="h-full rounded-full" style={{ width: `${(item.count / 20) * 100}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Funnel ── */}
        <TabsContent value="funnel">
          <Card>
            <CardHeader><CardTitle>Creator Activation Funnel</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {ACTIVATION_FUNNEL_DATA.map((step, i) => (
                <div key={step.step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{step.step}</span>
                      <span>
                        <span className="font-bold">{step.count.toLocaleString()}</span>
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
                      <p className="text-xs text-red-500 mt-0.5">
                        Drop-off: {(step.count - ACTIVATION_FUNNEL_DATA[i + 1].count).toLocaleString()} ({(((step.count - ACTIVATION_FUNNEL_DATA[i + 1].count) / step.count) * 100).toFixed(1)}%)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
