import { randomUUID } from 'crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const VALID_SIDES = ['groom', 'bride']

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

function sanitizeText(text, maxLen) {
  return text.trim().slice(0, maxLen)
}

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}')
    const { authorName, message, side } = body

    if (!authorName || !sanitizeText(authorName, 50)) {
      return jsonResponse(400, { message: 'authorName is required' })
    }
    if (!message || !sanitizeText(message, 500)) {
      return jsonResponse(400, { message: 'message is required' })
    }
    if (side !== undefined && side !== null && side !== '' && !VALID_SIDES.includes(side)) {
      return jsonResponse(400, { message: 'side must be groom or bride when provided' })
    }

    const messageId = randomUUID()
    const createdAt = new Date().toISOString()
    const sk = `MSG#${createdAt}#${messageId}`

    await ddb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: 'GUESTBOOK',
          SK: sk,
          messageId,
          authorName: sanitizeText(authorName, 50),
          message: sanitizeText(message, 500),
          side: side && VALID_SIDES.includes(side) ? side : null,
          createdAt,
        },
      }),
    )

    return jsonResponse(201, { messageId, message: 'Guestbook entry submitted successfully' })
  } catch (err) {
    console.error('submitGuestbook error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
