const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI);

let db;
let postsCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('blog');
    postsCollection = db.collection('posts');
    console.log('✓ MongoDB Atlasに接続しました');
  } catch (error) {
    console.error('✗ MongoDB接続エラー:', error);
    process.exit(1);
  }
}

// 記事一覧取得
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await postsCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(posts);
  } catch (error) {
    console.error('記事取得エラー:', error);
    res.status(500).json({ error: '記事の取得に失敗しました' });
  }
});

// 新規記事投稿
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'タイトルと本文は必須です' });
    }

    const newPost = {
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await postsCollection.insertOne(newPost);
    res.status(201).json({ ...newPost, _id: result.insertedId });
  } catch (error) {
    console.error('記事追加エラー:', error);
    res.status(500).json({ error: '記事の追加に失敗しました' });
  }
});

// 記事削除
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: '無効なIDです' });
    }

    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: '記事が見つかりません' });
    }

    res.json({ message: '記事を削除しました' });
  } catch (error) {
    console.error('記事削除エラー:', error);
    res.status(500).json({ error: '記事の削除に失敗しました' });
  }
});

const PORT = process.env.PORT || 3000;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 サーバーがhttp://localhost:${PORT}で起動しました`);
    console.log(`📝 ブログURL: http://localhost:${PORT}`);
  });
});

// 終了処理
process.on('SIGINT', async () => {
  console.log('\nサーバーを停止しています...');
  await client.close();
  process.exit(0);
});
