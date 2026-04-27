import { prisma } from '../../lib/prisma.js'
import type { WeaponStat } from '@cs2-tracker/types'

type MatchRow = { result: string; kills: number; deaths: number; headshots: number }
type MapMatchRow = { map: string; result: string; kills: number; deaths: number }
type ModeMatchRow = { mode: string; result: string; kills: number }
type TimelineMatchRow = { playedAt: Date; result: string; kills: number; deaths: number }

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {}
  for (const item of items) {
    const k = key(item)
    if (!groups[k]) groups[k] = []
    groups[k].push(item)
  }
  return groups
}

export class StatsService {
  async getOverview(userId: string) {
    const matches: MatchRow[] = await prisma.match.findMany({
      where: { userId },
      select: { result: true, kills: true, deaths: true, headshots: true },
    })

    if (matches.length === 0) {
      return { kdRatio: 0, winRate: 0, hsPercentage: 0, avgKills: 0, totalMatches: 0, totalWins: 0 }
    }

    let totalKills = 0, totalDeaths = 0, totalHeadshots = 0, totalWins = 0
    for (const m of matches) {
      totalKills += m.kills
      totalDeaths += m.deaths
      totalHeadshots += m.headshots
      if (m.result === 'WIN') totalWins++
    }

    return {
      kdRatio: totalDeaths > 0 ? Number((totalKills / totalDeaths).toFixed(2)) : totalKills,
      winRate: Number(((totalWins / matches.length) * 100).toFixed(1)),
      hsPercentage: totalKills > 0 ? Number(((totalHeadshots / totalKills) * 100).toFixed(1)) : 0,
      avgKills: Number((totalKills / matches.length).toFixed(1)),
      totalMatches: matches.length,
      totalWins,
    }
  }

  async getByMap(userId: string) {
    const matches: MapMatchRow[] = await prisma.match.findMany({
      where: { userId },
      select: { map: true, result: true, kills: true, deaths: true },
    })

    const groups = groupBy(matches, (m) => m.map)

    return Object.entries(groups).map(([map, mapMatches]) => {
      let wins = 0, totalKills = 0, totalDeaths = 0
      for (const m of mapMatches) {
        if (m.result === 'WIN') wins++
        totalKills += m.kills
        totalDeaths += m.deaths
      }
      return {
        map,
        matches: mapMatches.length,
        wins,
        winRate: Number(((wins / mapMatches.length) * 100).toFixed(1)),
        avgKills: Number((totalKills / mapMatches.length).toFixed(1)),
        avgDeaths: Number((totalDeaths / mapMatches.length).toFixed(1)),
      }
    })
  }

  async getByMode(userId: string) {
    const matches: ModeMatchRow[] = await prisma.match.findMany({
      where: { userId },
      select: { mode: true, result: true, kills: true },
    })

    const groups = groupBy(matches, (m) => m.mode)

    return Object.entries(groups).map(([mode, modeMatches]) => {
      let wins = 0, totalKills = 0
      for (const m of modeMatches) {
        if (m.result === 'WIN') wins++
        totalKills += m.kills
      }
      return {
        mode,
        matches: modeMatches.length,
        wins,
        winRate: Number(((wins / modeMatches.length) * 100).toFixed(1)),
        avgKills: Number((totalKills / modeMatches.length).toFixed(1)),
      }
    })
  }

  async getTimeline(userId: string, groupBy_: 'week' | 'month' = 'week') {
    const matches: TimelineMatchRow[] = await prisma.match.findMany({
      where: { userId },
      select: { playedAt: true, result: true, kills: true, deaths: true },
      orderBy: { playedAt: 'asc' },
    })

    const groups = groupBy(matches, (match) => {
      const date = new Date(match.playedAt)
      return groupBy_ === 'week'
        ? `${date.getFullYear()}-W${String(getWeekNumber(date)).padStart(2, '0')}`
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    })

    return Object.entries(groups).map(([period, periodMatches]) => {
      let wins = 0, totalKills = 0, totalDeaths = 0
      for (const m of periodMatches) {
        if (m.result === 'WIN') wins++
        totalKills += m.kills
        totalDeaths += m.deaths
      }
      return {
        period,
        matches: periodMatches.length,
        wins,
        avgKills: Number((totalKills / periodMatches.length).toFixed(1)),
        kdRatio: totalDeaths > 0 ? Number((totalKills / totalDeaths).toFixed(2)) : totalKills,
      }
    })
  }

  async getWeaponStats(userId: string): Promise<WeaponStat[]> {
    const steamStats = await prisma.steamStats.findUnique({ where: { userId } })
    if (!steamStats) return []

    const rawData = steamStats.rawData as Array<{ name: string; value: number }>
    const lookup: Record<string, number> = {}
    for (const { name, value } of rawData) {
      lookup[name] = value
    }

    const EXCLUDED = new Set([
      'enemy_weapon', 'knife_fight', 'against_zoomed_sniper', 'enemy_blinded', 'headshot',
    ])

    const weapons = Object.keys(lookup)
      .filter((k) => k.startsWith('total_kills_'))
      .map((k) => k.replace('total_kills_', ''))
      .filter((w) => !EXCLUDED.has(w))

    const result: WeaponStat[] = []
    for (const weapon of weapons) {
      const kills = lookup[`total_kills_${weapon}`] ?? 0
      const shots = lookup[`total_shots_${weapon}`] ?? 0
      const hits = lookup[`total_hits_${weapon}`] ?? 0
      const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0
      if (kills > 0) result.push({ weapon, kills, shots, hits, accuracy })
    }

    return result.sort((a, b) => b.kills - a.kills)
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
