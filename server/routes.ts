import { Router } from 'express';
import { getDb } from './db';

export const apiRouter = Router();

apiRouter.get('/status', async (_req, res) => {
  const { db, isConnected } = getDb();
  if (!isConnected || !db) {
    return res.json({ connected: false, mode: 'fallback' });
  }
  const start = Date.now();
  await db.command({ ping: 1 });
  const latency = Date.now() - start;

  const counts = {
    profile: await db.collection('portfolio_profile').countDocuments(),
    projects: await db.collection('portfolio_projects').countDocuments(),
    selectwork: await db.collection('portfolio_selectwork').countDocuments(),
    skills: await db.collection('portfolio_skills').countDocuments(),
    timeline: await db.collection('portfolio_timeline').countDocuments(),
  };

  res.json({ connected: true, latency, counts, mode: 'mongodb' });
});

apiRouter.get('/portfolio', async (_req, res) => {
  const { db, isConnected } = getDb();
  if (!isConnected || !db) return res.status(503).json({ error: 'DB_UNAVAILABLE' });

  const profile = await db.collection('portfolio_profile').findOne({ _id: 'main_profile' as any });
  const projects = await db.collection('portfolio_projects').find().toArray();
  const selectwork = await db.collection('portfolio_selectwork').find().toArray();
  const skills = await db.collection('portfolio_skills').find().toArray();
  const timeline = await db.collection('portfolio_timeline').find().toArray();

  res.json({ profile, projects, selectwork, skills, timeline });
});

apiRouter.put('/portfolio/profile', async (req, res) => {
  const { db } = getDb();
  if (!db) return res.status(503).json({ error: 'DB_UNAVAILABLE' });
  await db.collection('portfolio_profile').updateOne(
    { _id: 'main_profile' as any },
    { $set: req.body },
    { upsert: true }
  );
  res.json({ success: true, data: req.body });
});

// Endpoint GET & POST khusus Selected Works
apiRouter.get('/portfolio/selectwork', async (_req, res) => {
  const { db, isConnected } = getDb();
  if (!isConnected || !db) return res.status(503).json({ error: 'DB_UNAVAILABLE' });

  const selectwork = await db.collection('portfolio_selectwork').find().toArray();
  res.json(selectwork);
});

apiRouter.post('/portfolio/selectwork', async (req, res) => {
  const { db } = getDb();
  if (!db) return res.status(503).json({ error: 'DB_UNAVAILABLE' });

  const newWork = req.body;
  const docToInsert = {
    ...newWork,
    _id: newWork.id || `work-${Date.now()}`
  };

  await db.collection('portfolio_selectwork').replaceOne(
    { _id: docToInsert._id },
    docToInsert,
    { upsert: true }
  );

  res.status(201).json({ success: true, data: docToInsert });
});

// Endpoint sinkronisasi data dari fallback cloud ke MongoDB
apiRouter.post('/database/sync', async (req, res) => {
  const { db } = getDb();
  if (!db) return res.status(503).json({ error: 'DB_UNAVAILABLE' });
  const { profile, projects, selectwork, skills, timeline } = req.body;

  if (profile) await db.collection('portfolio_profile').replaceOne({ _id: 'main_profile' as any }, { ...profile, _id: 'main_profile' }, { upsert: true });
  if (projects?.length) {
    await db.collection('portfolio_projects').deleteMany({});
    await db.collection('portfolio_projects').insertMany(projects);
  }
  if (selectwork?.length) {
    await db.collection('portfolio_selectwork').deleteMany({});
    await db.collection('portfolio_selectwork').insertMany(
      selectwork.map((item: any) => ({ ...item, _id: item.id || item._id }))
    );
  }
  if (skills?.length) {
    await db.collection('portfolio_skills').deleteMany({});
    await db.collection('portfolio_skills').insertMany(skills);
  }
  if (timeline?.length) {
    await db.collection('portfolio_timeline').deleteMany({});
    await db.collection('portfolio_timeline').insertMany(timeline);
  }

  res.json({ success: true, message: 'Sinkronisasi berhasil!' });
});