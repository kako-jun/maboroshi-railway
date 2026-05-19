import type { CardId } from './Card'
import type { Tile, Property } from './Tile'

export type Direction = 1 | -1

export interface Player {
  name: string
  money: number
  contribution: number
  tileIndex: number
  direction: Direction
  ownedPropertyIds: string[]
  hand: CardId[]
  lapsCompleted: number
  pendingExpress: boolean
  pendingReverse: boolean
}

export interface GameState {
  tiles: Tile[]
  properties: Record<string, Property>
  player: Player
  destinationTileIndex: number
  totalDebt: number
  turn: number
  phase: 'idle' | 'rolling' | 'moving' | 'resolving' | 'ended'
  log: string[]
}

export function createInitialState(
  tiles: Tile[],
  properties: Record<string, Property>,
  destinationTileIndex: number,
): GameState {
  return {
    tiles,
    properties,
    player: {
      name: 'kako-jun',
      money: 1000,
      contribution: 0,
      tileIndex: 0,
      direction: 1,
      ownedPropertyIds: [],
      hand: [],
      lapsCompleted: 0,
      pendingExpress: false,
      pendingReverse: false,
    },
    destinationTileIndex,
    totalDebt: 50000,
    turn: 0,
    phase: 'idle',
    log: [`「スーパーまぼろし鉄道サニールネッサンス線」 — 赤字 ¥${(50000).toLocaleString()} を返済せよ。`],
  }
}
