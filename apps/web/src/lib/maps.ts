// Imagens salvas em apps/web/public/maps/{map}.jpg
// Para adicionar um mapa: salve a imagem como public/maps/de_NOME.jpg
const MAP_IMAGES: Record<string, string> = {
  de_dust2:    '/maps/de_dust2.jpg',
  de_mirage:   '/maps/de_mirage.png',
  de_inferno:  '/maps/de_inferno.png',
  de_nuke:     '/maps/de_nuke.png',
  de_overpass: '/maps/de_overpass.png',
  de_vertigo:  '/maps/de_vertigo.png',
  de_ancient:  '/maps/de_ancient.png',
  de_anubis:   '/maps/de_anubis.png',
  de_train:    '/maps/de_train.png',
  de_cache:    '/maps/de_cache.png',
}

export function getMapImage(mapName: string): string | null {
  return MAP_IMAGES[mapName.toLowerCase()] ?? null
}

export function getMapLabel(mapName: string): string {
  return mapName.replace(/^de_/, '').replace(/^cs_/, '')
}
