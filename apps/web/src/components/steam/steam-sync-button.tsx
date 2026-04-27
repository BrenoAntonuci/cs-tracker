'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export function SteamSyncButton({ lastSynced }: { lastSynced: string | null }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSync() {
    setLoading(true)
    setMessage(null)
    try {
      await api.steam.sync()
      setMessage('Stats sincronizadas!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao sincronizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSync}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-cs-orange text-cs-dark text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? (
          <>
            <span className="animate-spin">⟳</span> Sincronizando...
          </>
        ) : (
          <>🎮 Sync Steam</>
        )}
      </button>
      {lastSynced && (
        <p className="text-xs text-cs-muted">
          Última sync: {new Date(lastSynced).toLocaleDateString('pt-BR')}
        </p>
      )}
      {message && (
        <p className={`text-xs ${message.includes('!') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
