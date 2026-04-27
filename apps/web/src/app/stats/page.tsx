import { AppLayout } from '@/components/layout/app-layout'
import { MapStatsChart } from '@/components/charts/map-stats-chart'
import { ModeStatsChart } from '@/components/charts/mode-stats-chart'
import { TimelineChart } from '@/components/charts/timeline-chart'
import { api } from '@/lib/api'

export default async function StatsPage() {
  const [byMap, byMode, timelineWeek, timelineMonth] = await Promise.allSettled([
    api.stats.byMap(),
    api.stats.byMode(),
    api.stats.timeline('week'),
    api.stats.timeline('month'),
  ])

  const mapStats = byMap.status === 'fulfilled' ? byMap.value : []
  const modeStats = byMode.status === 'fulfilled' ? byMode.value : []
  const weekTimeline = timelineWeek.status === 'fulfilled' ? timelineWeek.value : []
  const monthTimeline = timelineMonth.status === 'fulfilled' ? timelineMonth.value : []

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Estatísticas</h1>
        <p className="text-cs-muted text-sm mb-8">Análise detalhada da sua performance</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-cs-card border border-cs-border rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Performance por Mapa</h2>
            <MapStatsChart data={mapStats} />
          </div>

          <div className="bg-cs-card border border-cs-border rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Performance por Modo</h2>
            <ModeStatsChart data={modeStats} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-cs-card border border-cs-border rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Evolução Semanal</h2>
            <TimelineChart data={weekTimeline} />
          </div>

          <div className="bg-cs-card border border-cs-border rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Evolução Mensal</h2>
            <TimelineChart data={monthTimeline} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
