import { AppLayout } from '@/components/layout/app-layout'
import { MatchesClient } from '@/components/matches/matches-client'
import { api } from '@/lib/api'

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: { page?: string; map?: string; mode?: string; result?: string }
}) {
  const page = Number(searchParams.page) || 1
  const filters = {
    page,
    pageSize: 20,
    ...(searchParams.map && { map: searchParams.map }),
    ...(searchParams.mode && { mode: searchParams.mode }),
    ...(searchParams.result && { result: searchParams.result }),
  }

  const data = await api.matches.list(filters).catch(() => ({ data: [], total: 0, page: 1, pageSize: 20 }))

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Partidas</h1>
        <p className="text-cs-muted text-sm mb-8">Histórico e cadastro de partidas</p>
        <MatchesClient initialData={data} />
      </div>
    </AppLayout>
  )
}
