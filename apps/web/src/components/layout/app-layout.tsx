import { redirect } from 'next/navigation'
import { api } from '@/lib/api'
import { Sidebar } from './sidebar'

export async function AppLayout({ children }: { children: React.ReactNode }) {
  let user
  try {
    user = await api.auth.me()
  } catch {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
