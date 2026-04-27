'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { StatsByMap } from '@cs2-tracker/types'

export function MapStatsChart({ data }: { data: StatsByMap[] }) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-cs-muted text-sm">
        Sem dados
      </div>
    )
  }

  const sorted = [...data].sort((a, b) => b.matches - a.matches).slice(0, 8)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 10, left: 60, bottom: 0 }}>
        <XAxis type="number" stroke="#8899AA" tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="map"
          stroke="#8899AA"
          tick={{ fontSize: 11, fill: '#8899AA' }}
          tickFormatter={(v) => v.replace('de_', '')}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2332',
            border: '1px solid #2A3A4A',
            borderRadius: 8,
            color: '#E8EFF5',
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [
            name === 'winRate' ? `${value}%` : value,
            name === 'winRate' ? 'Win Rate' : name === 'matches' ? 'Partidas' : name,
          ]}
        />
        <Bar dataKey="winRate" name="winRate" radius={[0, 4, 4, 0]}>
          {sorted.map((entry, i) => (
            <Cell key={i} fill={entry.winRate >= 50 ? '#4ade80' : '#f87171'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
