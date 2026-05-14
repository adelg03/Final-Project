import { Hono } from 'hono'
import { getDb } from '../data/db.js'
import { 
  listSavedElections, 
  saveElection, 
  deleteSavedElection,
  findSavedElection 
} from '../data/saved-elections.repository.js'
import { parseJsonBody } from '../utils/body.js'
import { ApiError } from '../utils/errors.js'
import { sendCollection, sendResource } from '../utils/response.js'
import { validateSaveElection } from '../utils/validation.js'

const savedElections = new Hono()

savedElections.get('/', async (c) => {
  const userId = c.get('user').sub
  const db = getDb(c.env.DB)
  const data = await listSavedElections(db, userId)
  return sendCollection(c, data)
})

savedElections.post('/', async (c) => {
  const userId = c.get('user').sub
  const payload = await parseJsonBody(c)
  const details = validateSaveElection(payload)

  if (details.length > 0) {
    throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', details)
  }

  const db = getDb(c.env.DB)

  const existing = await findSavedElection(db, userId, payload.electionId)
  if (existing) {
    throw new ApiError(409, 'CONFLICT', 'Election already saved.')
  }

  const saved = await saveElection(db, userId, payload)
  c.header('Location', `/api/saved-elections/${saved.id}`)
  return sendResource(c, saved, 201)
})

savedElections.delete('/:id', async (c) => {
  const userId = c.get('user').sub
  const id = parseInt(c.req.param('id'))
  
  if (isNaN(id) || id <= 0) {
    throw new ApiError(400, 'BAD_REQUEST', 'Invalid election ID.')
  }

  const db = getDb(c.env.DB)
  const deleted = await deleteSavedElection(db, id, userId)

  if (!deleted) {
    throw new ApiError(404, 'NOT_FOUND', 'Saved election not found.')
  }

  return c.body(null, 204)
})

savedElections.get('/check/:electionId', async (c) => {
  const userId = c.get('user').sub
  const electionId = c.req.param('electionId')

  const db = getDb(c.env.DB)
  const saved = await findSavedElection(db, userId, electionId)

  return sendResource(c, { saved: !!saved, id: saved?.id || null })
})

export default savedElections