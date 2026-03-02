import { Badge } from '@/components/ui/badge'

interface RoleBadgeProps {
  role: 'super_admin' | 'admin'
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant={role === 'super_admin' ? 'purple' : 'info'}
      className={className}
    >
      {role === 'super_admin' ? 'Super Admin' : 'Admin'}
    </Badge>
  )
}
