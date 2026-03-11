import { useState } from 'react'
import { StickyNote, Send } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import { getRelativeTime } from '@/lib/utils'
import type { SubmissionAdmin } from '@/types'
import { useAddSubmissionNoteMutation } from '@/store/api/submissionsApi'

interface Props {
  sub: SubmissionAdmin
}

export default function AdminNotes({ sub }: Props) {
  const { success, error } = useToast()
  const [adminNote, setAdminNote] = useState('')
  const [addNote, { isLoading: isAddingNote }] = useAddSubmissionNoteMutation()

  async function handleAddNote() {
    if (!adminNote) return
    try {
      await addNote({ id: sub.id, body: { note: adminNote } }).unwrap()
      success('Note added')
      setAdminNote('')
    } catch {
      error('Failed to add note')
    }
  }

  return (
    <div className="admin-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100">
            <StickyNote className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <h3 className="font-semibold text-sm">Admin Notes</h3>
        </div>
        {(sub.notes ?? []).length > 0 && (
          <span className="text-[11px] text-muted-foreground bg-slate-100 rounded-full px-2 py-0.5">
            {(sub.notes ?? []).length}
          </span>
        )}
      </div>

      {/* Chat-bubble style notes */}
      {(sub.notes ?? []).length > 0 && (
        <div className="space-y-3 mb-4">
          {(sub.notes ?? []).map((note) => (
            <div key={note.id} className="flex gap-2.5">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {note.adminName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 bg-slate-50 rounded-xl rounded-tl-sm px-3 py-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-700">{note.adminName}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{getRelativeTime(note.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{note.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add note form */}
      <div className="space-y-2">
        <Textarea
          value={adminNote}
          onChange={e => setAdminNote(e.target.value)}
          placeholder="Add a note…"
          rows={2}
          className="resize-none text-sm"
        />
        <Button
          size="sm"
          variant="outline"
          disabled={!adminNote || isAddingNote}
          onClick={handleAddNote}
          className="gap-1.5"
        >
          <Send className="h-3.5 w-3.5" />Add Note
        </Button>
      </div>
    </div>
  )
}
