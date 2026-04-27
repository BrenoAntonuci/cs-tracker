import type {
  Match,
  CreateMatchBody,
  StatsOverview,
  StatsByMap,
  StatsByMode,
  TimelineEntry,
  SteamStats,
  WeaponStat,
  PaginatedResponse,
} from '@cs2-tracker/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type RequestOptions = {
  method?: string
  body?: unknown
  cache?: RequestCache
  tags?: string[]
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, cache, tags } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  // In server components, forward cookies from the request
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (token) headers['Cookie'] = `token=${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next: tags ? { tags } : undefined,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  auth: {
    me: () =>
      request<{ id: string; username: string; avatarUrl: string | null; steamId: string | null }>(
        '/auth/me',
      ),
    logout: () => request('/auth/logout', { method: 'POST' }),
    steamLoginUrl: () => `${API_URL}/auth/steam`,
  },

  matches: {
    list: (params?: Record<string, string | number>) => {
      const qs = params
        ? '?' + new URLSearchParams(params as Record<string, string>).toString()
        : ''
      return request<PaginatedResponse<Match>>(`/matches${qs}`)
    },
    create: (body: CreateMatchBody) =>
      request<Match>('/matches', { method: 'POST', body }),
    delete: (id: string) => request(`/matches/${id}`, { method: 'DELETE' }),
  },

  stats: {
    overview: () => request<StatsOverview>('/stats/overview', { tags: ['stats'] }),
    byMap: () => request<StatsByMap[]>('/stats/by-map', { tags: ['stats'] }),
    byMode: () => request<StatsByMode[]>('/stats/by-mode', { tags: ['stats'] }),
    timeline: (groupBy: 'week' | 'month' = 'week') =>
      request<TimelineEntry[]>(`/stats/timeline?groupBy=${groupBy}`, { tags: ['stats'] }),
    weapons: () => request<WeaponStat[]>('/stats/weapons', { tags: ['stats'] }),
  },

  steam: {
    sync: () => request('/steam/sync', { method: 'POST' }),
    stats: () => request<SteamStats | null>('/steam/stats'),
  },
}
