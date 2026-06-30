import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { verifyAdminPassword } from '../lib/auth.js'
import { jsonResponse } from '../lib/response.js'

const URL_EXPIRES_IN = 3600
const GUESTBOOK_LIMIT = 500

const s3 = new S3Client({})
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

async function queryByPrefix(pk, skPrefix) {
  const result = await ddb.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':skPrefix': skPrefix,
      },
      ScanIndexForward: false,
    }),
  )
  return result.Items ?? []
}

async function createViewUrl(s3Key) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: s3Key,
  })
  return getSignedUrl(s3, command, { expiresIn: URL_EXPIRES_IN })
}

async function createDownloadUrl(s3Key, fileName, contentType) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: s3Key,
    ResponseContentType: contentType,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  })
  return getSignedUrl(s3, command, { expiresIn: URL_EXPIRES_IN })
}

async function listPhotosForSide(side) {
  const items = await queryByPrefix(`SIDE#${side}`, 'PHOTO#')
  return Promise.all(
    items.map(async (item) => ({
      photoId: item.photoId,
      fileName: item.fileName,
      contentType: item.contentType,
      uploadedAt: item.uploadedAt,
      viewUrl: await createViewUrl(item.s3Key),
      downloadUrl: await createDownloadUrl(item.s3Key, item.fileName, item.contentType),
    })),
  )
}

export async function handler(event) {
  try {
    const authError = verifyAdminPassword(event)
    if (authError) return authError

    const [groomRsvps, brideRsvps, guestbookItems, groomPhotos, bridePhotos] = await Promise.all([
      queryByPrefix('SIDE#groom', 'RSVP#'),
      queryByPrefix('SIDE#bride', 'RSVP#'),
      ddb.send(
        new QueryCommand({
          TableName: process.env.TABLE_NAME,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
          ExpressionAttributeValues: {
            ':pk': 'GUESTBOOK',
            ':skPrefix': 'MSG#',
          },
          ScanIndexForward: false,
          Limit: GUESTBOOK_LIMIT,
        }),
      ).then((r) => r.Items ?? []),
      listPhotosForSide('groom'),
      listPhotosForSide('bride'),
    ])

    const rsvps = [...groomRsvps, ...brideRsvps]
      .map((item) => ({
        rsvpId: item.rsvpId,
        guestName: item.guestName,
        side: item.side,
        attending: item.attending,
        createdAt: item.createdAt,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    const guestbook = guestbookItems
      .map((item) => ({
        messageId: item.messageId,
        authorName: item.authorName,
        message: item.message,
        side: item.side ?? null,
        createdAt: item.createdAt,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    const photos = {
      groom: groomPhotos,
      bride: bridePhotos,
    }

    const attendingCount = rsvps.filter((r) => r.attending).length

    return jsonResponse(200, {
      summary: {
        rsvp: {
          total: rsvps.length,
          attending: attendingCount,
          notAttending: rsvps.length - attendingCount,
        },
        guestbook: { total: guestbook.length },
        photos: {
          groom: photos.groom.length,
          bride: photos.bride.length,
        },
      },
      rsvps,
      guestbook,
      photos,
    })
  } catch (err) {
    console.error('adminGetData error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
