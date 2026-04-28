import { AppLayout } from '@/components/layout/app-layout'
import { ProfileClient } from '@/components/profile/profile-client'
import { api } from '@/lib/api'

export default async function ProfilePage() {
  const users = await api.users.list()
  return (
    <AppLayout>
      <ProfileClient users={users} />
    </AppLayout>
  )
}
