import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const VALID_SIDES = ['groom', 'bride']
const VIEW_URL_EXPIRES_IN = 3600

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

async function createViewUrl(s3Key) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: s3Key,
  })
  return getSignedUrl(s3, command, { expiresIn: VIEW_URL_EXPIRES_IN })
}

export async function handler(event) {
  try {
    const side = event.queryStringParameters?.side

    if (!VALID_SIDES.includes(side)) {
      return jsonResponse(400, { message: 'side query parameter must be groom or bride' })
    }

    const result = await ddb.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `SIDE#${side}`,
          ':skPrefix': 'PHOTO#',
        },
        ScanIndexForward: false,
      }),
    )

    const photos = await Promise.all(
      (result.Items ?? []).map(async (item) => ({
        photoId: item.photoId,
        s3Key: item.s3Key,
        fileName: item.fileName,
        uploadedAt: item.uploadedAt,
        viewUrl: await createViewUrl(item.s3Key),
      })),
    )

    return jsonResponse(200, { photos })
  } catch (err) {
    console.error('listPhotos error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
