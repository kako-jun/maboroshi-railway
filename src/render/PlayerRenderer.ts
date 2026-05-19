import { Container, Graphics, Ticker } from 'pixi.js'
import type { Tile } from '../types/Tile'

export class PlayerRenderer {
  readonly node: Container
  private body: Graphics
  private tween: { tiles: Tile[]; index: number; t: number; from: { x: number; y: number } } | null = null
  private onStep?: (tileIndex: number) => void
  private onComplete?: () => void

  constructor(world: Container, startTile: Tile) {
    this.node = new Container()
    this.node.label = 'player'
    this.body = new Graphics()
    this.drawTrain(this.body)
    this.node.addChild(this.body)
    this.node.position.set(startTile.x, startTile.y)
    world.addChild(this.node)
  }

  private drawTrain(g: Graphics): void {
    g.clear()
    g.roundRect(-10, -7, 20, 14, 3)
    g.fill(0xb8362a)
    g.stroke({ width: 1.5, color: 0x2a1f17 })
    g.circle(-5, 6, 2.4)
    g.circle(5, 6, 2.4)
    g.fill(0x2a1f17)
    g.rect(-9, -5, 18, 2)
    g.fill(0xf3ebd9)
  }

  jumpTo(tile: Tile): void {
    this.tween = null
    this.node.position.set(tile.x, tile.y)
  }

  /**
   * tile を順に踏みながら最終マスまで補間移動。各マス通過時に onStep が呼ばれる。
   */
  moveAlong(
    path: Tile[],
    opts: { onStep?: (tileIndex: number) => void; onComplete?: () => void } = {},
  ): void {
    if (path.length === 0) {
      opts.onComplete?.()
      return
    }
    this.onStep = opts.onStep
    this.onComplete = opts.onComplete
    this.tween = {
      tiles: path,
      index: 0,
      t: 0,
      from: { x: this.node.position.x, y: this.node.position.y },
    }
  }

  update(ticker: Ticker): void {
    if (!this.tween) return
    const speed = 0.12 * ticker.deltaTime
    this.tween.t += speed
    const target = this.tween.tiles[this.tween.index]
    const t = Math.min(1, this.tween.t)
    this.node.position.set(
      this.tween.from.x + (target.x - this.tween.from.x) * t,
      this.tween.from.y + (target.y - this.tween.from.y) * t,
    )
    if (t >= 1) {
      this.onStep?.(target.index)
      this.tween.index += 1
      if (this.tween.index >= this.tween.tiles.length) {
        this.tween = null
        const done = this.onComplete
        this.onStep = undefined
        this.onComplete = undefined
        done?.()
        return
      }
      this.tween.from = { x: target.x, y: target.y }
      this.tween.t = 0
    }
  }
}
