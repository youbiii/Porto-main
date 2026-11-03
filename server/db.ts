import { MongoClient, Db } from 'mongodb';
import * as Data from '../src/data';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
let client: MongoClient | null = null;
let db: Db | null = null;
let isConnected = false;

// Ambil data dengan fallback otomatis ke nama variabel yang cocok
const rawData = Data as Record<string, any>;
const profileData = rawData.PERSONAL_INFO || rawData.initialProfile || rawData.profile || {};
const projectsData = rawData.PROJECTS || rawData.initialProjects || rawData.projects || [];
const selectworkData = rawData.SELECTED_WORKS || rawData.initialSelectwork || rawData.selectwork || [];
const skillsData = rawData.SKILLS || rawData.SKILL_CATEGORIES || rawData.skills || [];
const timelineData = rawData.TIMELINE || rawData.initialTimeline || rawData.timeline || rawData.EXPERIENCES || [];

export async function connectToDatabase() {
  try {
    if (!client) {
      client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
      await client.connect();
      db = client.db();
      isConnected = true;
      console.log('✅ Terhubung ke MongoDB lokal');
      await seedInitialData();
    }
    return { client, db, isConnected: true };
  } catch (error) {
    console.warn('⚠️ Gagal terhubung ke MongoDB. Mengaktifkan mode fallback.');
    isConnected = false;
    return { client: null, db: null, isConnected: false };
  }
}

async function seedInitialData() {
  if (!db) return;
  const profileCount = await db.collection('portfolio_profile').countDocuments();
  if (profileCount === 0) {
    if (Object.keys(profileData).length > 0) {
      await db.collection('portfolio_profile').insertOne({ ...profileData, _id: 'main_profile' as any });
    }
    if (Array.isArray(projectsData) && projectsData.length > 0) {
      await db.collection('portfolio_projects').insertMany(projectsData.map((p: any, i: number) => ({ ...p, _id: `proj_${i + 1}` as any })));
    }
    if (Array.isArray(skillsData) && skillsData.length > 0) {
      await db.collection('portfolio_skills').insertMany(skillsData.map((s: any, i: number) => ({ ...s, _id: `skill_${i + 1}` as any })));
    }
    if (Array.isArray(timelineData) && timelineData.length > 0) {
      await db.collection('portfolio_timeline').insertMany(timelineData.map((t: any, i: number) => ({ ...t, _id: `time_${i + 1}` as any })));
    }
    console.log('🌱 Seed data portfolio awal berhasil dimasukkan.');
  }

  // Seed otomatis untuk collection baru portfolio_selectwork jika belum ada isinya
  const selectworkCount = await db.collection('portfolio_selectwork').countDocuments();
  if (selectworkCount === 0 && Array.isArray(selectworkData) && selectworkData.length > 0) {
    await db.collection('portfolio_selectwork').insertMany(
      selectworkData.map((sw: any, i: number) => ({ ...sw, _id: sw.id || `work_${i + 1}` }))
    );
    console.log('🌱 Seed data portfolio_selectwork berhasil dimasukkan.');
  }
}

export function getDb() {
  return { db, isConnected };
}