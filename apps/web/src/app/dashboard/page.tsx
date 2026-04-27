import { AppLayout } from '@/components/layout/app-layout'
import { StatCard } from '@/components/stats/stat-card'
import { SteamSyncButton } from '@/components/steam/steam-sync-button'
import { TimelineChart } from '@/components/charts/timeline-chart'
import { RecentMatches } from '@/components/matches/recent-matches'
import { api } from '@/lib/api'

export default async function DashboardPage() {
  const [overview, timeline, recentMatches, steamStats] = await Promise.allSettled([
    api.stats.overview(),
    api.stats.timeline('week'),
    api.matches.list({ pageSize: 5 }),
    api.steam.stats(),
  ])

  const stats = overview.status === 'fulfilled' ? overview.value : null
  const timelineData = timeline.status === 'fulfilled' ? timeline.value : []
  const matches = recentMatches.status === 'fulfilled' ? recentMatches.value.data : []
  const steam = steamStats.status === 'fulfilled' ? steamStats.value : null

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-cs-muted text-sm mt-1">Sua performance no CS2</p>
          </div>
          <SteamSyncButton lastSynced={steam?.lastSyncedAt ?? null} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard
            label="K/D Ratio"
            value={stats?.kdRatio ?? '—'}
            highlight={stats !== null && stats.kdRatio >= 1}
          />
          <StatCard
            label="Win Rate"
            value={stats ? `${stats.winRate}%` : '—'}
            subtitle={stats ? `${stats.totalWins} vitórias` : undefined}
          />
          <StatCard
            label="HS%"
            value={stats ? `${stats.hsPercentage}%` : '—'}
          />
          <StatCard
            label="Partidas"
            value={stats?.totalMatches ?? '—'}
            subtitle="total registradas"
          />
        </div>

        {steam && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="col-span-full">
              <p className="text-cs-muted text-xs mb-3 flex items-center gap-1">
                <span>🎮</span> Steam (dados globais da conta)
              </p>
            </div>
            <StatCard label="Kills (Steam)" value={steam.totalKills.toLocaleString()} />
            <StatCard label="Wins (Steam)" value={steam.totalWins.toLocaleString()} />
            <StatCard label="Precisão" value={`${steam.accuracy}%`} />
            <StatCard label="HS% (Steam)" value={`${steam.hsPercentage}%`} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-cs-card border border-cs-border rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Evolução Semanal</h2>
            <TimelineChart data={timelineData} />
          </div>

          <div className="bg-cs-card border border-cs-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Últimas Partidas</h2>
              <a href="/matches" className="text-cs-orange text-xs hover:underline">
                Ver todas →
              </a>
            </div>
            <RecentMatches matches={matches} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
