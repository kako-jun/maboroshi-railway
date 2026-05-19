import { Container, Graphics, Text, type Application } from 'pixi.js'
import type { Tile } from '../types/Tile'

const TILE_COLORS: Record<Tile['kind'], number> = {
  station: 0xb8362a,
  property: 0xc9a063,
  plus: 0x6aa66a,
  minus: 0x4a4a6a,
  card: 0x9a6ab0,
  destination: 0xe4b53a,
}

const STATION_RADIUS = 14
const TILE_RADIUS = 7

export class MapRenderer {
  readonly world: Container
  private rails: Graphics
  private tilesLayer: Container
  private labelLayer: Container
  private ownedMarkers = new Map<string, Graphics>()

  constructor(private app: Application) {
    this.world = new Container()
    this.world.label = 'world'
    this.rails = new Graphics()
    this.tilesLayer = new Container()
    this.labelLayer = new Container()
    this.world.addChild(this.rails)
    this.world.addChild(this.tilesLayer)
    this.world.addChild(this.labelLayer)
    this.recenter()
  }

  recenter(): void {
    this.world.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2)
  }

  draw(tiles: Tile[]): void {
    this.rails.clear()
    this.tilesLayer.removeChildren()
    this.labelLayer.removeChildren()
    this.ownedMarkers.clear()

    this.rails.moveTo(tiles[0].x, tiles[0].y)
    for (let i = 1; i < tiles.length; i++) {
      this.rails.lineTo(tiles[i].x, tiles[i].y)
    }
    this.rails.stroke({ width: 4, color: 0x3d2b1a, alpha: 0.9 })

    this.rails.moveTo(tiles[0].x, tiles[0].y)
    for (let i = 1; i < tiles.length; i++) {
      this.rails.lineTo(tiles[i].x, tiles[i].y)
    }
    this.rails.stroke({ width: 1, color: 0xf3ebd9, alpha: 0.55 })

    for (const tile of tiles) {
      const isStation = tile.kind === 'station' || tile.kind === 'property' || tile.kind === 'destination'
      const radius = isStation ? STATION_RADIUS : TILE_RADIUS
      const fill = TILE_COLORS[tile.kind]
      const g = new Graphics()
      g.circle(0, 0, radius)
      g.fill(fill)
      g.stroke({ width: 2, color: 0x2a1f17, alpha: 0.95 })
      g.position.set(tile.x, tile.y)
      this.tilesLayer.addChild(g)

      if (tile.propertyId) {
        const marker = new Graphics()
        marker.circle(0, 0, radius + 4)
        marker.stroke({ width: 2, color: 0xc9a063, alpha: 0 })
        marker.position.set(tile.x, tile.y)
        this.tilesLayer.addChild(marker)
        this.ownedMarkers.set(tile.propertyId, marker)
      }

      if (isStation) {
        const t = new Text({
          text: tile.name,
          style: {
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 12,
            fill: 0x2a1f17,
            stroke: { color: 0xf3ebd9, width: 3 },
          },
        })
        t.anchor.set(0.5, 1)
        t.position.set(tile.x, tile.y - radius - 4)
        this.labelLayer.addChild(t)
      }
    }
  }

  markOwned(propertyId: string): void {
    const marker = this.ownedMarkers.get(propertyId)
    if (marker) {
      marker.clear()
      marker.circle(0, 0, STATION_RADIUS + 4)
      marker.stroke({ width: 3, color: 0xc9a063, alpha: 1 })
    }
  }

  rotateBy(delta: number): void {
    this.world.rotation += delta
  }

  setRotation(angle: number): void {
    this.world.rotation = angle
  }
}
