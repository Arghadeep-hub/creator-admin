import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useGetLocationsQuery, useUpdateLocationMutation } from '@/store/api/settingsApi'
import { useToast } from '@/contexts/ToastContext'
import { PageLoader } from '@/components/ui/PageLoader'

export default function LocationManager() {
  const { success, error } = useToast()
  const { data: locations = [], isLoading } = useGetLocationsQuery()
  const [updateLocation] = useUpdateLocationMutation()

  async function toggleLocation(id: string, currentActive: boolean) {
    try {
      await updateLocation({ id, body: { isActive: !currentActive } }).unwrap()
      success(`Location ${currentActive ? 'disabled' : 'enabled'}`)
    } catch {
      error('Failed to update location')
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-3">
      {locations.map(loc => (
        <Card key={loc.id}>
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm">{loc.city}</p>
              <p className="text-xs text-muted-foreground">{loc.areaName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
              </p>
            </div>
            <Switch
              checked={loc.isActive}
              onCheckedChange={() => toggleLocation(loc.id, loc.isActive)}
            />
          </CardContent>
        </Card>
      ))}
      {locations.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No locations configured.</p>
      )}
    </div>
  )
}
