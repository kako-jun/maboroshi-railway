import type { GameState } from '../types/GameState'
import { CARD_DEFS, type CardId } from '../types/Card'

export interface HudCallbacks {
  onRoll: () => void
  onBuy: () => void
  onUseCard: (id: CardId) => void
  onRotate: (delta: number) => void
}

export class Hud {
  private root: HTMLDivElement
  private moneyEl: HTMLDivElement
  private contributionEl: HTMLDivElement
  private debtEl: HTMLDivElement
  private locationEl: HTMLDivElement
  private rollBtn: HTMLButtonElement
  private buyBtn: HTMLButtonElement
  private cardsEl: HTMLDivElement
  private logEl: HTMLDivElement

  constructor(parent: HTMLElement, private cb: HudCallbacks) {
    this.root = document.createElement('div')
    this.root.innerHTML = `
      <div class="hud top">
        <div class="panel">
          <div class="label">所持金</div>
          <div class="value" data-money>¥0</div>
        </div>
        <div class="panel">
          <div class="label">貢献度</div>
          <div class="value" data-contribution>¥0</div>
        </div>
        <div class="panel">
          <div class="label">赤字残</div>
          <div class="value" data-debt>¥0</div>
        </div>
        <div class="panel">
          <div class="label">現在地</div>
          <div class="value" data-location>—</div>
        </div>
      </div>
      <div class="log" data-log></div>
      <div class="hud bottom">
        <button class="btn" data-rotate-left>↺</button>
        <button class="btn primary" data-roll>サイコロを振る</button>
        <button class="btn gold" data-buy disabled>この物件を購入</button>
        <button class="btn" data-rotate-right>↻</button>
        <div class="cards" data-cards></div>
      </div>
    `
    parent.appendChild(this.root)

    this.moneyEl = this.root.querySelector('[data-money]') as HTMLDivElement
    this.contributionEl = this.root.querySelector('[data-contribution]') as HTMLDivElement
    this.debtEl = this.root.querySelector('[data-debt]') as HTMLDivElement
    this.locationEl = this.root.querySelector('[data-location]') as HTMLDivElement
    this.rollBtn = this.root.querySelector('[data-roll]') as HTMLButtonElement
    this.buyBtn = this.root.querySelector('[data-buy]') as HTMLButtonElement
    this.cardsEl = this.root.querySelector('[data-cards]') as HTMLDivElement
    this.logEl = this.root.querySelector('[data-log]') as HTMLDivElement

    this.rollBtn.addEventListener('click', () => cb.onRoll())
    this.buyBtn.addEventListener('click', () => cb.onBuy())
    ;(this.root.querySelector('[data-rotate-left]') as HTMLButtonElement).addEventListener('click', () =>
      cb.onRotate(-Math.PI / 12),
    )
    ;(this.root.querySelector('[data-rotate-right]') as HTMLButtonElement).addEventListener('click', () =>
      cb.onRotate(Math.PI / 12),
    )
  }

  render(state: GameState, canBuy: boolean): void {
    const fmt = (n: number) => `¥${n.toLocaleString()}`
    this.moneyEl.textContent = fmt(state.player.money)
    this.contributionEl.textContent = fmt(state.player.contribution)
    this.debtEl.textContent = fmt(state.totalDebt)
    const tile = state.tiles[state.player.tileIndex]
    const flags: string[] = []
    if (state.player.pendingExpress) flags.push('急行予約')
    if (state.player.pendingReverse) flags.push('逆走予約')
    this.locationEl.textContent = `${tile.name}${flags.length ? ` [${flags.join('/')}]` : ''}`

    this.rollBtn.disabled = state.phase !== 'idle'
    this.buyBtn.disabled = !canBuy

    this.cardsEl.innerHTML = ''
    for (const id of state.player.hand) {
      const def = CARD_DEFS[id]
      const chip = document.createElement('button')
      chip.className = 'card-chip'
      chip.textContent = def.name
      chip.title = def.description
      chip.addEventListener('click', () => this.cb.onUseCard(id))
      this.cardsEl.appendChild(chip)
    }

    this.logEl.innerHTML = ''
    for (const line of state.log.slice(-8)) {
      const d = document.createElement('div')
      d.className = 'entry'
      d.textContent = line
      this.logEl.appendChild(d)
    }
  }
}
