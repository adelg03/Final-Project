import { and, eq, desc } from 'drizzle-orm'
import { nowIso } from './db.js'
import { savedElections } from './schema.js'

export async function listSavedElections(db, userId) {
  return db
    .select()
    .from(savedElections)
    .where(eq(savedElections.userId, userId))
    .orderBy(desc(savedElections.electionDate))
}

export async function saveElection(db, userId, { electionId, title, electionDate, electionType, notes }) {
  const [saved] = await db
    .insert(savedElections)
    .values({
      userId,
      electionId,
      title,
      electionDate,
      electionType: electionType || 'general',
      notes: notes || null,
      savedAt: nowIso(),
    })
    .returning()

  return saved
}

export async function deleteSavedElection(db, id, userId) {
  const deleted = await db
    .delete(savedElections)
    .where(and(eq(savedElections.id, id), eq(savedElections.userId, userId)))
    .returning({ id: savedElections.id })

  return deleted.length > 0
}

export async function findSavedElection(db, userId, electionId) {
  const [saved] = await db
    .select()
    .from(savedElections)
    .where(and(eq(savedElections.userId, userId), eq(savedElections.electionId, electionId)))

  return saved || null
}