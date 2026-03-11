import { useState } from 'react'
import { Plus, Mail, Shield, MoreVertical, CheckCircle, XCircle, Edit } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageLoader } from '@/components/ui/PageLoader'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { getRelativeTime } from '@/lib/utils'
import {
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminStatusMutation,
} from '@/store/api/adminUsersApi'

export function AdminManagementPage() {
  const { session } = useAuth()
  const { success, error } = useToast()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'SUPERADMIN'>('ADMIN')

  const { data: adminsData, isLoading } = useGetAdminUsersQuery({ page: 1, limit: 100 })
  const [createAdminUser, { isLoading: isInviting }] = useCreateAdminUserMutation()
  const [updateAdminStatus] = useUpdateAdminStatusMutation()

  const admins = adminsData?.data ?? []

  if (session?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-600">Super Admin access required</p>
        </div>
      </div>
    )
  }

  if (isLoading) return <PageLoader />

  const deactivateAdmin = admins.find(a => a.id === deactivateTarget)

  async function handleInvite() {
    try {
      await createAdminUser({
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        password: 'TempPass@123',
        role: inviteRole,
      }).unwrap()
      success('Invitation sent', inviteEmail)
      setInviteOpen(false)
      setInviteEmail('')
    } catch {
      error('Failed to send invitation')
    }
  }

  async function handleToggleStatus() {
    if (!deactivateTarget || !deactivateAdmin) return
    try {
      await updateAdminStatus({ id: deactivateTarget, body: { isActive: !deactivateAdmin.isActive } }).unwrap()
      success(deactivateAdmin.isActive ? 'Admin deactivated' : 'Admin reactivated')
      setDeactivateTarget(null)
    } catch {
      error('Failed to update admin status')
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Admin Management" subtitle={`${admins.length} admins on the platform`}>
        <Button onClick={() => setInviteOpen(true)}>
          <Plus className="h-4 w-4" />Invite Admin
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Admins', value: admins.length },
          { label: 'Super Admins', value: admins.filter(a => a.role === 'SUPERADMIN').length },
          { label: 'Active', value: admins.filter(a => a.isActive).length },
          { label: 'Inactive', value: admins.filter(a => !a.isActive).length },
        ].map(s => (
          <div key={s.label} className="admin-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold num-font mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Admin List */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Admin', 'Role', 'Department', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.map(admin => (
                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={admin.name} size="sm" />
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><RoleBadge role={admin.role} /></td>
                  <td className="py-3 px-4 text-muted-foreground">{admin.department}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {admin.isActive
                        ? <><CheckCircle className="h-4 w-4 text-emerald-500" /><span className="text-emerald-600 text-xs font-medium">Active</span></>
                        : <><XCircle className="h-4 w-4 text-slate-400" /><span className="text-muted-foreground text-xs">Inactive</span></>
                      }
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{admin.lastLoginAt ? getRelativeTime(admin.lastLoginAt) : 'Never'}</td>
                  <td className="py-3 px-4">
                    {admin.id !== session.userId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => success('Edit feature coming soon')}>
                            <Edit className="h-4 w-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeactivateTarget(admin.id)}
                            className={admin.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}
                          >
                            {admin.isActive ? 'Deactivate' : 'Reactivate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent onClose={() => setInviteOpen(false)}>
          <DialogHeader>
            <DialogTitle>Invite Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="admin@trythemenu.com" type="email" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={v => setInviteRole(v as 'ADMIN' | 'SUPERADMIN')} options={[
                { value: 'ADMIN', label: 'Admin' },
                { value: 'SUPERADMIN', label: 'Super Admin' },
              ]} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!inviteEmail || isInviting}>
              <Mail className="h-4 w-4" />{isInviting ? 'Sending…' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deactivateTarget}
        onOpenChange={open => !open && setDeactivateTarget(null)}
        title={deactivateAdmin?.isActive ? 'Deactivate Admin?' : 'Reactivate Admin?'}
        description={
          deactivateAdmin?.isActive
            ? 'This admin will no longer be able to log in. You can reactivate them later.'
            : 'This admin will regain access to the platform.'
        }
        confirmLabel={deactivateAdmin?.isActive ? 'Deactivate' : 'Reactivate'}
        variant={deactivateAdmin?.isActive ? 'destructive' : 'default'}
        onConfirm={handleToggleStatus}
      />
    </div>
  )
}
