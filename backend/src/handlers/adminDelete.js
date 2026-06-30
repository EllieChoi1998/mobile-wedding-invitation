import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeleteCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { verifyAdminPassword, verifyDeletePassword } from '../lib/auth.js'
import { jsonResponse } from '../lib/response.js'

const VALID_SIDES = ['groom', 'bride']
const VALID_RESOURCES = ['rsvp', 'guestbook', 'photo']
const MAX_BATCH_SIZE = 100

const s3 = new S3Client({})
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const RESOURCE_CONFIG = {
  rsvp: {
    pk: (side) => `SIDE#${side}`,
    skPrefix: 'RSVP#',
    idField: 'rsvpId',
  },
  guestbook: {
    pk: () => 'GUESTBOOK',
    skPrefix: 'MSG#',
    idField: 'messageId',
  },
  photo: {
    pk: (side) => `SIDE#${side}`,
    skPrefix: 'PHOTO#',
    idField: 'photoId',
  },
}

async function findItem(resource, id, side) {
  const config = RESOURCE_CONFIG[resource]
  const result = await ddb.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': config.pk(side),
        ':skPrefix': config.skPrefix,
      },
    }),
  )

  return (result.Items ?? []).find((item) => item[config.idField] === id) ?? null
}

async function deleteOneEntry({ resource, id, side }) {
  if (!VALID_RESOURCES.includes(resource)) {
    return { resource, id, side, error: 'invalid resource' }
  }
  if (!id || typeof id !== 'string') {
    return { resource, id, side, error: 'id is required' }
  }
  if (resource !== 'guestbook' && !VALID_SIDES.includes(side)) {
    return { resource, id, side, error: 'side is required' }
  }

  const item = await findItem(resource, id, side)
  if (!item) {
    return { resource, id, side, error: 'not found' }
  }

  if (resource === 'photo' && item.s3Key) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: item.s3Key,
      }),
    )
  }

  await ddb.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: item.PK, SK: item.SK },
    }),
  )

  return { resource, id, side }
}

export async function handler(event) {
  try {
    const authError = verifyAdminPassword(event)
    if (authError) return authError

    const body = JSON.parse(event.body || '{}')
    const { deletePassword, items } = body

    const deleteAuthError = verifyDeletePassword(deletePassword)
    if (deleteAuthError) return deleteAuthError

    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse(400, { message: 'items array is required' })
    }
    if (items.length > MAX_BATCH_SIZE) {
      return jsonResponse(400, { message: `Cannot delete more than ${MAX_BATCH_SIZE} items at once` })
    }

    const deleted = []
    const failed = []

    for (const entry of items) {
      try {
        const result = await deleteOneEntry(entry)
        if (result.error) {
          failed.push(result)
        } else {
          deleted.push(result)
        }
      } catch (err) {
        console.error('deleteOneEntry error:', entry, err)
        failed.push({ ...entry, error: 'delete failed' })
      }
    }

    return jsonResponse(200, {
      message: 'Delete completed',
      deletedCount: deleted.length,
      failedCount: failed.length,
      deleted,
      failed,
    })
  } catch (err) {
    console.error('adminDelete error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
