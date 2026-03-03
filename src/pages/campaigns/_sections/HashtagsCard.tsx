import type { Dispatch, SetStateAction } from 'react'
import { memo, useState } from 'react'
import { Hash, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  hashtags: string[]
  setHashtags: Dispatch<SetStateAction<string[]>>
}

export const HashtagsCard = memo(function HashtagsCard({ hashtags, setHashtags }: Props) {
  const [newHashtag, setNewHashtag] = useState('')

  function add() {
    if (!newHashtag.trim()) return
    const tag = newHashtag.trim().startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`
    setHashtags(h => [...h, tag])
    setNewHashtag('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50">
            <Hash className="h-3.5 w-3.5 text-purple-600" />
          </div>
          Required Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hashtags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {hashtags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 pl-3 pr-1.5 py-1.5 sm:py-1 text-sm font-medium text-primary"
              >
                <Hash className="h-3 w-3 opacity-60" />
                {tag.replace('#', '')}
                <button
                  onClick={() => setHashtags(h => h.filter(t => t !== tag))}
                  className="flex items-center justify-center h-7 w-7 sm:h-6 sm:w-6 rounded-full hover:bg-red-100 hover:text-red-500 cursor-pointer transition-colors ml-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 py-5 text-center">
            <p className="text-xs text-slate-400">No hashtags added yet</p>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newHashtag}
            onChange={e => setNewHashtag(e.target.value)}
            placeholder="#hashtag"
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <Button variant="outline" onClick={add} className="rounded-xl shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})
