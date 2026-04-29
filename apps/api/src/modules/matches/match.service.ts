import { prisma } from '../../lib/prisma.js'
import type { CreateMatchInput, MatchQuery } from './match.schema.js'

export class MatchService {
  async create(userId: string, data: CreateMatchInput) {
    return prisma.match.create({
      data: {
        userId,
        map: data.map,
        mode: data.mode,
        result: data.result,
        kills: data.kills,
        deaths: data.deaths,
        assists: data.assists,
        headshots: data.headshots,
        mvps: data.mvps,
        score: data.score,
        teamScore: data.teamScore,
        enemyScore: data.enemyScore,
        duration: data.duration,
        playedAt: new Date(data.playedAt),
      },
    })
  }

  async findAll(userId: string, query: MatchQuery) {
    const { page, pageSize, map, mode, result, from, to } = query
    const skip = (page - 1) * pageSize

    const where = {
      userId,
      ...(map && { map }),
      ...(mode && { mode }),
      ...(result && { result }),
      ...(from || to
        ? {
            playedAt: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
            },
          }
        : {}),
    }

    const [data, total] = await Promise.all([
      prisma.match.findMany({
        where,
        orderBy: { playedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.match.count({ where }),
    ])

    return { data, total, page, pageSize }
  }

  async findById(userId: string, matchId: string) {
    const match = await prisma.match.findFirst({
      where: { id: matchId, userId },
    })
    if (!match) throw new Error('Match not found')
    return match
  }

  async delete(userId: string, matchId: string) {
    const match = await prisma.match.findFirst({
      where: { id: matchId, userId },
    })
    if (!match) throw new Error('Match not found')
    await prisma.match.delete({ where: { id: matchId } })
  }
}
