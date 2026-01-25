
## 主要なツール

- パッケージマネージャー: npm
- ビルドツール/バンドラー: Vite
- 言語/フレームワーク: TypeScript, React
- スタイリング: Tailwind CSS (PostCSS)

npm run dev
npm run build
http://localhost:5173/?auth_debug




## デプロイ先

- Netlify
- quickchart.dataviz.jp


## 認証システム (dataviz-auth-client.js)

### リファクタリング対応 (2025-12-30)

`dataviz-auth-client.js` がリファクタリングされました。主な変更点:

#### 1. Web Component標準への移行
- `DatavizGlobalHeader` が標準のカスタムHTMLElementに変更
- `<dataviz-header>` タグとして使用可能

#### 2. Supabaseクライアントの公開名変更
- **旧**: `window.supabase`
- **新**: `window.datavizSupabase`
- 型定義: `src/types/dataviz.ts` に追加

#### 3. ヘッダーの固定位置化
- `position: fixed` に変更
- `src/index.css` で `body { padding-top: 48px; }` を追加して対応

#### 4. その他の変更
- Cookie処理の簡素化（チャンク処理削除）
- SameSite属性: `Lax` → `None`
- ログインURL: `/auth/login` → `/auth/sign-up`
- 初期化ロジックの簡素化

### 使用方法

```html
<!-- index.html -->
<script src="/supabase.js"></script>
<script src="/dataviz-auth-client.js"></script>
```

```typescript
// TypeScript での使用例
const supabase = window.datavizSupabase;
if (supabase) {
  const { data: session } = await supabase.auth.getSession();
  console.log(session);
}
```