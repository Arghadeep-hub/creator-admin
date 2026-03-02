import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { Hash, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  hashtags: string[]
  setHashtags: Dispatch<SetStateAction<string[]>>
}

export function HashtagsCard({ hashtags, setHashtags }: Props) {
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
        <CardTitle>Required Hashtags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 pl-3 pr-1.5 py-1 text-sm font-medium text-primary"
              >
                <Hash className="h-3 w-3" />
                {tag.replace('#', '')}
                <button
                  onClick={() => setHashtags(h => h.filter(t => t !== tag))}
                  className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-500 cursor-pointer transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newHashtag}
            onChange={e => setNewHashtag(e.target.value)}
            placeholder="#hashtag"
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <Button variant="outline" onClick={add}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
