'use client'

import { useState, useRef, useEffect } from 'react'
import type { UserListItem } from '@cs2-tracker/types'

interface UserSearchProps {
  users: UserListItem[]
  onSelect: (userId: string) => void
}

export function UserSearch({ users, onSelect }: UserSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(user: UserListItem) {
    setQuery(user.username)
    setOpen(false)
    onSelect(user.id)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar jogador..."
        className="w-full px-4 py-3 bg-cs-card border border-cs-border rounded-xl text-white placeholder-cs-muted focus:outline-none focus:border-cs-orange transition-colors"
      />

      {open && query.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-cs-card border border-cs-border rounded-xl shadow-xl z-50 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-cs-muted text-sm">Nenhum jogador encontrado.</p>
          ) : (
            <ul>
              {filtered.map((user) => (
                <li key={user.id}>
                  <button
                    onClick={() => handleSelect(user)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cs-border flex items-center justify-center text-xs text-white flex-shrink-0">
                        {user.username[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-white">{user.username}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
