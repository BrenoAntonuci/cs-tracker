import type { FastifyInstance } from 'fastify'
import { SteamService } from './steam.service.js'

export async function steamRoutes(app: FastifyInstance) {
  const steamService = new SteamService()

  app.addHook('preHandler', app.authenticate)

  // Trigger Steam stats sync (rate limited by Redis TTL)
  app.post('/sync', async (request, reply) => {
    try {
      const stats = await steamService.syncStats(request.user.userId)
      return stats
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed'
      return reply.status(429).send({ message })
    }
  })

  // Get last synced Steam stats
  app.get('/stats', async (request) => {
    return steamService.getStats(request.user.userId)
  })
}
