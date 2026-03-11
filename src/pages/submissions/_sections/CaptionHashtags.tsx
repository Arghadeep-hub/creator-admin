import { Tag, AlertTriangle } from 'lucide-react'
import type { SubmissionAdmin } from '@/types'

interface Props {
  sub: SubmissionAdmin
}

export default function CaptionHashtags({ sub }: Props) {
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
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Caption at Submission</p>
          <p className="text-sm bg-slate-50 border border-slate-100 rounded-lg p-3 leading-relaxed text-slate-700">
            {sub.captionAtSubmission ?? 'No caption available'}
          </p>
        </div>

        {/* Caption edited warning */}
        {sub.captionEdited && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <p className="text-xs font-semibold text-amber-700">Caption was edited after submission</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
