import { prisma } from '../../lib/prisma.js'

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login'
const CS2_APP_ID = 730

export class AuthService {
  getSteamLoginUrl(): string {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': process.env.STEAM_RETURN_URL!,
      'openid.realm': process.env.STEAM_RETURN_URL!.replace('/auth/steam/callback', ''),
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    })

    return `${STEAM_OPENID_URL}?${params.toString()}`
  }

  async handleSteamCallback(query: Record<string, string>) {
    const steamId = this.extractSteamId(query['openid.claimed_id'])
    if (!steamId) throw new Error('Invalid Steam OpenID response')

    const isValid = await this.verifySteamLogin(query)
    if (!isValid) throw new Error('Steam login verification failed')

    const profile = await this.fetchSteamProfile(steamId)

    const user = await prisma.user.upsert({
      where: { steamId },
      update: {
        username: profile.personaname,
        avatarUrl: profile.avatarfull,
      },
      create: {
        steamId,
        username: profile.personaname,
        avatarUrl: profile.avatarfull,
      },
    })

    return user
  }

  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, steamId: true, username: true, avatarUrl: true, createdAt: true },
    })
    if (!user) throw new Error('User not found')
    return user
  }

  private extractSteamId(claimedId: string | undefined): string | null {
    if (!claimedId) return null
    const match = claimedId.match(/https:\/\/steamcommunity\.com\/openid\/id\/(\d+)/)
    return match ? match[1] : null
  }

  private async verifySteamLogin(query: Record<string, string>): Promise<boolean> {
    const params = new URLSearchParams({ ...query, 'openid.mode': 'check_authentication' })
    const response = await fetch(STEAM_OPENID_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const text = await response.text()
    return text.includes('is_valid:true')
  }

  private async fetchSteamProfile(steamId: string) {
    const url = new URL('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/')
    url.searchParams.set('key', process.env.STEAM_API_KEY!)
    url.searchParams.set('steamids', steamId)

    const response = await fetch(url.toString())
    const data = (await response.json()) as {
      response: { players: Array<{ personaname: string; avatarfull: string }> }
    }

    const player = data.response.players[0]
    if (!player) throw new Error('Steam profile not found')
    return player
  }
}

export { CS2_APP_ID }
