import Fastify from 'fastify'
import { jwtPlugin } from './plugins/jwt.js'
import { corsPlugin } from './plugins/cors.js'
import { helmetPlugin } from './plugins/helmet.js'
import { rateLimitPlugin } from './plugins/rate-limit.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { matchRoutes } from './modules/matches/match.routes.js'
import { statsRoutes } from './modules/stats/stats.routes.js'
import { steamRoutes } from './modules/steam/steam.routes.js'
import { usersRoutes } from './modules/users/users.routes.js'

export async function buildApp() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
  })

  await app.register(helmetPlugin)
  await app.register(corsPlugin)
  await app.register(rateLimitPlugin)
  await app.register(jwtPlugin)

  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(matchRoutes, { prefix: '/matches' })
  await app.register(statsRoutes, { prefix: '/stats' })
  await app.register(steamRoutes, { prefix: '/steam' })
  await app.register(usersRoutes, { prefix: '/users' })

  app.get('/health', async () => ({ status: 'ok' }))

  return app
}
