import type { GameState } from '../types/GameState'

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

export interface MoveResult {
  lapped: boolean
}

/**
 * lap = 「端駅 (0 か last) を踏んで反射した」回数。
 * 周回ボーナスはこの瞬間にのみ加算する (毎ターン加算ではない)。
 * 端駅スタートで即反射した場合も lap として数える。
 */
export function applyMoveResult(state: GameState, path: number[]): MoveResult {
  if (path.length === 0) return { lapped: false }
  const last = state.tiles.length - 1
  const startIdx = state.player.tileIndex
  let dir: 1 | -1 = state.player.direction
  let lapped = false

  if (startIdx === last && path[0] < startIdx) lapped = true
  if (startIdx === 0 && path[0] > startIdx) lapped = true

  for (let i = 0; i + 1 < path.length; i++) {
    if (path[i + 1] < path[i]) {
      if (path[i] === last) lapped = true
      dir = -1
    } else if (path[i + 1] > path[i]) {
      if (path[i] === 0) lapped = true
      dir = 1
    }
  }
  const end = path[path.length - 1]
  if (lapped) state.player.lapsCompleted += 1
  state.player.tileIndex = end
  state.player.direction = dir
  return { lapped }
}
