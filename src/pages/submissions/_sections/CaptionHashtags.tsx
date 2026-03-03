import { Tag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { SubmissionAdmin } from '@/types'

interface Props {
  sub: SubmissionAdmin
}

export default function CaptionHashtags({ sub }: Props) {
  const captionEdited = sub.captionAtSubmission !== sub.captionCurrent
  const matchCount  = sub.hashtagsMatched.length
  const missingCount = sub.hashtagsMissing.length

  return (
    <div className="admin-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-slate-100">
          <Tag className="h-3.5 w-3.5 text-slate-500" />
        </div>
        <h3 className="font-semibold text-sm">Caption & Hashtags</h3>
      </div>

      <div className="space-y-3">
        {/* Current caption */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Current Caption</p>
          <p className="text-sm bg-slate-50 border border-slate-100 rounded-lg p-3 leading-relaxed text-slate-700">
            {sub.captionCurrent}
          </p>
        </div>

        {/* Caption edited warning */}
        {captionEdited && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <p className="text-xs font-semibold text-amber-700">Caption was edited after submission</p>
            </div>
            <p className="text-xs text-amber-600 leading-relaxed">{sub.captionAtSubmission}</p>
          </div>
        )}

        {/* Hashtag check */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Hashtag Check</p>
            <p className="text-[11px] text-muted-foreground">
              <span className="text-emerald-600 font-semibold">{matchCount} matched</span>
              {missingCount > 0 && <span className="text-red-500 font-semibold"> · {missingCount} missing</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sub.hashtagsMatched.map(tag => (
              <Badge key={tag} variant="success" className="text-xs gap-1">
                <CheckCircle className="h-3 w-3" />{tag}
              </Badge>
            ))}
            {sub.hashtagsMissing.map(tag => (
              <Badge key={tag} variant="error" className="text-xs gap-1">
                <XCircle className="h-3 w-3" />{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
