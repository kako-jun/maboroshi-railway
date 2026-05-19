# maboroshi-railway（スーパーまぼろし鉄道サニールネッサンス線）

北陸鉄道・のと鉄道×桃鉄風協力型MMOすごろく。ブラウザで遊べる。

## ドキュメント

- [docs/DESIGN.md](docs/DESIGN.md) — ゲームデザイン（ルール・マップ・NPC・カード）
- [docs/architecture.md](docs/architecture.md) — 技術設計（CF Workers・Durable Objects・WebSocket）
- [docs/mypace-integration.md](docs/mypace-integration.md) — mypace連携仕様（投稿=サイコロ）

## 技術スタック

- フロントエンド: Vite + TypeScript + PixiJS (v8) + HTML/CSS（UI）
- バックエンド: Hono + Cloudflare Workers（未実装）
- リアルタイム同期: WebSocket + Durable Objects（未実装）
- データ永続化: Cloudflare D1（未実装）
- プレイヤー認証: Nostr 公開鍵（未実装）

## プロトタイプの範囲（現状）

オフライン 1 人プレイで以下を実装済み:

- 一直線路線（北陸鉄道石川線 15 駅 + 廃線区間 加賀一の宮・白山下）の PixiJS 描画
- 駅マス／プラス／マイナス／カード／目的地 のマス効果
- サイコロ（1〜6）→ 補間移動アニメ → マス効果 のターンループ
- 物件購入（1 回購入・端駅で反射した瞬間に収益分配）と「赤字残」「貢献度」の管理
- カード 4 種（急行 / 逆走 / ワープ / 徳政令）の入手・使用
- 端での反射、目的地到達ボーナス
- マップ回転ボタン（モバイル想定のジェスチャは未実装）

未実装（別 Issue で順次）:

- MMO・WebSocket・Durable Objects・Nostr 連携
- 貧乏神／福の神／幻想モード／七夕イベント
- 和風 UI 意匠の本格的な作り込み
- マップのピンチ・ドラッグ・自由回転ジェスチャ
- 路線エディット・複数路線
- 目的地のローテーション（プロトタイプは最初の到達で打ち止め）

## ビルド・開発

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # tsc + vite build → dist/
npm run preview  # ビルド済みアセットをローカル配信
npm run lint
```

## CI/CD

GitHub Actions + Cloudflare Pages デプロイは Issue #14 で整備予定。
