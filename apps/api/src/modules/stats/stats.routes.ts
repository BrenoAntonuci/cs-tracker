import type { FastifyInstance } from 'fastify'
import { StatsService } from './stats.service.js'
import { z } from 'zod'

export async function statsRoutes(app: FastifyInstance) {
  const statsService = new StatsService()

  app.addHook('preHandler', app.authenticate)

  app.get('/overview', async (request) => {
    return statsService.getOverview(request.user.userId)
  })

  app.get('/by-map', async (request) => {
    return statsService.getByMap(request.user.userId)
  })

  app.get('/by-mode', async (request) => {
    return statsService.getByMode(request.user.userId)
  })

  app.get('/timeline', async (request) => {
    const query = z
      .object({ groupBy: z.enum(['week', 'month']).default('week') })
      .parse(request.query)
    return statsService.getTimeline(request.user.userId, query.groupBy)
  })

  app.get('/weapons', async (request) => {
    return statsService.getWeaponStats(request.user.userId)
  })
}
