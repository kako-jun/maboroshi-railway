# mypace連携仕様

## 概要

mypace（kako-jun製Nostrクライアント）での投稿がスチャラカトレインのサイコロに直結する。

## フロー

```
1. ユーザーがmypaceで投稿（Nostrイベント発行）
2. 投稿成功後、mypaceがスチャトレAPIを呼ぶ
   POST /api/roll
   Body: { pubkey: "npub...", event_id: "note1..." }
3. スチャトレサーバーがサイコロを振る
4. 結果をWebSocketで全接続クライアントに配信
5. マップ上で電車が動く
```

## mypace側の変更

投稿成功コールバックにAPI呼び出しを1箇所追加するだけ。

```typescript
// 投稿成功後
await fetch("https://sucharaka-train.llll-ll.com/api/roll", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pubkey: currentUser.pubkey,
    event_id: publishedEvent.id,
  }),
});
```

## 認証

- Nostr公開鍵がプレイヤーIDを兼ねる
- 初回アクセス時にスチャトレ側で自動登録（公開鍵が未登録なら新規プレイヤー作成）
- NIP-07（Nostr署名拡張）による署名検証で本人確認（なりすまし防止）

## カード連携（将来案）

- 画像付き投稿 → カード1枚追加
- リアクション(いいね)をもらう → ボーナス
- 長文投稿 → サイコロの出目にバフ

## NPC連携

- mypace以外のNostrクライアントからの投稿もリレー経由で取得
- これらはNPCの行動トリガーとして使用
- 登録プレイヤーの投稿はNPCトリガーにはならない（二重カウント防止）
