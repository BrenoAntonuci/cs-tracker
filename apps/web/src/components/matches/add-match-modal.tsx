'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { Match, GameMode, MatchResult } from '@cs2-tracker/types'

const CS2_MAPS = [
  'de_dust2', 'de_mirage', 'de_inferno', 'de_nuke', 'de_overpass',
  'de_vertigo', 'de_ancient', 'de_anubis', 'de_train', 'de_cache',
]

const MODES: GameMode[] = ['COMPETITIVE', 'PREMIER', 'WINGMAN', 'DEATHMATCH', 'CASUAL']
const RESULTS: MatchResult[] = ['WIN', 'LOSS', 'DRAW']

export function AddMatchModal({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: (match: Match) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    map: 'de_dust2',
    mode: 'COMPETITIVE' as GameMode,
    result: 'WIN' as MatchResult,
    kills: 0,
    deaths: 0,
    assists: 0,
    headshots: 0,
    mvps: 0,
    score: 0,
    duration: '',
    playedAt: new Date().toISOString().slice(0, 16),
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const match = await api.matches.create({
        ...form,
        playedAt: new Date(form.playedAt).toISOString(),
        duration: form.duration ? Number(form.duration) : undefined,
      })
      onAdded(match)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar partida')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-cs-card border border-cs-border rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-cs-border">
          <h2 className="text-white font-bold">Nova Partida</h2>
          <button onClick={onClose} className="text-cs-muted hover:text-white text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cs-muted mb-1">Mapa</label>
              <select
                value={form.map}
                onChange={(e) => set('map', e.target.value)}
                className="w-full bg-cs-dark border border-cs-border rounded-lg px-3 py-2 text-white text-sm"
              >
                {CS2_MAPS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-cs-muted mb-1">Modo</label>
              <select
                value={form.mode}
                onChange={(e) => set('mode', e.target.value as GameMode)}
                className="w-full bg-cs-dark border border-cs-border rounded-lg px-3 py-2 text-white text-sm"
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-cs-muted mb-1">Resultado</label>
            <div className="flex gap-2">
              {RESULTS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set('result', r)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.result === r
                      ? r === 'WIN'
                        ? 'bg-green-500 text-white'
                        : r === 'LOSS'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-cs-dark'
                      : 'bg-cs-dark border border-cs-border text-cs-muted hover:text-white'
                  }`}
                >
                  {r === 'WIN' ? 'Vitória' : r === 'LOSS' ? 'Derrota' : 'Empate'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['kills', 'deaths', 'assists', 'headshots', 'mvps', 'score'] as const).map(
              (field) => (
                <div key={field}>
                  <label className="block text-xs text-cs-muted mb-1 capitalize">{field}</label>
                  <input
                    type="number"
                    min="0"
                    value={form[field]}
                    onChange={(e) => set(field, Number(e.target.value))}
                    className="w-full bg-cs-dark border border-cs-border rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              ),
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cs-muted mb-1">Duração (min)</label>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                placeholder="Opcional"
                className="w-full bg-cs-dark border border-cs-border rounded-lg px-3 py-2 text-white text-sm placeholder:text-cs-muted"
              />
            </div>
            <div>
              <label className="block text-xs text-cs-muted mb-1">Data/Hora</label>
              <input
                type="datetime-local"
                value={form.playedAt}
                onChange={(e) => set('playedAt', e.target.value)}
                className="w-full bg-cs-dark border border-cs-border rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-cs-border text-cs-muted rounded-lg hover:text-white hover:border-white/20 text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-cs-orange text-cs-dark font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 text-sm transition-opacity"
            >
              {loading ? 'Salvando...' : 'Salvar Partida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
