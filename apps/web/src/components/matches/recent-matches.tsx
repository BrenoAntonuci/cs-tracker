import type { Match } from '@cs2-tracker/types'

const resultColors = {
  WIN: 'text-green-400',
  LOSS: 'text-red-400',
  DRAW: 'text-yellow-400',
}

const resultLabels = {
  WIN: 'V',
  LOSS: 'D',
  DRAW: 'E',
}

export function RecentMatches({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return (
      <div className="py-8 text-center text-cs-muted text-sm">
        Nenhuma partida registrada ainda.{' '}
        <a href="/matches" className="text-cs-orange hover:underline">
          Cadastre uma!
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => (
        <div
          key={match.id}
          className="flex items-center gap-3 p-3 bg-cs-dark rounded-lg border border-cs-border"
        >
          <span className={`text-sm font-bold w-4 ${resultColors[match.result]}`}>
            {resultLabels[match.result]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium">{match.map}</p>
            <p className="text-xs text-cs-muted">{match.mode}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white font-mono">
              {match.kills}/{match.deaths}/{match.assists}
            </p>
            <p className="text-xs text-cs-muted">
              {match.kills && match.deaths
                ? `${(match.kills / Math.max(match.deaths, 1)).toFixed(2)} K/D`
                : '—'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
