import type { Property, Tile, TileKind } from '../types/Tile'

interface StationDef {
  name: string
  property?: { id: string; name: string; price: number; yieldPerLap: number }
  abandoned?: boolean
}

const STATIONS: StationDef[] = [
  { name: '野町', property: { id: 'nomachi-yakiniku', name: '野町焼肉店', price: 800, yieldPerLap: 80 } },
  { name: '西泉', property: { id: 'nishiizumi-arare', name: '西泉あられ本舗', price: 600, yieldPerLap: 60 } },
  { name: '新西金沢' },
  { name: '押野', property: { id: 'oshino-yokocho', name: '押野横丁', price: 900, yieldPerLap: 90 } },
  { name: '野々市', property: { id: 'nonoichi-kohi', name: '野々市珈琲', price: 1200, yieldPerLap: 120 } },
  { name: '額住宅前' },
  { name: '乙丸', property: { id: 'otomaru-yakitori', name: '乙丸焼き鳥', price: 700, yieldPerLap: 70 } },
  { name: '四十万' },
  { name: '陽羽里', property: { id: 'hibari-mochi', name: '陽羽里もち屋', price: 1100, yieldPerLap: 110 } },
  { name: '道法寺' },
  { name: '小柳' },
  { name: '日御子' },
  { name: '鶴来', property: { id: 'tsurugi-konbu', name: '鶴来昆布店', price: 1500, yieldPerLap: 150 } },
  { name: '加賀一の宮', abandoned: true, property: { id: 'kaga-ichinomiya', name: '加賀一の宮商店街', price: 2000, yieldPerLap: 220 } },
  { name: '白山下', abandoned: true, property: { id: 'hakusanshita', name: '白山下温泉宿', price: 2500, yieldPerLap: 280 } },
]

const MID_TILE_PATTERNS: TileKind[][] = [
  ['plus', 'plus', 'minus'],
  ['plus', 'card', 'plus'],
  ['plus', 'minus', 'card'],
  ['card', 'plus', 'plus'],
  ['plus', 'plus', 'plus', 'card'],
]

const MID_NAMES = [
  '町道',
  '踏切',
  '商店街',
  '橋',
  '河原',
  '田圃',
  '住宅地',
  '杉並木',
  '農協前',
  '神社下',
  '小路',
  '丘の上',
  '川岸',
]

/**
 * パスの座標は viewport 中央 (0,0) を基準に、左から右へ流れるゆるい正弦カーブで配置する。
 * world (PixiJS Container) を回転させるとマップ全体が回るので、世界座標は固定で良い。
 */
function curvePoint(t: number, totalTiles: number): { x: number; y: number } {
  const SPAN_X = Math.max(900, totalTiles * 60)
  const x = -SPAN_X / 2 + (SPAN_X * t) / Math.max(1, totalTiles - 1)
  const y = Math.sin(t * 0.18) * 90 + Math.cos(t * 0.07) * 40
  return { x, y }
}

export interface BuiltMap {
  tiles: Tile[]
  properties: Record<string, Property>
  destinationTileIndex: number
}

export function buildMap(): BuiltMap {
  const tiles: Tile[] = []
  const properties: Record<string, Property> = {}

  for (let i = 0; i < STATIONS.length; i++) {
    const station = STATIONS[i]
    const tileIndex = tiles.length
    const tile: Tile = {
      index: tileIndex,
      kind: 'station',
      name: station.name,
      x: 0,
      y: 0,
    }
    if (station.property) {
      tile.propertyId = station.property.id
      properties[station.property.id] = {
        id: station.property.id,
        name: station.property.name,
        stationName: station.name,
        tileIndex,
        price: station.property.price,
        yieldPerLap: station.property.yieldPerLap,
      }
    }
    if (station.abandoned) {
      tile.name = `${station.name}(廃)`
    }
    tiles.push(tile)

    if (i < STATIONS.length - 1) {
      const pattern = MID_TILE_PATTERNS[i % MID_TILE_PATTERNS.length]
      pattern.forEach((kind) => {
        const midIndex = tiles.length
        const midName = MID_NAMES[midIndex % MID_NAMES.length]
        const value = kind === 'plus' ? 80 + (midIndex % 4) * 40 : kind === 'minus' ? -(60 + (midIndex % 3) * 30) : undefined
        tiles.push({
          index: midIndex,
          kind,
          name: midName,
          x: 0,
          y: 0,
          value,
        })
      })
    }
  }

  const destinationTileIndex = tiles.length - 1
  tiles[destinationTileIndex].kind = 'destination'
  tiles[destinationTileIndex].name = `${STATIONS[STATIONS.length - 1].name}(目的地)`

  for (let i = 0; i < tiles.length; i++) {
    const { x, y } = curvePoint(i, tiles.length)
    tiles[i].x = x
    tiles[i].y = y
  }

  return { tiles, properties, destinationTileIndex }
}
