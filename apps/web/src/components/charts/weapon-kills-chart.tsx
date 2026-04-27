'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { WeaponStat } from '@cs2-tracker/types'
import { getWeaponLabel } from '@/lib/weapons'

export function WeaponKillsChart({ data }: { data: WeaponStat[] }) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-cs-muted text-sm">
        Sem dados
      </div>
    )
  }

  const top10 = data.slice(0, 10).map((d) => ({
    label: getWeaponLabel(d.weapon),
    kills: d.kills,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 16, left: 100, bottom: 0 }}>
        <XAxis type="number" stroke="#8899AA" tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="label"
          stroke="#8899AA"
          tick={{ fontSize: 11, fill: '#8899AA' }}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2332',
            border: '1px solid #2A3A4A',
            borderRadius: 8,
            color: '#E8EFF5',
            fontSize: 12,
          }}
          formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Kills']}
        />
        <Bar dataKey="kills" fill="#FF6B35" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
