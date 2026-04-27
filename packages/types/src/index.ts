export type GameMode = 'COMPETITIVE' | 'PREMIER' | 'WINGMAN' | 'DEATHMATCH' | 'CASUAL'
export type MatchResult = 'WIN' | 'LOSS' | 'DRAW'

export interface User {
  id: string
  steamId: string | null
  email: string | null
  username: string
  avatarUrl: string | null
  createdAt: string
}

export interface Match {
  id: string
  userId: string
  map: string
  mode: GameMode
  result: MatchResult
  kills: number
  deaths: number
  assists: number
  headshots: number
  mvps: number
  score: number
  duration: number | null
  playedAt: string
  createdAt: string
}

export interface SteamStats {
  id: string
  userId: string
  totalKills: number
  totalDeaths: number
  totalWins: number
  totalMatches: number
  accuracy: number
  hsPercentage: number
  lastSyncedAt: string
}

export interface StatsOverview {
  kdRatio: number
  winRate: number
  hsPercentage: number
  avgKills: number
  totalMatches: number
  totalWins: number
}

export interface StatsByMap {
  map: string
  matches: number
  wins: number
  winRate: number
  avgKills: number
  avgDeaths: number
}

export interface StatsByMode {
  mode: GameMode
  matches: number
  wins: number
  winRate: number
  avgKills: number
}

export interface TimelineEntry {
  period: string
  matches: number
  wins: number
  avgKills: number
  kdRatio: number
}

export interface WeaponStat {
  weapon: string
  kills: number
  shots: number
  hits: number
  accuracy: number
}

// API request/response shapes
export interface CreateMatchBody {
  map: string
  mode: GameMode
  result: MatchResult
  kills: number
  deaths: number
  assists: number
  headshots: number
  mvps: number
  score: number
  duration?: number
  playedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  message: string
  code?: string
}
