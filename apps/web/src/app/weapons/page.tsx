import { AppLayout } from '@/components/layout/app-layout'
import { WeaponCard } from '@/components/weapons/weapon-card'
import { WeaponKillsChart } from '@/components/charts/weapon-kills-chart'
import { api } from '@/lib/api'
import { getWeaponLabel } from '@/lib/weapons'
import type { WeaponStat } from '@cs2-tracker/types'

export default async function WeaponsPage() {
  const weapons = await api.stats.weapons().catch((): WeaponStat[] => [])

  const totalKillsWithWeapons = weapons.reduce((sum, w) => sum + w.kills, 0)
  const topWeapon = weapons[0] ?? null
  const bestAccuracy = weapons
    .filter((w) => w.shots >= 100)
    .sort((a, b) => b.accuracy - a.accuracy)[0] ?? null

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Armas</h1>
        <p className="text-cs-muted text-sm mb-6 md:mb-8">
          Kills e precisão por arma — dados da Steam
        </p>

        {weapons.length === 0 ? (
          <div className="text-center py-16 text-cs-muted">
            <p className="text-4xl mb-4">🔫</p>
            <p>Nenhum dado de armas disponível.</p>
            <p className="text-sm mt-2">Sincronize seus dados da Steam no Dashboard.</p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-cs-card border border-cs-border rounded-xl p-4">
                <p className="text-cs-muted text-xs mb-1">Total de kills</p>
                <p className="text-white text-2xl font-bold">
                  {totalKillsWithWeapons.toLocaleString('pt-BR')}
                </p>
                <p className="text-cs-muted text-xs mt-1">{weapons.length} armas usadas</p>
              </div>

              {topWeapon && (
                <div className="bg-cs-card border border-cs-border rounded-xl p-4">
                  <p className="text-cs-muted text-xs mb-1">Arma mais usada</p>
                  <p className="text-cs-orange text-lg font-bold truncate">
                    {getWeaponLabel(topWeapon.weapon)}
                  </p>
                  <p className="text-cs-muted text-xs mt-1">
                    {topWeapon.kills.toLocaleString('pt-BR')} kills
                  </p>
                </div>
              )}

              {bestAccuracy && (
                <div className="bg-cs-card border border-cs-border rounded-xl col-span-2 lg:col-span-1 p-4">
                  <p className="text-cs-muted text-xs mb-1">Melhor precisão</p>
                  <p className="text-green-400 text-lg font-bold truncate">
                    {getWeaponLabel(bestAccuracy.weapon)}
                  </p>
                  <p className="text-cs-muted text-xs mt-1">{bestAccuracy.accuracy}% de acertos</p>
                </div>
              )}
            </div>

            {/* Kills chart */}
            <div className="bg-cs-card border border-cs-border rounded-xl p-5 mb-6 md:mb-8">
              <h2 className="text-white font-semibold mb-4">Top 10 — Kills por Arma</h2>
              <WeaponKillsChart data={weapons} />
            </div>

            {/* All weapon cards */}
            <h2 className="text-white font-semibold mb-4">Todas as Armas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {weapons.map((stat) => (
                <WeaponCard key={stat.weapon} stat={stat} />
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
