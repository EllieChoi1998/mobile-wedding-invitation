import { randomUUID } from 'crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { getRsvpOpen } from '../lib/settings.js'

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

function sanitizeName(name) {
  return name.trim().slice(0, 50)
}

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}')
    const { guestName, side, attending } = body

    if (!guestName || !sanitizeName(guestName)) {
      return jsonResponse(400, { message: 'guestName is required' })
    }
    if (!VALID_SIDES.includes(side)) {
      return jsonResponse(400, { message: 'side must be groom or bride' })
    }
    if (typeof attending !== 'boolean') {
      return jsonResponse(400, { message: 'attending must be a boolean' })
    }

    const rsvpOpen = await getRsvpOpen()
    if (!rsvpOpen) {
      return jsonResponse(403, { message: 'RSVP submission is closed' })
    }

    const rsvpId = randomUUID()
    const createdAt = new Date().toISOString()
    const sk = `RSVP#${createdAt}#${rsvpId}`

    await ddb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: `SIDE#${side}`,
          SK: sk,
          rsvpId,
          guestName: sanitizeName(guestName),
          side,
          attending,
          createdAt,
        },
      }),
    )

    return jsonResponse(201, { rsvpId, message: 'RSVP submitted successfully' })
  } catch (err) {
    console.error('submitRsvp error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
