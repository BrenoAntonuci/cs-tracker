import { z } from 'zod'

export const createMatchSchema = z.object({
  map: z.string().min(1).max(50),
  mode: z.enum(['COMPETITIVE', 'PREMIER', 'WINGMAN', 'DEATHMATCH', 'CASUAL']),
  result: z.enum(['WIN', 'LOSS', 'DRAW']),
  kills: z.number().int().min(0).max(500),
  deaths: z.number().int().min(0).max(500),
  assists: z.number().int().min(0).max(500),
  headshots: z.number().int().min(0).max(500),
  mvps: z.number().int().min(0).max(50),
  score: z.number().int().min(0),
  teamScore: z.number().int().min(0).max(30).optional(),
  enemyScore: z.number().int().min(0).max(30).optional(),
  duration: z.number().int().min(1).max(300).optional(),
  playedAt: z.string().datetime(),
})

export const matchQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  map: z.string().optional(),
  mode: z.enum(['COMPETITIVE', 'PREMIER', 'WINGMAN', 'DEATHMATCH', 'CASUAL']).optional(),
  result: z.enum(['WIN', 'LOSS', 'DRAW']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

export type CreateMatchInput = z.infer<typeof createMatchSchema>
export type MatchQuery = z.infer<typeof matchQuerySchema>
