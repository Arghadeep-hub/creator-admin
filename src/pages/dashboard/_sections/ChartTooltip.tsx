export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-sm p-3 shadow-xl shadow-slate-200/50">
      <p className="text-[11px] font-semibold text-foreground mb-1.5 uppercase tracking-wide">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-bold num-font ml-auto">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
