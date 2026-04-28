import { prisma } from '../../lib/prisma.js'
import { StatsService } from '../stats/stats.service.js'

const statsService = new StatsService()

export class UsersService {
  async listUsers() {
    return prisma.user.findMany({
      select: { id: true, username: true, avatarUrl: true },
      orderBy: { username: 'asc' },
    })
  }

  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, avatarUrl: true },
    })

    if (!user) return null

    const [overview, recentMatches, statsByMap, weapons] = await Promise.all([
      statsService.getOverview(userId),
      prisma.match.findMany({
        where: { userId },
        orderBy: { playedAt: 'desc' },
        take: 10,
      }),
      statsService.getByMap(userId),
      statsService.getWeaponStats(userId),
    ])

    return { user, overview, recentMatches, statsByMap, weapons }
  }
}
