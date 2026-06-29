import { randomUUID } from 'crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const VALID_SIDES = ['groom', 'bride']
const PRESIGN_EXPIRES_IN = 300

const s3 = new S3Client({})
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  }
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200)
}

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}')
    const { side, fileName, contentType } = body

    if (!VALID_SIDES.includes(side)) {
      return jsonResponse(400, { message: 'side must be groom or bride' })
    }
    if (!fileName || !contentType) {
      return jsonResponse(400, { message: 'fileName and contentType are required' })
    }

    const photoId = randomUUID()
    const safeFileName = sanitizeFileName(fileName)
    const s3Key = `photos/${side}/${photoId}-${safeFileName}`
    const uploadedAt = new Date().toISOString()
    const sk = `PHOTO#${uploadedAt}#${photoId}`

    const putCommand = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: s3Key,
      ContentType: contentType,
    })
    const uploadUrl = await getSignedUrl(s3, putCommand, { expiresIn: PRESIGN_EXPIRES_IN })

    await ddb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: `SIDE#${side}`,
          SK: sk,
          photoId,
          s3Key,
          fileName: safeFileName,
          contentType,
          uploadedAt,
        },
      }),
    )

    return jsonResponse(200, { uploadUrl, photoId, s3Key })
  } catch (err) {
    console.error('presignUpload error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
