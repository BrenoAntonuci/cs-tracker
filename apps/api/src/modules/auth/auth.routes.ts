import type { FastifyInstance } from 'fastify'
import { AuthService } from './auth.service.js'

export async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService()

  // Redirect to Steam OpenID
  app.get('/steam', async (request, reply) => {
    const steamLoginUrl = authService.getSteamLoginUrl()
    return reply.redirect(steamLoginUrl)
  })

  // Steam OpenID callback
  app.get('/steam/callback', async (request, reply) => {
    try {
      const query = request.query as Record<string, string>
      const user = await authService.handleSteamCallback(query)
      const token = app.jwt.sign({ userId: user.id, steamId: user.steamId })

      reply.setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return reply.redirect(`${process.env.FRONTEND_URL}/dashboard`)
    } catch (err) {
      app.log.error(err)
      return reply.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`)
    }
  })

  // Get current user
  app.get('/me', { preHandler: [app.authenticate] }, async (request) => {
    const { userId } = request.user
    return authService.getUser(userId)
  })

  // Logout
  app.post('/logout', async (request, reply) => {
    reply.clearCookie('token', { path: '/' })
    return { message: 'Logged out' }
  })
}
