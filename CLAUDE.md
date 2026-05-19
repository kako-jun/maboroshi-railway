# maboroshi-railway（スーパーまぼろし鉄道サニールネッサンス線）

北陸鉄道・のと鉄道×桃鉄風協力型MMOすごろく。ブラウザで遊べる。

## ドキュメント

- [docs/DESIGN.md](docs/DESIGN.md) — ゲームデザイン（ルール・マップ・NPC・カード）
- [docs/architecture.md](docs/architecture.md) — 技術設計（CF Workers・Durable Objects・WebSocket）
- [docs/mypace-integration.md](docs/mypace-integration.md) — mypace連携仕様（投稿=サイコロ）

## 技術スタック

- フロントエンド: Vite + TypeScript + PixiJS (v8) + HTML/CSS（UI）
- バックエンド: Hono + Cloudflare Workers
- リアルタイム同期: WebSocket + Durable Objects
- データ永続化: Cloudflare D1
- プレイヤー認証: Nostr 公開鍵

## プロトタイプ実装状況

オフライン 1 人プレイのプロトタイプを `src/` に実装済み（Issue #1〜#4 / #6 / #7 一部）。

- `src/types/` — `GameState` / `Tile` / `Property` / `Card` 型定義
- `src/data/map.ts` — 一直線マップ（北陸鉄道石川線 + 廃線区間）の生成
- `src/game/` — `dice` / `move` / `tileEffect` / `property` / `cards`
- `src/render/` — `MapRenderer`（路線・マス・駅、ラベルは world 外で水平固定）と `PlayerRenderer`（電車 + tween 移動）
- `src/ui/Hud.ts` — 所持金・貢献度・赤字残・サイコロ・購入・カード使用ボタン（HTML overlay）
- `src/main.ts` — PixiJS Application 起動 + 1 ターンの dispatch

### 仕様メモ（実装上の判断）

- **周回ボーナス** は端駅 (0 / 末尾) を踏んで反射した瞬間にのみ 1 回加算する。毎ターン加算ではない。
- **目的地到達** は所持金 +3000 のみ。赤字返済への寄与は「物件購入」のみ（DESIGN.md 247 行の方針に準拠）。
- **ワープカード** は着地マスのマス効果も発動する（通常移動と同じ後処理パスを通る）。端駅に着地した場合は direction を内側向きに自動矯正する。

### 未実装（別 Issue で順次）

- MMO・WebSocket・Durable Objects・Nostr 連携（#5 #10 #11）
- 貧乏神／福の神／幻想モード／七夕イベント（#9 #13）
- 和風 UI 意匠の本格的な作り込み（#8）
- マップのピンチ・ドラッグ・自由回転ジェスチャ（#3 残）
- 路線エディット・複数路線
- 目的地のローテーション（プロトタイプは最初の到達で打ち止め）

## ビルド

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # tsc + vite build → dist/
npm run lint
```

## CI/CD

未整備（Issue #14: GitHub Actions + Cloudflare Pages デプロイ）。
