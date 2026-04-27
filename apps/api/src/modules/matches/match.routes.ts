import type { FastifyInstance } from 'fastify'
import { MatchService } from './match.service.js'
import { createMatchSchema, matchQuerySchema } from './match.schema.js'

export async function matchRoutes(app: FastifyInstance) {
  const matchService = new MatchService()

  app.addHook('preHandler', app.authenticate)

  app.post('/', async (request, reply) => {
    const body = createMatchSchema.parse(request.body)
    const match = await matchService.create(request.user.userId, body)
    return reply.status(201).send(match)
  })

  app.get('/', async (request) => {
    const query = matchQuerySchema.parse(request.query)
    return matchService.findAll(request.user.userId, query)
  })

  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    return matchService.findById(request.user.userId, id)
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await matchService.delete(request.user.userId, id)
    return reply.status(204).send()
  })
}
