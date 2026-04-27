'use client'

import { useState, useMemo } from 'react'
import { WeaponCard } from './weapon-card'
import { getWeaponInfo, getWeaponLabel, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/weapons'
import type { WeaponCategory } from '@/lib/weapons'
import type { WeaponStat } from '@cs2-tracker/types'

const CATEGORIES: WeaponCategory[] = ['rifle', 'sniper', 'pistol', 'smg', 'shotgun', 'heavy', 'utility']

export function WeaponsClient({ weapons }: { weapons: WeaponStat[] }) {
  const [activeCategory, setActiveCategory] = useState<WeaponCategory | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return weapons.filter((w) => {
      const matchesCategory = !activeCategory || getWeaponInfo(w.weapon)?.category === activeCategory
      const matchesSearch = !search || getWeaponLabel(w.weapon).toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [weapons, activeCategory, search])

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Category buttons */}
        <div className="flex flex-wrap gap-2 flex-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              activeCategory === null
                ? 'bg-cs-orange text-cs-dark border-cs-orange'
                : 'border-cs-border text-cs-muted hover:text-white hover:border-white/30'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => {
            const count = weapons.filter((w) => getWeaponInfo(w.weapon)?.category === cat).length
            if (count === 0) return null
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  isActive
                    ? 'bg-cs-orange text-cs-dark border-cs-orange'
                    : 'border-cs-border text-cs-muted hover:text-white hover:border-white/30'
                }`}
              >
                <span className={isActive ? '' : CATEGORY_COLORS[cat]}>
                  {CATEGORY_LABELS[cat]}
                </span>
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar arma..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-48 bg-cs-card border border-cs-border rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-cs-muted focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-cs-muted text-sm">
          Nenhuma arma encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filtered.map((stat) => (
            <WeaponCard key={stat.weapon} stat={stat} />
          ))}
        </div>
      )}
    </div>
  )
}
