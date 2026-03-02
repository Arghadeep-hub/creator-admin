import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, AlertTriangle, CheckCircle, XCircle, MapPin, Eye, Heart, MessageCircle,
  Clock, Shield, Tag, FileText, Video, StickyNote, DollarSign
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency, formatNumber, getRelativeTime } from '@/lib/utils'
import { MOCK_SUBMISSIONS } from '@/data/submissions'
import { MOCK_CREATORS } from '@/data/creators'

export function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [adminNote, setAdminNote] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const sub = MOCK_SUBMISSIONS.find(s => s.id === id)
  const creator = sub ? MOCK_CREATORS.find(c => c.id === sub.creatorId) : null

  if (!sub) {
    return <EmptyState title="Submission not found" actionLabel="Back" onAction={() => navigate('submissions')} />
  }

  const trustColor = sub.trustSignals.gpsVerified && sub.trustSignals.billVerified && !sub.trustSignals.postDeleted && !sub.trustSignals.captionEdited
    ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('submissions')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={`Submission ${sub.id.toUpperCase()}`}
          subtitle={`${sub.campaignName} · ${sub.creatorName}`}
          className="mb-0 flex-1"
        >
          <StatusBadge status={sub.status} />
          {sub.fraudFlags.length > 0 && (
            <Badge variant="error"><AlertTriangle className="h-3.5 w-3.5 mr-1" />{sub.fraudFlags.length} Fraud Flag</Badge>
          )}
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Reel Preview (placeholder) */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Video className="h-4 w-4 text-pink-500" />Reel Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Instagram Reel</p>
                  <a href={sub.reelUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">
                    Open in Instagram →
                  </a>
                </div>
              </div>
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Eye, label: 'Views', value: formatNumber(sub.metricsCurrent.views) },
                  { icon: Heart, label: 'Likes', value: formatNumber(sub.metricsCurrent.likes) },
                  { icon: MessageCircle, label: 'Comments', value: formatNumber(sub.metricsCurrent.comments) },
                ].map(m => {
                  const Icon = m.icon
                  return (
                    <div key={m.label} className="bg-slate-50 rounded-lg p-3 text-center">
                      <Icon className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                      <p className="font-bold num-font">{m.value}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Metrics Timeline */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4" />Verification Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sub.metricsTimeline.map((point, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm">
                    <div className="w-16 shrink-0">
                      <span className="font-semibold text-slate-700">{point.label}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-2">
                      <span className="text-xs text-center"><Eye className="h-3 w-3 inline mr-1" />{formatNumber(point.views)}</span>
                      <span className="text-xs text-center"><Heart className="h-3 w-3 inline mr-1" />{formatNumber(point.likes)}</span>
                      <span className="text-xs text-center"><MessageCircle className="h-3 w-3 inline mr-1" />{formatNumber(point.comments)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground w-24 shrink-0">{getRelativeTime(point.timestamp)}</span>
                  </div>
                ))}
              </div>
              {/* Stage timestamps */}
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-xs">
                {Object.entries(sub.stageTimestamps).filter(([, v]) => v).map(([stage, ts]) => (
                  <div key={stage} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-semibold uppercase">{stage}</span>
                      <span className="text-muted-foreground ml-1">{new Date(ts!).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust Signals */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4 text-blue-500" />Trust Signals</CardTitle></CardHeader>
            <CardContent>
              <div className={`rounded-lg border p-3 mb-3 ${trustColor}`}>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'GPS Verified', ok: sub.trustSignals.gpsVerified },
                    { label: 'Bill Verified', ok: sub.trustSignals.billVerified },
                    { label: 'Post Not Deleted', ok: !sub.trustSignals.postDeleted },
                    { label: 'Caption Unchanged', ok: !sub.trustSignals.captionEdited },
                    { label: 'Normal Engagement', ok: !sub.trustSignals.lowEngagement },
                  ].map(ts => (
                    <div key={ts.label} className="flex items-center gap-1.5 text-sm">
                      {ts.ok
                        ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        : <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      }
                      <span className={ts.ok ? 'text-slate-700' : 'text-red-700 font-medium'}>{ts.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fraud Flags */}
              {sub.fraudFlags.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1.5">Fraud Flags Detected</p>
                  {sub.fraudFlags.map((flag, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm text-red-600">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Caption & Hashtags */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="h-4 w-4" />Caption & Hashtags</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Caption</p>
                <p className="bg-slate-50 rounded-lg p-3 leading-relaxed">{sub.captionCurrent}</p>
              </div>
              {sub.captionAtSubmission !== sub.captionCurrent && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Caption was edited!</p>
                  <p className="text-xs text-amber-600 leading-relaxed">{sub.captionAtSubmission}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Hashtag Check</p>
                <div className="flex flex-wrap gap-1.5">
                  {sub.hashtagsMatched.map(tag => (
                    <Badge key={tag} variant="success" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />{tag}</Badge>
                  ))}
                  {sub.hashtagsMissing.map(tag => (
                    <Badge key={tag} variant="error" className="text-xs"><XCircle className="h-3 w-3 mr-1" />{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GPS Verification */}
          {sub.checkInLocation && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />GPS Verification</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Check-in Location</p>
                    <p className="font-mono text-xs mt-0.5">{sub.checkInLocation.latitude.toFixed(4)}, {sub.checkInLocation.longitude.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Distance from Campaign</p>
                    <p className="font-semibold">{sub.checkInLocation.distanceFromCampaign.toFixed(2)} km</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${sub.checkInLocation.withinRadius ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {sub.checkInLocation.withinRadius
                    ? <><CheckCircle className="h-4 w-4" /><span className="text-sm font-medium">Within campaign radius</span></>
                    : <><XCircle className="h-4 w-4" /><span className="text-sm font-medium">Outside campaign radius!</span></>
                  }
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><StickyNote className="h-4 w-4" />Admin Notes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {sub.adminNotes.length > 0 && (
                <div className="space-y-2">
                  {sub.adminNotes.map((note, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs">{note.adminName}</span>
                        <span className="text-xs text-muted-foreground">{getRelativeTime(note.timestamp)}</span>
                      </div>
                      <p className="text-slate-700">{note.note}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                />
                <Button size="sm" variant="outline" disabled={!adminNote} onClick={() => { success('Note added'); setAdminNote('') }}>
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-4">
          {/* Decision Panel */}
          {sub.status === 'pending' && (
            <Card className="border-2 border-primary/20">
              <CardHeader><CardTitle className="flex items-center gap-2 text-primary"><FileText className="h-4 w-4" />Review Decision</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => success('Submission approved!', `Payout of ${formatCurrency(sub.projectedPayout)} queued`)}
                >
                  <CheckCircle className="h-4 w-4" />Approve & Queue Payout
                </Button>
                {!showRejectForm ? (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowRejectForm(true)}
                  >
                    <XCircle className="h-4 w-4" />Reject Submission
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      placeholder="Reason for rejection..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        className="flex-1"
                        disabled={!rejectionReason}
                        onClick={() => { error('Submission rejected', rejectionReason); setShowRejectForm(false) }}
                      >
                        Confirm Reject
                      </Button>
                      <Button variant="outline" onClick={() => setShowRejectForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payout Breakdown */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-emerald-500" />Payout Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Payout</span>
                <span className="num-font font-medium">{formatCurrency(sub.payoutBreakdown.base)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engagement Bonus</span>
                <span className="num-font font-medium text-emerald-600">+{formatCurrency(sub.payoutBreakdown.engagementBonus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trust Bonus</span>
                <span className="num-font font-medium text-emerald-600">+{formatCurrency(sub.payoutBreakdown.trustBonus)}</span>
              </div>
              {sub.payoutBreakdown.penalties < 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Penalties</span>
                  <span className="num-font font-medium text-red-600">{formatCurrency(sub.payoutBreakdown.penalties)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total Projected</span>
                <span className="num-font font-bold text-primary text-base">{formatCurrency(sub.payoutBreakdown.total)}</span>
              </div>
              {sub.finalPayout && (
                <div className="flex justify-between">
                  <span className="font-semibold">Final Payout</span>
                  <span className="num-font font-bold text-emerald-600 text-base">{formatCurrency(sub.finalPayout)}</span>
                </div>
              )}
              {sub.payoutOverride && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                  <p className="text-xs font-semibold text-amber-700">Manual Override by {sub.payoutOverride.overriddenBy}</p>
                  <p className="text-xs text-amber-600">{sub.payoutOverride.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rank Info */}
          <Card>
            <CardHeader><CardTitle>Leaderboard Rank</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <div className="text-center py-2">
                <p className="text-3xl font-bold num-font text-primary">#{sub.ranking}</p>
                <p className="text-xs text-muted-foreground mt-0.5">of {sub.totalRankEntries} in this campaign</p>
              </div>
              {sub.rankHistory.length > 1 && (
                <div className="space-y-1.5 mt-3">
                  {sub.rankHistory.map((rh, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-muted-foreground uppercase">{rh.stage}</span>
                      <span className="font-semibold">#{rh.rank}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator Quick Profile */}
          {creator && (
            <Card>
              <CardHeader><CardTitle>Creator</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={creator.name} size="md" />
                  <div>
                    <p className="font-semibold text-sm">{creator.name}</p>
                    <p className="text-xs text-muted-foreground">@{creator.instagramHandle}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <TrustScoreGauge score={creator.trustScore} size="sm" />
                  <StatusBadge status={creator.kycStatus} />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`creators/${creator.id}`)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Bill Verification */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" />Bill Verification</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill Number</span>
                <span className="font-mono text-xs">{sub.billNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={sub.billVerificationStatus} />
              </div>
              {sub.billRejectionReason && (
                <p className="text-xs text-red-600 bg-red-50 rounded p-2">{sub.billRejectionReason}</p>
              )}
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1" onClick={() => success('Bill verified')}>Verify Bill</Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => error('Bill rejected')}>Reject</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
