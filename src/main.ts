import { Application } from 'pixi.js'
import './index.css'
import { buildMap } from './data/map'
import { createInitialState } from './types/GameState'
import type { GameState } from './types/GameState'
import type { CardId } from './types/Card'
import { CARD_DEFS } from './types/Card'
import { rollDice } from './game/dice'
import { applyMoveResult, plannedPath } from './game/move'
import { applyLapBonus, applyTileEffect } from './game/tileEffect'
import { canPurchaseHere, purchaseHere } from './game/property'
import { useCard } from './game/cards'
import { MapRenderer } from './render/MapRenderer'
import { PlayerRenderer } from './render/PlayerRenderer'
import { Hud } from './ui/Hud'

async function main() {
  const app = new Application()
  await app.init({
    background: '#1a1612',
    resizeTo: window,
    antialias: true,
  })
  const host = document.getElementById('app')!
  host.appendChild(app.canvas)

  const { tiles, properties, destinationTileIndex } = buildMap()
  const state: GameState = createInitialState(tiles, properties, destinationTileIndex)

  const mapRenderer = new MapRenderer(app)
  app.stage.addChild(mapRenderer.world)
  app.stage.addChild(mapRenderer.labelLayer)
  mapRenderer.draw(tiles)

  const playerRenderer = new PlayerRenderer(mapRenderer.world, tiles[0])

  const hud = new Hud(host, {
    onRoll: () => roll(),
    onBuy: () => buy(),
    onUseCard: (id) => activateCard(id),
    onRotate: (delta) => {
      mapRenderer.rotateBy(delta)
    },
  })

  window.addEventListener('resize', () => mapRenderer.recenter())

  app.ticker.add((ticker) => {
    playerRenderer.update(ticker)
    mapRenderer.updateLabels()
  })

  function pushLog(line: string) {
    state.log.push(line)
    if (state.log.length > 12) state.log.shift()
  }

  function rerender() {
    hud.render(state, state.phase === 'idle' && canPurchaseHere(state))
  }

  function resolveLanding(result: { message: string; reachedDestination: boolean }, lapped: boolean) {
    pushLog(result.message)
    if (lapped) {
      const lap = applyLapBonus(state)
      if (lap) pushLog(lap)
    }
    if (result.reachedDestination) {
      pushLog('🏯 次の目的地を抽選中... (プロトタイプではここで一旦終了)')
    }
  }

  function roll() {
    if (state.phase !== 'idle') return
    state.phase = 'rolling'
    state.turn += 1

    let steps = rollDice()
    const tags: string[] = []
    if (state.player.pendingExpress) {
      steps *= 2
      tags.push('急行×2')
      state.player.pendingExpress = false
    }
    if (state.player.pendingReverse) {
      state.player.direction = (-state.player.direction) as 1 | -1
      tags.push('逆走')
      state.player.pendingReverse = false
    }
    const tagStr = tags.length ? ` [${tags.join('/')}]` : ''
    pushLog(`🎲 サイコロ ${steps}${tagStr} → ${steps} マス進む`)
    rerender()

    const pathIdx = plannedPath(state, steps)
    const pathTiles = pathIdx.map((i) => tiles[i])
    state.phase = 'moving'

    playerRenderer.moveAlong(pathTiles, {
      onComplete: () => {
        const moveRes = applyMoveResult(state, pathIdx)
        state.phase = 'resolving'
        const result = applyTileEffect(state)
        resolveLanding(result, moveRes.lapped)
        state.phase = 'idle'
        rerender()
      },
    })
  }

  function buy() {
    if (state.phase !== 'idle') return
    if (!canPurchaseHere(state)) return
    const tile = tiles[state.player.tileIndex]
    const result = purchaseHere(state)
    pushLog(result.message)
    if (result.ok && tile.propertyId) {
      mapRenderer.markOwned(tile.propertyId)
    }
    rerender()
  }

  function activateCard(id: CardId) {
    if (state.phase !== 'idle') return
    const r = useCard(state, id)
    pushLog(`🎴 ${CARD_DEFS[id].name}: ${r.message}`)
    if (id === 'warp') {
      playerRenderer.jumpTo(tiles[state.player.tileIndex])
      const effect = applyTileEffect(state)
      resolveLanding(effect, false)
    }
    rerender()
  }

  rerender()
}

main().catch((err) => {
  console.error(err)
  document.body.innerHTML = `<pre style="color:#f3ebd9;padding:16px;">起動失敗: ${err}</pre>`
})
