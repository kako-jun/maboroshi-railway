# maboroshi-railway（スーパーまぼろし鉄道サニールネッサンス線）

北陸鉄道・のと鉄道×桃鉄風協力型MMOすごろく。ブラウザで遊べる。

## ドキュメント

- [docs/DESIGN.md](docs/DESIGN.md) — ゲームデザイン（ルール・マップ・NPC・カード）
- [docs/architecture.md](docs/architecture.md) — 技術設計（CF Workers・Durable Objects・WebSocket）
- [docs/mypace-integration.md](docs/mypace-integration.md) — mypace連携仕様（投稿=サイコロ）

## 技術スタック

- フロントエンド: Vite + TypeScript + Canvas
- バックエンド: Hono + Cloudflare Workers
- リアルタイム同期: WebSocket + Durable Objects
- データ永続化: Cloudflare D1
- プレイヤー認証: Nostr 公開鍵

## ビルド

（未整備）

## CI/CD

（未整備）
