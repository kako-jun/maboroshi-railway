import type { GameState } from '../types/GameState'
import type { CardId } from '../types/Card'
import { CARD_DEFS } from '../types/Card'

const CARD_POOL: CardId[] = ['express', 'reverse', 'warp', 'tokuseirei']

function pickCard(): CardId {
  const weights = CARD_POOL.map((id) => 6 - CARD_DEFS[id].rarity)
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < CARD_POOL.length; i++) {
    r -= weights[i]
    if (r <= 0) return CARD_POOL[i]
  }
  return CARD_POOL[0]
}

export interface TileEffectResult {
  message: string
  reachedDestination: boolean
}

export function applyTileEffect(state: GameState): TileEffectResult {
  const tile = state.tiles[state.player.tileIndex]
  switch (tile.kind) {
    case 'plus': {
      const v = tile.value ?? 100
      state.player.money += v
      return { message: `${tile.name}: +¥${v.toLocaleString()}`, reachedDestination: false }
    }
    case 'minus': {
      const v = tile.value ?? -100
      state.player.money += v
      return { message: `${tile.name}: ¥${v.toLocaleString()}`, reachedDestination: false }
    }
    case 'card': {
      const id = pickCard()
      state.player.hand.push(id)
      return { message: `${tile.name}: 「${CARD_DEFS[id].name}」カードを入手`, reachedDestination: false }
    }
    case 'station': {
      return { message: `${tile.name}駅に到着`, reachedDestination: false }
    }
    case 'destination': {
      const reward = 3000
      state.player.money += reward
      return {
        message: `目的地「${tile.name}」到着! +¥${reward.toLocaleString()}`,
        reachedDestination: true,
      }
    }
  }
}

/**
 * 周回ボーナス。所有物件 1 個ごとに yieldPerLap を加算する。
 */
export function applyLapBonus(state: GameState): string | null {
  if (state.player.ownedPropertyIds.length === 0) return null
  let total = 0
  for (const pid of state.player.ownedPropertyIds) {
    const p = state.properties[pid]
    if (p) total += p.yieldPerLap
  }
  if (total === 0) return null
  state.player.money += total
  return `周回ボーナス: +¥${total.toLocaleString()} (所有 ${state.player.ownedPropertyIds.length} 物件)`
}
