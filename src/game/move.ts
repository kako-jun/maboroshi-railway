import type { GameState } from '../types/GameState'

/**
 * direction を踏まえて steps 分だけ進めるパスを返す。端で反射する。
 */
export function plannedPath(state: GameState, steps: number): number[] {
  const path: number[] = []
  let idx = state.player.tileIndex
  let dir = state.player.direction
  const last = state.tiles.length - 1
  for (let i = 0; i < steps; i++) {
    if (idx + dir < 0 || idx + dir > last) {
      dir = (-dir) as 1 | -1
    }
    idx += dir
    path.push(idx)
  }
  return path
}

export function applyMoveResult(state: GameState, path: number[]): void {
  if (path.length === 0) return
  const start = state.player.tileIndex
  const end = path[path.length - 1]
  const last = state.tiles.length - 1
  let dir: 1 | -1 = end >= start ? 1 : -1
  for (let i = 0; i + 1 < path.length; i++) {
    if (path[i + 1] < path[i]) {
      dir = -1
      break
    }
    if (path[i + 1] > path[i]) {
      dir = 1
      break
    }
  }
  if (path.includes(last) && end !== last) {
    state.player.lapsCompleted += 1
  }
  state.player.tileIndex = end
  state.player.direction = dir
}
