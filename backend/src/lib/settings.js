import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

const CONFIG_PK = 'CONFIG'
const CONFIG_SK = 'APP'

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export async function getPhotoUploadOpen() {
  const result = await ddb.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: CONFIG_PK, SK: CONFIG_SK },
    }),
  )
  return result.Item?.photoUploadOpen === true
}

export async function setPhotoUploadOpen(open) {
  const updatedAt = new Date().toISOString()
  await ddb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: CONFIG_PK,
        SK: CONFIG_SK,
        photoUploadOpen: open === true,
        updatedAt,
      },
    }),
  )
  return { photoUploadOpen: open === true, updatedAt }
}
