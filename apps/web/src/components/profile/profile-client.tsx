'use client'

import { useState } from 'react'
import type { UserListItem, UserProfile } from '@cs2-tracker/types'
import { UserSearch } from './user-search'
import { UserProfileCard } from './user-profile-card'
import { api } from '@/lib/api'

interface ProfileClientProps {
  users: UserListItem[]
}

export function ProfileClient({ users }: ProfileClientProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSelect(userId: string) {
    setLoading(true)
    setError(null)
    setProfile(null)
    try {
      const data = await api.users.profile(userId)
      setProfile(data)
    } catch {
      setError('Não foi possível carregar o perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Perfis</h1>
        <p className="text-cs-muted text-sm">Visualize as estatísticas de outros jogadores</p>
      </div>

      <UserSearch users={users} onSelect={handleSelect} />

      {loading && (
        <div className="text-center py-16 text-cs-muted text-sm">Carregando perfil...</div>
      )}

      {error && (
        <div className="text-center py-16 text-red-400 text-sm">{error}</div>
      )}

      {!loading && !error && profile && (
        <UserProfileCard profile={profile} />
      )}

      {!loading && !error && !profile && (
        <div className="text-center py-16 text-cs-muted">
          <p className="text-5xl mb-4">👤</p>
          <p className="text-sm">Busque um jogador acima para ver o perfil.</p>
        </div>
      )}
    </div>
  )
}
