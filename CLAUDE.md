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
- `src/render/` — `MapRenderer`（路線・マス・駅）と `PlayerRenderer`（電車 + tween 移動）
- `src/ui/Hud.ts` — 所持金・貢献度・赤字残・サイコロ・購入・カード使用ボタン（HTML overlay）
- `src/main.ts` — PixiJS Application 起動 + 1 ターンの dispatch

## ビルド

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # tsc + vite build → dist/
npm run lint
```

## CI/CD

未整備（Issue #14: GitHub Actions + Cloudflare Pages デプロイ）。
