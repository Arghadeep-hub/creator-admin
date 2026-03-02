import { cn } from '@/lib/utils'

interface BrandLogoProps {
  className?: string
  alt?: string
}

export function BrandLogo({ className = 'h-9 w-auto', alt = 'TryTheMenu' }: BrandLogoProps) {
  return (
    <img
      src="/assets/ttm-logo.svg"
      alt={alt}
      className={cn('select-none object-contain', className)}
      loading="eager"
      decoding="sync"
    />
  )
}
