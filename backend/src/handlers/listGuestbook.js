import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

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

export async function handler(event) {
  try {
    const params = event.queryStringParameters ?? {}
    const limit = Math.min(Math.max(parseInt(params.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT)
    const cursor = params.cursor

    const queryInput = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': 'GUESTBOOK',
        ':skPrefix': 'MSG#',
      },
      ScanIndexForward: false,
      Limit: limit,
    }

    if (cursor) {
      queryInput.ExclusiveStartKey = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'))
    }

    const result = await ddb.send(new QueryCommand(queryInput))

    const messages = (result.Items ?? []).map((item) => ({
      messageId: item.messageId,
      authorName: item.authorName,
      message: item.message,
      side: item.side ?? null,
      createdAt: item.createdAt,
    }))

    const nextCursor = result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64url')
      : null

    return jsonResponse(200, { messages, nextCursor })
  } catch (err) {
    console.error('listGuestbook error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
