import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

const CONFIG_PK = 'CONFIG'
const CONFIG_SK = 'APP'

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

async function getAppConfig() {
  const result = await ddb.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: CONFIG_PK, SK: CONFIG_SK },
    }),
  )
  return result.Item ?? {}
}

function toPublicStatus(config) {
  return {
    photoUploadOpen: config.photoUploadOpen === true,
    guestbookOpen: config.guestbookOpen !== false,
    rsvpOpen: config.rsvpOpen !== false,
  }
}

export async function getPhotoUploadOpen() {
  const config = await getAppConfig()
  return config.photoUploadOpen === true
}

export async function getGuestbookOpen() {
  const config = await getAppConfig()
  return config.guestbookOpen !== false
}

export async function getRsvpOpen() {
  const config = await getAppConfig()
  return config.rsvpOpen !== false
}

export async function getPublicAppStatus() {
  const config = await getAppConfig()
  return toPublicStatus(config)
}

export async function setPhotoUploadOpen(open) {
  return updateAppSettings({ photoUploadOpen: open === true })
}

export async function updateAppSettings(updates) {
  const existing = await getAppConfig()
  const updatedAt = new Date().toISOString()
  const nextItem = {
    PK: CONFIG_PK,
    SK: CONFIG_SK,
    ...existing,
    ...updates,
    updatedAt,
  }

  await ddb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: nextItem,
    }),
  )

  return { ...toPublicStatus(nextItem), updatedAt }
}
