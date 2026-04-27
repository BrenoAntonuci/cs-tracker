export type WeaponCategory = 'rifle' | 'pistol' | 'smg' | 'shotgun' | 'sniper' | 'heavy' | 'utility'

interface WeaponInfo {
  label: string
  category: WeaponCategory
  ext?: string
}

const WEAPON_INFO: Record<string, WeaponInfo> = {
  ak47:      { label: 'AK-47',         category: 'rifle'   },
  m4a1:      { label: 'M4A4',          category: 'rifle'   },
  galilar:   { label: 'Galil AR',      category: 'rifle'   },
  famas:     { label: 'FAMAS',         category: 'rifle'   },
  aug:       { label: 'AUG',           category: 'rifle'   },
  sg556:     { label: 'SG 553',        category: 'rifle'   },
  awp:       { label: 'AWP',           category: 'sniper'  },
  ssg08:     { label: 'SSG 08',        category: 'sniper'  },
  g3sg1:     { label: 'G3SG1',         category: 'sniper'  },
  scar20:    { label: 'SCAR-20',       category: 'sniper'  },
  glock:     { label: 'Glock-18',      category: 'pistol'  },
  deagle:    { label: 'Desert Eagle',  category: 'pistol'  },
  elite:     { label: 'Dual Berettas', category: 'pistol'  },
  fiveseven: { label: 'Five-SeveN',    category: 'pistol'  },
  hkp2000:   { label: 'P2000',         category: 'pistol'  },
  p250:      { label: 'P250',          category: 'pistol'  },
  tec9:      { label: 'Tec-9',         category: 'pistol'  },
  mac10:     { label: 'MAC-10',        category: 'smg'     },
  ump45:     { label: 'UMP-45',        category: 'smg'     },
  p90:       { label: 'P90',           category: 'smg'     },
  mp7:       { label: 'MP7',           category: 'smg'     },
  mp9:       { label: 'MP9',           category: 'smg'     },
  bizon:     { label: 'PP-Bizon',      category: 'smg'     },
  xm1014:    { label: 'XM1014',        category: 'shotgun' },
  nova:      { label: 'Nova',          category: 'shotgun' },
  sawedoff:  { label: 'Sawed-Off',     category: 'shotgun' },
  mag7:      { label: 'MAG-7',         category: 'shotgun' },
  m249:      { label: 'M249',          category: 'heavy'   },
  negev:     { label: 'Negev',         category: 'heavy'   },
  knife:     { label: 'Faca',          category: 'utility' },
  hegrenade: { label: 'Granada HE',    category: 'utility' },
  molotov:   { label: 'Molotov',       category: 'utility' },
  taser:     { label: 'Zeus x27',      category: 'utility' },
}

export function getWeaponInfo(weapon: string): WeaponInfo | null {
  return WEAPON_INFO[weapon] ?? null
}

export function getWeaponLabel(weapon: string): string {
  return WEAPON_INFO[weapon]?.label ?? weapon
}

export function getWeaponImageUrl(weapon: string): string | null {
  const info = WEAPON_INFO[weapon]
  if (!info) return null
  return `/weapons/${weapon}.${info.ext ?? 'webp'}`
}

export const CATEGORY_LABELS: Record<WeaponCategory, string> = {
  rifle:   'Rifles',
  pistol:  'Pistolas',
  smg:     'SMGs',
  shotgun: 'Escopetas',
  sniper:  'Snipers',
  heavy:   'Metralhadoras',
  utility: 'Utilitários',
}

export const CATEGORY_COLORS: Record<WeaponCategory, string> = {
  rifle:   'text-blue-400',
  pistol:  'text-yellow-400',
  smg:     'text-purple-400',
  shotgun: 'text-orange-400',
  sniper:  'text-red-400',
  heavy:   'text-pink-400',
  utility: 'text-green-400',
}
