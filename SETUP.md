# Node.js + MongoDB Atlas セットアップ手順

## 🚀 クイックスタート

### 1. 依存ライブラリをインストール
```bash
npm install
```

### 2. MongoDB Atlas 接続設定

#### 2.1 接続文字列を取得
1. MongoDB Atlas ダッシュボード にログイン
2. 左側メニュー → **「Clusters」**
3. **「Cluster0」** → **「Connect」** をクリック
4. **「Drivers」** タブ → **「Node.js」** を選択
5. 接続文字列をコピー（例：`mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`）

#### 2.2 .env ファイルを作成
1. `.env.example` をコピーして `.env` という新しいファイルを作成
2. 以下の内容を記入：
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
PORT=3000
```
3. `<username>` と `<password>` を MongoDB Atlasのデータベースユーザー認証情報に置き換え

### 3. サーバーを起動
```bash
npm start
```

出力例：
```
✓ MongoDB Atlasに接続しました
🚀 サーバーがhttp://localhost:3000で起動しました
📝 ブログURL: http://localhost:3000
```

### 4. ブラウザでアクセス
```
http://localhost:3000
```

---

## 📋 ファイル構成

```
notto_page/
├── index.html          ← ブログUI
├── style.css           ← スタイル
├── server.js           ← Node.js バックエンド
├── package.json        ← 依存ライブラリ
├── .env                ← 環境変数（作成が必要）
└── .env.example        ← テンプレート
```

---

## 🐛 トラブルシューティング

### ❌ `npm: command not found`
→ Node.js がインストールされていません
→ https://nodejs.org/ からインストール

### ❌ `✗ MongoDB接続エラー: authentication failed`
→ MONGODB_URI の username/password が間違っています
→ MongoDB Atlas ダッシュボードで確認

### ❌ `Port 3000 is already in use`
→ 別のプロセスがポート3000を使用しています
→ `.env` の `PORT=3000` を `PORT=3001` など別のポートに変更

### ❌ データが保存されない
→ コンソール（F12キー）でエラーを確認
→ MongoDB Atlas の「Database」> 「Collections」でデータを確認

---

## 🌐 複数デバイスでアクセス

ローカルネットワーク内の別のデバイスから接続する場合：

1. サーバー起動時のIPアドレスを確認（例：`192.168.1.100`）
2. 他のデバイスで以下にアクセス：
```
http://192.168.1.100:3000
```

---

## 📝 API エンドポイント

### 記事一覧取得
```
GET /api/posts
```

### 新規記事投稿
```
POST /api/posts
Body: { "title": "...", "content": "..." }
```

### 記事削除
```
DELETE /api/posts/{id}
```

---

## 💾 ローカルストレージ フォールバック

サーバーが起動していない場合は、自動的にブラウザのローカルストレージを使用します。

