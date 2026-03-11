import { Badge } from '@/components/ui/badge'

interface RoleBadgeProps {
  role: 'SUPERADMIN' | 'ADMIN' | 'super_admin' | 'admin' // accept both API and normalized formats
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const isSuperAdmin = role === 'SUPERADMIN' || role === 'super_admin'
  return (
    <Badge
      variant={isSuperAdmin ? 'purple' : 'info'}
      className={className}
    >
      {isSuperAdmin ? 'Super Admin' : 'Admin'}
    </Badge>
  )
}
