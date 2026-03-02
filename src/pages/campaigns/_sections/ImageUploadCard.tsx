import { useRef, useState } from 'react'
import { ImagePlus, Link, MapPin, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  businessLogo: string
  setBusinessLogo: (v: string) => void
  name: string
  businessName: string
  city: string
}

export function ImageUploadCard({ businessLogo, setBusinessLogo, name, businessName, city }: Props) {
  const [imageMode, setImageMode] = useState<'upload' | 'url'>(businessLogo ? 'url' : 'upload')
  const [urlInput, setUrlInput]   = useState(businessLogo)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      setBusinessLogo(e.target?.result as string)
      setUrlInput('')
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  function applyUrl() { setBusinessLogo(urlInput.trim()) }

  function clearImage() {
    setBusinessLogo('')
    setUrlInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle>Campaign Image</CardTitle>
          <div className="flex rounded-lg border border-slate-200 p-0.5 gap-0.5">
            {(['upload', 'url'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setImageMode(mode)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  imageMode === mode
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode === 'upload' ? <Upload className="h-3 w-3" /> : <Link className="h-3 w-3" />}
                {mode === 'upload' ? 'Upload file' : 'Paste URL'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="relative h-40 sm:h-48 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {businessLogo ? (
            <>
              <img
                src={businessLogo}
                alt="Campaign preview"
                className="h-full w-full object-cover"
                onError={clearImage}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-10">
                <p className="truncate text-sm font-semibold text-white">{name || 'Campaign name'}</p>
                <p className="flex items-center gap-1 text-xs text-white/70 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {businessName || 'Business'} · {city || 'City'}
                </p>
              </div>
              <button
                onClick={clearImage}
                className="absolute right-2.5 top-2.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <ImagePlus className="h-8 w-8" />
              <p className="text-xs">No image — preview will appear here</p>
            </div>
          )}
        </div>

        {imageMode === 'upload' ? (
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 sm:px-6 py-6 sm:py-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-orange-50'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              <Upload className={`h-5 w-5 ${isDragging ? 'text-primary' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                {isDragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">PNG, JPG, WebP — max 5 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={e => e.key === 'Enter' && applyUrl()}
              />
              <Button variant="outline" onClick={applyUrl} disabled={!urlInput.trim()}>
                Apply
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use a direct image URL (Pexels, Unsplash, or your own CDN)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
