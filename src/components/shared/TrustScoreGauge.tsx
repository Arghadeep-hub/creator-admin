import { cn } from '@/lib/utils'

interface TrustScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

const sizes = {
  sm: { radius: 24, stroke: 4, fontSize: 'text-base', wh: 60 },
  md: { radius: 34, stroke: 6, fontSize: 'text-xl', wh: 84 },
  lg: { radius: 48, stroke: 8, fontSize: 'text-3xl', wh: 116 },
}

export function TrustScoreGauge({ score, size = 'md', showLabel = true, className }: TrustScoreGaugeProps) {
  const cfg = sizes[size]
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const circumference = 2 * Math.PI * cfg.radius
  const progress = (score / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: cfg.wh, height: cfg.wh }}>
        <svg
          width={cfg.wh}
          height={cfg.wh}
          viewBox={`0 0 ${cfg.wh} ${cfg.wh}`}
          className="-rotate-90"
        >
          <circle
            cx={cfg.wh / 2}
            cy={cfg.wh / 2}
            r={cfg.radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={cfg.stroke}
          />
          <circle
            cx={cfg.wh / 2}
            cy={cfg.wh / 2}
            r={cfg.radius}
            fill="none"
            stroke={color}
            strokeWidth={cfg.stroke}
            strokeDasharray={`${progress} ${circumference - progress}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold num-font', cfg.fontSize)} style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
      )}
    </div>
  )
}
