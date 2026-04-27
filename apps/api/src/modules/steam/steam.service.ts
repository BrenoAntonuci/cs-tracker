import { prisma } from '../../lib/prisma.js'

const STEAM_API_BASE = 'https://api.steampowered.com'
const CS2_APP_ID = 730
const SYNC_COOLDOWN_MS = 60 * 60 * 1000 // 1 hora

interface SteamStatValue {
  name: string
  value: number
}

interface SteamStatsResponse {
  playerstats?: {
    stats?: SteamStatValue[]
  }
}

export class SteamService {
  async syncStats(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.steamId) throw new Error('User has no Steam account linked')

    const existing = await prisma.steamStats.findUnique({ where: { userId } })
    if (existing) {
      const elapsed = Date.now() - existing.lastSyncedAt.getTime()
      if (elapsed < SYNC_COOLDOWN_MS) {
        const minutesLeft = Math.ceil((SYNC_COOLDOWN_MS - elapsed) / 60000)
        throw new Error(`Steam stats synced recently. Try again in ${minutesLeft} minute(s).`)
      }
    }

    const url = new URL(`${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v2/`)
    url.searchParams.set('key', process.env.STEAM_API_KEY!)
    url.searchParams.set('steamid', user.steamId)
    url.searchParams.set('appid', String(CS2_APP_ID))

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch Steam stats')

    const data = (await response.json()) as SteamStatsResponse
    const stats = data.playerstats?.stats

    if (!stats) throw new Error('No stats available. Profile may be private.')

    const parsed = this.parseStats(stats)

    return prisma.steamStats.upsert({
      where: { userId },
      update: { ...parsed, lastSyncedAt: new Date(), rawData: stats as object },
      create: { userId, ...parsed, lastSyncedAt: new Date(), rawData: stats as object },
    })
  }

  async getStats(userId: string) {
    return prisma.steamStats.findUnique({ where: { userId } })
  }

  private parseStats(stats: SteamStatValue[]) {
    const get = (name: string) => stats.find((s) => s.name === name)?.value ?? 0

    const totalKills = get('total_kills')
    const totalDeaths = get('total_deaths')
    const totalShots = get('total_shots_fired')
    const totalHits = get('total_shots_hit')
    const totalHsKills = get('total_kills_headshot')
    const totalWins = get('total_wins')
    const totalRoundsPlayed = get('total_rounds_played')

    return {
      totalKills,
      totalDeaths,
      totalWins,
      totalMatches: Math.ceil(totalRoundsPlayed / 24) || 1,
      accuracy: totalShots > 0 ? Number(((totalHits / totalShots) * 100).toFixed(2)) : 0,
      hsPercentage: totalKills > 0 ? Number(((totalHsKills / totalKills) * 100).toFixed(2)) : 0,
    }
  }
}
