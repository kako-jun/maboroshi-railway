export type CardId = 'express' | 'reverse' | 'warp' | 'tokuseirei'

export interface CardDef {
  id: CardId
  name: string
  description: string
  rarity: number
}

export const CARD_DEFS: Record<CardId, CardDef> = {
  express: {
    id: 'express',
    name: '急行',
    description: '次のサイコロが 2 倍で進む',
    rarity: 3,
  },
  reverse: {
    id: 'reverse',
    name: '逆走',
    description: '次の移動で進行方向が反転する',
    rarity: 2,
  },
  warp: {
    id: 'warp',
    name: 'ワープ',
    description: 'ランダムな駅まで飛ぶ',
    rarity: 2,
  },
  tokuseirei: {
    id: 'tokuseirei',
    name: '徳政令',
    description: '所持金がマイナスでも 0 まで戻す',
    rarity: 1,
  },
}
