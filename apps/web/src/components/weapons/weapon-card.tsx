import { getWeaponInfo, getWeaponImageUrl, getWeaponLabel, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/weapons'
import type { WeaponStat } from '@cs2-tracker/types'

interface WeaponCardProps {
  stat: WeaponStat
}

export function WeaponCard({ stat }: WeaponCardProps) {
  const info = getWeaponInfo(stat.weapon)
  const imageUrl = getWeaponImageUrl(stat.weapon)
  const label = info?.label ?? getWeaponLabel(stat.weapon)

  return (
    <div className="bg-cs-card border border-cs-border rounded-xl overflow-hidden hover:border-white/20 transition-colors">
      <div className="h-24 bg-cs-dark flex items-center justify-center px-6">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={label}
            className="h-14 w-full object-contain drop-shadow-lg"
          />
        ) : (
          <span className="text-4xl">🔫</span>
        )}
      </div>

      <div className="p-3">
        <p className="text-white font-semibold text-sm truncate">{label}</p>
        {info && (
          <p className={`text-[10px] font-medium mb-2 ${CATEGORY_COLORS[info.category]}`}>
            {CATEGORY_LABELS[info.category]}
          </p>
        )}

        <div className="grid grid-cols-2 gap-1.5">
          <StatCell label="Kills" value={stat.kills.toLocaleString('pt-BR')} highlight />
          {stat.shots > 0 ? (
            <StatCell label="Precisão" value={`${stat.accuracy}%`} />
          ) : (
            <StatCell label="Precisão" value="—" />
          )}
          {stat.shots > 0 && (
            <>
              <StatCell label="Tiros" value={stat.shots.toLocaleString('pt-BR')} />
              <StatCell label="Acertos" value={stat.hits.toLocaleString('pt-BR')} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-cs-dark rounded-lg px-2 py-1.5 text-center">
      <p className="text-cs-muted text-[10px] mb-0.5">{label}</p>
      <p className={`text-xs font-semibold ${highlight ? 'text-cs-orange' : 'text-white'}`}>{value}</p>
    </div>
  )
}
