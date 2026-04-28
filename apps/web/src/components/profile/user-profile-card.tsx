import type { UserProfile } from '@cs2-tracker/types'
import { StatCard } from '@/components/stats/stat-card'
import { RecentMatches } from '@/components/matches/recent-matches'
import { getMapImage, getMapLabel } from '@/lib/maps'
import { getWeaponLabel } from '@/lib/weapons'

interface UserProfileCardProps {
  profile: UserProfile
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  const { user, overview, recentMatches, statsByMap, weapons } = profile
  const topMaps = [...statsByMap].sort((a, b) => b.matches - a.matches).slice(0, 5)
  const topWeapons = [...weapons].sort((a, b) => b.kills - a.kills).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="bg-cs-card border border-cs-border rounded-xl p-6 flex items-center gap-4">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.username} className="w-16 h-16 rounded-full" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-cs-border flex items-center justify-center text-2xl font-bold text-white">
            {user.username[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-white">{user.username}</h2>
          <p className="text-cs-muted text-sm">{overview.totalMatches} partidas registradas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="K/D Ratio" value={overview.kdRatio} highlight />
        <StatCard label="Win Rate" value={`${overview.winRate}%`} />
        <StatCard label="HS%" value={`${overview.hsPercentage}%`} />
        <StatCard label="Avg Kills" value={overview.avgKills} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-cs-card border border-cs-border rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Melhores Mapas</h3>
          {topMaps.length === 0 ? (
            <p className="text-cs-muted text-sm">Sem dados de mapa.</p>
          ) : (
            <div className="space-y-3">
              {topMaps.map((entry) => {
                const img = getMapImage(entry.map)
                return (
                  <div key={entry.map} className="flex items-center gap-3">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-cs-dark flex-shrink-0">
                      {img ? (
                        <img src={img} alt={entry.map} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cs-muted text-[10px]">
                          {getMapLabel(entry.map)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium capitalize">{getMapLabel(entry.map)}</p>
                      <p className="text-xs text-cs-muted">{entry.matches} partidas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-cs-orange">{entry.winRate}%</p>
                      <p className="text-xs text-cs-muted">win rate</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="bg-cs-card border border-cs-border rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Melhores Armas</h3>
          {topWeapons.length === 0 ? (
            <p className="text-cs-muted text-sm">Steam não sincronizado.</p>
          ) : (
            <div className="space-y-3">
              {topWeapons.map((w) => (
                <div key={w.weapon} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{getWeaponLabel(w.weapon)}</p>
                    <div className="mt-1 h-1.5 bg-cs-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cs-orange rounded-full"
                        style={{
                          width: `${Math.min((w.kills / (topWeapons[0]?.kills || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-white">{w.kills.toLocaleString()}</p>
                    <p className="text-xs text-cs-muted">kills</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="bg-cs-card border border-cs-border rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Últimas Partidas</h3>
        <RecentMatches matches={recentMatches} />
      </section>
    </div>
  )
}
