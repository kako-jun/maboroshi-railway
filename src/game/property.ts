import type { GameState } from '../types/GameState'

export interface PurchaseResult {
  ok: boolean
  message: string
}

export function canPurchaseHere(state: GameState): boolean {
  const tile = state.tiles[state.player.tileIndex]
  if (!tile.propertyId) return false
  if (state.player.ownedPropertyIds.includes(tile.propertyId)) return false
  const prop = state.properties[tile.propertyId]
  return state.player.money >= prop.price
}

export function purchaseHere(state: GameState): PurchaseResult {
  const tile = state.tiles[state.player.tileIndex]
  if (!tile.propertyId) return { ok: false, message: 'ここでは物件を購入できない' }
  if (state.player.ownedPropertyIds.includes(tile.propertyId)) {
    return { ok: false, message: 'すでに所有している' }
  }
  const prop = state.properties[tile.propertyId]
  if (state.player.money < prop.price) {
    return { ok: false, message: `所持金不足: ¥${prop.price.toLocaleString()} 必要` }
  }
  state.player.money -= prop.price
  state.player.contribution += prop.price
  state.player.ownedPropertyIds.push(prop.id)
  state.totalDebt = Math.max(0, state.totalDebt - prop.price)
  return {
    ok: true,
    message: `${prop.name} を購入 (-¥${prop.price.toLocaleString()}) | 赤字残 ¥${state.totalDebt.toLocaleString()}`,
  }
}
