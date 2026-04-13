import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, WriteBatch } from 'firebase-admin/firestore';

// ─── This route reads all curriculum JSON files and upserts them
// ─── into Firestore under the `curriculum` collection.
// ─── Structure:
// ───   curriculum/{moduleId}  → module metadata (no lessons array)
// ───   curriculum/{moduleId}/lessons/{lessonId}  → full lesson object
// ───
// ─── Call: GET /api/seed-curriculum  (server-side, one-time operation)

const CURRICULUM_DIR = path.join(process.cwd(), 'lib', 'curriculum');
const TRACKS = ['python', 'html', 'css', 'javascript', 'react'];

function getAdminDb() {
  // Re-use existing admin app if already initialised
  if (getApps().some(a => a.name === 'admin-seed')) {
    return getFirestore(getApps().find(a => a.name === 'admin-seed')!);
  }

  // Initialise using service account env vars if available,
  // otherwise fall back to Application Default Credentials (emulator / CI).
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    const app = initializeApp({ credential: cert(serviceAccount), projectId }, 'admin-seed');
    return getFirestore(app);
  }

  // Fallback: use GOOGLE_APPLICATION_CREDENTIALS or local emulator
  const app = initializeApp({ projectId }, 'admin-seed');
  return getFirestore(app);
}

/** Split an array into chunks of size n */
function chunk<T>(arr: T[], n: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += n) chunks.push(arr.slice(i, i + n));
  return chunks;
}

export async function GET(req: NextRequest) {
  // Simple secret check — add ?secret=YOUR_SECRET to the URL
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.SEED_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const db = getAdminDb();
    const stats = { modules: 0, lessons: 0, tracks: 0, skipped: 0 };

    for (const track of TRACKS) {
      const trackDir = path.join(CURRICULUM_DIR, track);
      if (!fs.existsSync(trackDir)) { stats.skipped++; continue; }

      // Read track index
      const indexPath = path.join(trackDir, 'index.json');
      if (!fs.existsSync(indexPath)) { stats.skipped++; continue; }
      const trackIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

      // Upsert track index doc
      await db.collection('curriculumTracks').doc(track).set(trackIndex, { merge: true });
      stats.tracks++;

      // Read each module JSON
      const moduleFiles = fs.readdirSync(trackDir).filter(
        f => f.endsWith('.json') && f !== 'index.json'
      );

      for (const file of moduleFiles) {
        const filePath = path.join(trackDir, file);
        let moduleData: any;
        try {
          moduleData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch {
          console.error(`Failed to parse ${file}`);
          stats.skipped++;
          continue;
        }

        const moduleId: string = moduleData.id;
        if (!moduleId) { stats.skipped++; continue; }

        const lessons: any[] = moduleData.lessons || [];

        // Write module metadata (without the lessons array — stored in subcollection)
        const { lessons: _drop, ...moduleMeta } = moduleData;
        const moduleRef = db.collection('curriculum').doc(moduleId);
        await moduleRef.set({ ...moduleMeta, lessonCount: lessons.length }, { merge: true });
        stats.modules++;

        // Write lessons in batches of 400 (Firestore limit is 500 per batch)
        const lessonChunks = chunk(lessons, 400);
        for (const lessonChunk of lessonChunks) {
          const batch: WriteBatch = db.batch();
          for (const lesson of lessonChunk) {
            if (!lesson.id) continue;
            const lessonRef = moduleRef.collection('lessons').doc(lesson.id);
            batch.set(lessonRef, lesson, { merge: true });
            stats.lessons++;
          }
          await batch.commit();
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Curriculum synced to Firestore successfully.`,
      stats,
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
