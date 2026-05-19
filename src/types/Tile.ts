export type TileKind =
  | 'station'
  | 'plus'
  | 'minus'
  | 'card'
  | 'property'
  | 'destination'

export interface Tile {
  index: number
  kind: TileKind
  name: string
  x: number
  y: number
  value?: number
  propertyId?: string
}

export interface Property {
  id: string
  name: string
  stationName: string
  tileIndex: number
  price: number
  yieldPerLap: number
}
