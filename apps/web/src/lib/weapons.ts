const STEAM_CDN = 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/weapons/base_weapons'

export type WeaponCategory = 'rifle' | 'pistol' | 'smg' | 'shotgun' | 'sniper' | 'heavy' | 'utility'

interface WeaponInfo {
  label: string
  category: WeaponCategory
  steamName: string
}

const WEAPON_INFO: Record<string, WeaponInfo> = {
  ak47:      { label: 'AK-47',          category: 'rifle',   steamName: 'weapon_ak47' },
  m4a1:      { label: 'M4A4',           category: 'rifle',   steamName: 'weapon_m4a4' },
  galilar:   { label: 'Galil AR',       category: 'rifle',   steamName: 'weapon_galilar' },
  famas:     { label: 'FAMAS',          category: 'rifle',   steamName: 'weapon_famas' },
  aug:       { label: 'AUG',            category: 'rifle',   steamName: 'weapon_aug' },
  sg556:     { label: 'SG 553',         category: 'rifle',   steamName: 'weapon_sg556' },
  awp:       { label: 'AWP',            category: 'sniper',  steamName: 'weapon_awp' },
  ssg08:     { label: 'SSG 08',         category: 'sniper',  steamName: 'weapon_ssg08' },
  g3sg1:     { label: 'G3SG1',          category: 'sniper',  steamName: 'weapon_g3sg1' },
  scar20:    { label: 'SCAR-20',        category: 'sniper',  steamName: 'weapon_scar20' },
  glock:     { label: 'Glock-18',       category: 'pistol',  steamName: 'weapon_glock' },
  deagle:    { label: 'Desert Eagle',   category: 'pistol',  steamName: 'weapon_deagle' },
  elite:     { label: 'Dual Berettas',  category: 'pistol',  steamName: 'weapon_elite' },
  fiveseven: { label: 'Five-SeveN',     category: 'pistol',  steamName: 'weapon_fiveseven' },
  hkp2000:   { label: 'P2000',          category: 'pistol',  steamName: 'weapon_hkp2000' },
  p250:      { label: 'P250',           category: 'pistol',  steamName: 'weapon_p250' },
  tec9:      { label: 'Tec-9',          category: 'pistol',  steamName: 'weapon_tec9' },
  mac10:     { label: 'MAC-10',         category: 'smg',     steamName: 'weapon_mac10' },
  ump45:     { label: 'UMP-45',         category: 'smg',     steamName: 'weapon_ump45' },
  p90:       { label: 'P90',            category: 'smg',     steamName: 'weapon_p90' },
  mp7:       { label: 'MP7',            category: 'smg',     steamName: 'weapon_mp7' },
  mp9:       { label: 'MP9',            category: 'smg',     steamName: 'weapon_mp9' },
  bizon:     { label: 'PP-Bizon',       category: 'smg',     steamName: 'weapon_bizon' },
  xm1014:    { label: 'XM1014',         category: 'shotgun', steamName: 'weapon_xm1014' },
  nova:      { label: 'Nova',           category: 'shotgun', steamName: 'weapon_nova' },
  sawedoff:  { label: 'Sawed-Off',      category: 'shotgun', steamName: 'weapon_sawedoff' },
  mag7:      { label: 'MAG-7',          category: 'shotgun', steamName: 'weapon_mag7' },
  m249:      { label: 'M249',           category: 'heavy',   steamName: 'weapon_m249' },
  negev:     { label: 'Negev',          category: 'heavy',   steamName: 'weapon_negev' },
  knife:     { label: 'Faca',           category: 'utility', steamName: 'weapon_knife_default_ct' },
  hegrenade: { label: 'Granada HE',     category: 'utility', steamName: 'weapon_hegrenade' },
  molotov:   { label: 'Molotov',        category: 'utility', steamName: 'weapon_molotov' },
  taser:     { label: 'Zeus x27',       category: 'utility', steamName: 'weapon_taser' },
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
  return `${STEAM_CDN}/${info.steamName}.png`
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
