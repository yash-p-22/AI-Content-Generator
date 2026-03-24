import Dexie, { type EntityTable } from 'dexie';
import type { GenerationRecord } from '@shared/schema';

// Setup Dexie database for local persistence
const db = new Dexie('contentGeneratorDB') as Dexie & {
  generations: EntityTable<GenerationRecord, 'id'>;
};

// Schema declaration
db.version(1).stores({
  generations: '++id, timestamp' // Primary key and indexed props
});

export { db };

// Utility to check rate limits
export const DAILY_LIMIT = 50;

export async function checkRateLimit(): Promise<{ allowed: boolean; remaining: number }> {
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
  
  try {
    const recentGenerationsCount = await db.generations
      .where('timestamp')
      .above(twentyFourHoursAgo)
      .count();
      
    return {
      allowed: recentGenerationsCount < DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - recentGenerationsCount)
    };
  } catch (error) {
    console.error("Failed to check rate limit", error);
    return { allowed: true, remaining: DAILY_LIMIT };
  }
}
