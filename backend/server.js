import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(cors());

const {
  MONGODB_URI,
  MONGODB_DB = 'hpcl',
  LEADS_COLLECTION = 'leads',
  COMPANIES_COLLECTION = 'companies',
  PORT = '4000',
} = process.env;

if (!MONGODB_URI) {
  // Fail fast (no secrets in code)
  throw new Error('Missing MONGODB_URI in backend/.env');
}

const client = new MongoClient(MONGODB_URI);

let db;

async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db(MONGODB_DB);
  }
  return db;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/leads', async (_req, res) => {
  try {
    const db = await getDb();
    const items = await db
      .collection(LEADS_COLLECTION)
      .find({})
      .sort({ Captured_At: -1 })
      .limit(500)
      .toArray();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Failed' });
  }
});

app.get('/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    // Try ObjectId first, then fallback to lead_id match
    let item = null;
    if (ObjectId.isValid(id)) {
      item = await db.collection(LEADS_COLLECTION).findOne({ _id: new ObjectId(id) });
    }
    if (!item) {
      item = await db.collection(LEADS_COLLECTION).findOne({ lead_id: id });
    }

    if (!item) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Failed' });
  }
});

app.get('/companies', async (_req, res) => {
  try {
    const db = await getDb();
    const items = await db
      .collection(COMPANIES_COLLECTION)
      .find({})
      .sort({ total_signals: -1 })
      .limit(500)
      .toArray();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Failed' });
  }
});

getDb()
  .then(() => {
    app.listen(Number(PORT), () => {
      // eslint-disable-next-line no-console
      console.log(`HPCL backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB:', e);
    process.exit(1);
  });
