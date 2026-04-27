'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { TimelineEntry } from '@cs2-tracker/types'

export function TimelineChart({ data }: { data: TimelineEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-cs-muted text-sm">
        Sem dados suficientes
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <XAxis
          dataKey="period"
          stroke="#8899AA"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => v.split('-W').join(' W').split('-').slice(-2).join('/')}
        />
        <YAxis stroke="#8899AA" tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2332',
            border: '1px solid #2A3A4A',
            borderRadius: 8,
            color: '#E8EFF5',
          }}
        />
        <Line
          type="monotone"
          dataKey="kdRatio"
          stroke="#F0A500"
          strokeWidth={2}
          dot={false}
          name="K/D"
        />
        <Line
          type="monotone"
          dataKey="avgKills"
          stroke="#4A9EFF"
          strokeWidth={2}
          dot={false}
          name="Avg Kills"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
