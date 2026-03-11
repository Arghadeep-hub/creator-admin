import { memo, useRef, useState } from 'react'
import { Camera, ImagePlus, Link, Loader2, MapPin, Upload, X } from 'lucide-react'
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

export const ImageUploadCard = memo(function ImageUploadCard({ businessLogo, setBusinessLogo, name, businessName, city }: Props) {
  const [imageMode, setImageMode] = useState<'upload' | 'url'>(businessLogo ? 'url' : 'upload')
  const [urlInput, setUrlInput]   = useState(businessLogo)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return
    setIsProcessing(true)
    const reader = new FileReader()
    reader.onload = e => {
      setBusinessLogo(e.target?.result as string)
      setUrlInput('')
      setIsProcessing(false)
    }
    reader.onerror = () => setIsProcessing(false)
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

  // Estimate image size from base64
  const imageSizeKB = businessLogo && businessLogo.startsWith('data:')
    ? Math.round((businessLogo.length * 3) / 4 / 1024)
    : null

  return (
    <Card>
      <CardHeader>
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
          <CardTitle className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50">
              <Camera className="h-3.5 w-3.5 text-rose-600" />
            </div>
            Campaign Image
          </CardTitle>
          <div className="grid grid-cols-2 sm:flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
            {(['upload', 'url'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setImageMode(mode)}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs font-medium transition-all cursor-pointer ${
                  imageMode === mode
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode === 'upload' ? <Upload className="h-4 w-4 sm:h-3.5 sm:w-3.5" /> : <Link className="h-4 w-4 sm:h-3.5 sm:w-3.5" />}
                {mode === 'upload' ? 'Upload file' : 'Paste URL'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {businessLogo ? (
            <>
              <img
                src={businessLogo}
                alt="Campaign preview"
                className="h-full w-full object-cover"
                onError={clearImage}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-12">
                <p className="truncate text-sm font-semibold text-white">{name || 'Campaign name'}</p>
                <p className="flex items-center gap-1 text-xs text-white/70 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {businessName || 'Business'} · {city || 'City'}
                </p>
              </div>
              {/* Image size badge */}
              {imageSizeKB !== null && (
                <span className="absolute top-2.5 left-2.5 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {imageSizeKB > 1024 ? `${(imageSizeKB / 1024).toFixed(1)} MB` : `${imageSizeKB} KB`}
                </span>
              )}
              <button
                onClick={clearImage}
                className="absolute right-2.5 top-2.5 flex h-10 w-10 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 active:scale-95 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
                <ImagePlus className="h-7 w-7 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500">No image yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Upload or paste a URL below</p>
              </div>
            </div>
          )}
        </div>

        {imageMode === 'upload' ? (
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-4 sm:px-6 py-8 sm:py-8 text-center transition-all ${
              isProcessing
                ? 'border-primary/40 bg-orange-50/40 pointer-events-none'
                : isDragging
                  ? 'border-primary bg-orange-50/60 scale-[0.99] shadow-inner'
                  : 'border-slate-300 bg-slate-50/50 hover:border-primary/50 hover:bg-orange-50/30 active:scale-[0.99]'
            }`}
          >
            <div className={`flex h-12 w-12 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 transition-colors ${
              isDragging ? 'border-primary/30' : ''
            }`}>
              {isProcessing ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <Upload className={`h-5 w-5 transition-colors ${isDragging ? 'text-primary' : 'text-slate-400'}`} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                {isProcessing ? 'Processing image...' : isDragging ? 'Drop to upload' : 'Tap to browse or drag & drop'}
              </p>
              <p className="mt-1 text-xs text-slate-400">PNG, JPG, WebP — max 5 MB</p>
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
          <div className="space-y-2">
            <Label>Image URL</Label>
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={e => e.key === 'Enter' && applyUrl()}
                className="h-12 sm:h-10 text-base sm:text-sm"
              />
              <Button variant="outline" onClick={applyUrl} disabled={!urlInput.trim()} className="rounded-xl shrink-0 h-12 sm:h-10 px-5 sm:px-4">
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
})
