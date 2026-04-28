'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard',    icon: '📊' },
  { href: '/matches',   label: 'Partidas',     icon: '🎮' },
  { href: '/weapons',   label: 'Armas',        icon: '🔫' },
  { href: '/stats',     label: 'Estatísticas', icon: '📈' },
]

export function Sidebar({ user }: { user: { username: string; avatarUrl: string | null } }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 h-full bg-cs-card border-r border-cs-border flex-col">
      <div className="p-6 border-b border-cs-border">
        <span className="text-xl font-bold text-white">🎯 CS2 Tracker</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-cs-orange text-cs-dark'
                : 'text-cs-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-cs-border">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-cs-border flex items-center justify-center text-xs">
              {user.username[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.username}</p>
          </div>
          <form action="/api/logout" method="POST">
            <button className="text-cs-muted hover:text-white text-xs transition-colors">
              Sair
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
