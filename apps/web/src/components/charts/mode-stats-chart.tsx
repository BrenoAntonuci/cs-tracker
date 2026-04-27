'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { StatsByMode } from '@cs2-tracker/types'

const COLORS = ['#F0A500', '#4A9EFF', '#4ade80', '#f87171', '#a78bfa']

export function ModeStatsChart({ data }: { data: StatsByMode[] }) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-cs-muted text-sm">
        Sem dados
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="matches"
          nameKey="mode"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ mode, winRate }) => `${mode} (${winRate}%)`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2332',
            border: '1px solid #2A3A4A',
            borderRadius: 8,
            color: '#E8EFF5',
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [value, name === 'matches' ? 'Partidas' : name]}
        />
        <Legend
          formatter={(value) => <span style={{ color: '#8899AA', fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
