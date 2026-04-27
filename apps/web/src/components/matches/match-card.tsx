'use client'

import { TrashIcon } from '@/components/ui/icons'
import { getMapImage, getMapLabel } from '@/lib/maps'
import type { Match } from '@cs2-tracker/types'

const resultConfig = {
  WIN:  { label: 'Vitória', text: 'text-green-400', badge: 'bg-green-500/20 text-green-400' },
  LOSS: { label: 'Derrota', text: 'text-red-400',   badge: 'bg-red-500/20 text-red-400'     },
  DRAW: { label: 'Empate',  text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-400' },
}

interface MatchCardProps {
  match: Match
  onDelete: (match: Match) => void
}

export function MatchCard({ match, onDelete }: MatchCardProps) {
  const result = resultConfig[match.result]
  const mapImage = getMapImage(match.map)
  const mapLabel = getMapLabel(match.map)
  const kd = match.deaths > 0 ? (match.kills / match.deaths).toFixed(2) : match.kills.toFixed(2)
  const hs = match.kills > 0 ? ((match.headshots / match.kills) * 100).toFixed(0) : '0'

  return (
    <div className="bg-cs-card border border-cs-border rounded-xl overflow-hidden hover:border-white/20 transition-colors">
      {/* Map image */}
      <div className="relative h-32 bg-cs-dark">
        {mapImage ? (
          <img
            src={mapImage}
            alt={mapLabel}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cs-muted text-sm">
            {mapLabel}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cs-card via-cs-card/40 to-transparent" />

        {/* Map name + result badge over image */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 flex items-end justify-between">
          <div>
            <p className="text-white font-bold text-sm capitalize">{mapLabel}</p>
            <p className="text-cs-muted text-xs">{match.mode}</p>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${result.badge}`}>
            {result.label}
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(match)}
          className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-red-500/80 text-white rounded-md transition-colors"
          title="Remover partida"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats */}
      <div className="p-3 grid grid-cols-4 gap-2">
        <Stat label="K/D/A" value={`${match.kills}/${match.deaths}/${match.assists}`} mono />
        <Stat label="K/D" value={kd} highlight />
        <Stat label="HS%" value={`${hs}%`} />
        <Stat label="MVPs" value={String(match.mvps)} />
      </div>

      <p className="px-3 pb-3 text-cs-muted text-xs">
        {new Date(match.playedAt).toLocaleDateString('pt-BR', {
          day: '2-digit', month: 'short', year: 'numeric',
        })}
      </p>
    </div>
  )
}

function Stat({ label, value, highlight, mono }: {
  label: string
  value: string
  highlight?: boolean
  mono?: boolean
}) {
  return (
    <div className="bg-cs-dark rounded-lg px-2 py-1.5 text-center">
      <p className="text-cs-muted text-[10px] mb-0.5">{label}</p>
      <p className={`text-xs font-semibold ${highlight ? 'text-cs-orange' : 'text-white'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  )
}
