import type { FastifyInstance } from 'fastify'
import { UsersService } from './users.service.js'

export async function usersRoutes(app: FastifyInstance) {
  const usersService = new UsersService()

  app.addHook('preHandler', app.authenticate)

  app.get('/', async () => {
    return usersService.listUsers()
  })

  app.get('/:userId/profile', async (request, reply) => {
    const { userId } = request.params as { userId: string }
    const profile = await usersService.getUserProfile(userId)
    if (!profile) return reply.status(404).send({ message: 'Usuário não encontrado' })
    return profile
  })
}
