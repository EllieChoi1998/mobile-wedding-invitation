import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeleteCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { verifyAdminPassword } from '../lib/auth.js'
import { jsonResponse } from '../lib/response.js'

const VALID_SIDES = ['groom', 'bride']
const VALID_RESOURCES = ['rsvp', 'guestbook', 'photo']

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

export async function handler(event) {
  try {
    const authError = verifyAdminPassword(event)
    if (authError) return authError

    const body = JSON.parse(event.body || '{}')
    const { resource, id, side } = body

    if (!VALID_RESOURCES.includes(resource)) {
      return jsonResponse(400, { message: 'resource must be rsvp, guestbook, or photo' })
    }
    if (!id || typeof id !== 'string') {
      return jsonResponse(400, { message: 'id is required' })
    }
    if (resource !== 'guestbook' && !VALID_SIDES.includes(side)) {
      return jsonResponse(400, { message: 'side must be groom or bride for this resource' })
    }

    const item = await findItem(resource, id, side)
    if (!item) {
      return jsonResponse(404, { message: 'Item not found' })
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

    return jsonResponse(200, { message: 'Deleted successfully', resource, id })
  } catch (err) {
    console.error('adminDelete error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
