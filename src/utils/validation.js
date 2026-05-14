import { z } from 'zod'
import { ApiError } from './errors.js'

const idParamSchema = z
  .string()
  .regex(/^\d+$/, { message: 'ID must be a positive integer.' })
  .transform((value) => Number(value))
  .refine((value) => Number.isSafeInteger(value) && value > 0, {
    message: 'ID must be a positive integer.',
  })

const registerSchema = z.strictObject({
  email: z.string().email({ message: 'Email must be a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
})

const loginSchema = z.strictObject({
  email: z.string().email({ message: 'Email must be a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
})

const refreshSchema = z.strictObject({
  refresh_token: z.string().min(1, { message: 'Refresh token is required.' }),
})

const logoutSchema = z.strictObject({
  refresh_token: z.string().min(1, { message: 'Refresh token is required.' }),
})

const saveElectionSchema = z.strictObject({
  electionId: z.string().min(1, { message: 'Election ID is required.' }),
  title: z.string().min(1, { message: 'Election title is required.' }),
  electionDate: z.string().min(1, { message: 'Election date is required.' }),
  electionType: z.string().optional(),
  notes: z.string().optional(),
})

function mapZodIssuesToDetails(issues) {
  const details = []

  for (const issue of issues) {
    if (issue.code === 'unrecognized_keys') {
      for (const key of issue.keys) {
        details.push({ field: key, issue: 'Field is not allowed.' })
      }
      continue
    }

    if (issue.code === 'invalid_type' && issue.path.length === 0) {
      details.push({
        field: 'body',
        issue: 'Request body must be a JSON object.',
      })
      continue
    }

    const field = issue.path.length > 0 ? issue.path.join('.') : 'body'
    details.push({ field, issue: issue.message })
  }

  return details
}

function validateWithSchema(payload, schema) {
  const result = schema.safeParse(payload)

  if (result.success) {
    return []
  }

  return mapZodIssuesToDetails(result.error.issues)
}

export function parseIdParam(rawValue, fieldName = 'id') {
  const result = idParamSchema.safeParse(rawValue)

  if (!result.success) {
    throw new ApiError(400, 'BAD_REQUEST', 'Malformed request.', [
      {
        field: fieldName,
        issue: result.error.issues[0]?.message || 'ID must be a positive integer.',
      },
    ])
  }

  return result.data
}

export function validateRegister(payload) {
  return validateWithSchema(payload, registerSchema)
}

export function validateLogin(payload) {
  return validateWithSchema(payload, loginSchema)
}

export function validateRefresh(payload) {
  return validateWithSchema(payload, refreshSchema)
}

export function validateLogout(payload) {
  return validateWithSchema(payload, logoutSchema)
}

export function validateSaveElection(payload) {
  return validateWithSchema(payload, saveElectionSchema)
}