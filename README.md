# habit-grid

GitHub のコントリビューションカレンダーが好きなので、同じ見た目で任意の習慣(英語学習に
限らず何でも)を記録できるツールを作りました。

## 機能

- 習慣を追加し、「今日を記録」ボタンでワンクリックで記録
- GitHub 風のコントリビューションカレンダー(過去53週間)で達成状況を可視化
- 習慣ごとに独立したカレンダーを持てる(複数の目標を同時に追跡可能)

## 技術構成

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack) / React 19 / TypeScript
- PostgreSQL + [Prisma](https://www.prisma.io/) 7 (`@prisma/adapter-pg` 経由)
- 認証: 単一ユーザー向けの共有パスワード + 署名付きセッションCookie
  (このアプリはユーザーが自分一人しかいないため、フル機能の認証システムは
  過剰と判断し、`proxy.ts` でシンプルに保護しています)

## ローカルで動かす

```bash
docker compose up -d          # Postgres を起動
cp .env.example .env.local    # DATABASE_URL, APP_PASSWORD, SESSION_SECRET を設定
npx prisma migrate dev
npm install
npm run dev
```

http://localhost:3001 で確認できます。

`SESSION_SECRET` は以下で生成できます:

```bash
openssl rand -hex 32
```

## デプロイ

Vercel + 本番用 Postgres(Vercel Storage の Neon 連携など)を想定しています。
デプロイ先で以下の環境変数を設定してください。

- `DATABASE_URL`
- `APP_PASSWORD`
- `SESSION_SECRET`
