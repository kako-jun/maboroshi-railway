import type { GameState } from '../types/GameState'
import type { CardId } from '../types/Card'
import { CARD_DEFS } from '../types/Card'

export interface CardUseResult {
  message: string
}

export function useCard(state: GameState, cardId: CardId): CardUseResult {
  const idx = state.player.hand.indexOf(cardId)
  if (idx < 0) return { message: `「${CARD_DEFS[cardId].name}」を持っていない` }
  state.player.hand.splice(idx, 1)
  switch (cardId) {
    case 'express':
      state.player.pendingExpress = true
      return { message: '急行カード発動: 次のサイコロが 2 倍' }
    case 'reverse':
      state.player.pendingReverse = true
      return { message: '逆走カード発動: 次の移動で進行方向反転' }
    case 'warp': {
      const stations = state.tiles.filter((t) => t.kind === 'station' || t.kind === 'destination')
      const dest = stations[Math.floor(Math.random() * stations.length)]
      state.player.tileIndex = dest.index
      const last = state.tiles.length - 1
      if (dest.index === 0) state.player.direction = 1
      else if (dest.index === last) state.player.direction = -1
      return { message: `ワープカード発動: 「${dest.name}」まで飛んだ` }
    }
    case 'tokuseirei':
      if (state.player.money < 0) {
        const debt = -state.player.money
        state.player.money = 0
        return { message: `徳政令カード発動: 借金 ¥${debt.toLocaleString()} を帳消し` }
      }
      return { message: '徳政令カード発動: 借金がないため効果なし' }
  }
}
