'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { AddMatchModal } from './add-match-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { TrashIcon } from '@/components/ui/icons'
import type { Match, PaginatedResponse } from '@cs2-tracker/types'

const resultColors = { WIN: 'text-green-400', LOSS: 'text-red-400', DRAW: 'text-yellow-400' }
const resultLabels = { WIN: 'Vitória', LOSS: 'Derrota', DRAW: 'Empate' }

export function MatchesClient({ initialData }: { initialData: PaginatedResponse<Match> }) {
  const [data, setData] = useState(initialData)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Match | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.matches.delete(deleteTarget.id)
      setData((prev) => ({
        ...prev,
        data: prev.data.filter((m) => m.id !== deleteTarget.id),
        total: prev.total - 1,
      }))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  function handleAdded(match: Match) {
    setData((prev) => ({ ...prev, data: [match, ...prev.data], total: prev.total + 1 }))
    setShowAddModal(false)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cs-orange text-cs-dark text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          + Nova Partida
        </button>
      </div>

      {data.data.length === 0 ? (
        <div className="text-center py-16 text-cs-muted">
          <p className="text-4xl mb-4">🎮</p>
          <p>Nenhuma partida registrada.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-cs-orange hover:underline text-sm"
          >
            Cadastre sua primeira partida
          </button>
        </div>
      ) : (
        <div className="bg-cs-card border border-cs-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cs-border">
                {['Resultado', 'Mapa', 'Modo', 'K/D/A', 'HS%', 'MVPs', 'Data', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-cs-muted font-medium text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((match) => (
                <tr key={match.id} className="border-b border-cs-border/50 hover:bg-white/5">
                  <td className={`px-4 py-3 font-semibold ${resultColors[match.result]}`}>
                    {resultLabels[match.result]}
                  </td>
                  <td className="px-4 py-3 text-white">{match.map}</td>
                  <td className="px-4 py-3 text-cs-muted">{match.mode}</td>
                  <td className="px-4 py-3 font-mono text-white">
                    {match.kills}/{match.deaths}/{match.assists}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {match.kills > 0
                      ? `${((match.headshots / match.kills) * 100).toFixed(0)}%`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-white">{match.mvps}</td>
                  <td className="px-4 py-3 text-cs-muted">
                    {new Date(match.playedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeleteTarget(match)}
                      className="text-cs-muted hover:text-red-400 transition-colors"
                      title="Remover partida"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 text-cs-muted text-xs">
            {data.total} partida{data.total !== 1 ? 's' : ''} no total
          </div>
        </div>
      )}

      {showAddModal && (
        <AddMatchModal onClose={() => setShowAddModal(false)} onAdded={handleAdded} />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Remover partida"
          description={`Tem certeza que deseja remover a partida em ${deleteTarget.map} (${new Date(deleteTarget.playedAt).toLocaleDateString('pt-BR')})?`}
          confirmLabel="Remover"
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
