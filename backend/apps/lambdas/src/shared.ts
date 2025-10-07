import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const REGION = process.env.REGION || process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.TABLE_NAME;
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL;

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

export async function putCode(code: string, username: string, ttlSeconds: number) {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  await ddbDoc.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: { code, username, expiresAt }
  }));
}

export async function getAndDeleteCode(code: string) {
  const res = await ddbDoc.send(new GetCommand({ TableName: TABLE_NAME, Key: { code } }));
  if (res.Item) {
    await ddbDoc.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { code } }));
  }
  return res.Item as { code: string; username: string; expiresAt: number } | undefined;
}

export function newCode(): string {
  // short code for manual entry
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

export function newLinkToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export async function sendMagicLinkEmail(to: string, linkUrl: string, code: string) {
  const client = new SESClient({ region: REGION });
  const subject = "Your sign-in link";
  const bodyText = `Click to sign in: ${linkUrl}\n\nOr enter this code in the app: ${code} (valid for 10 minutes).`;
  const bodyHtml = `<p>Click to sign in:</p><p><a href="${linkUrl}">${linkUrl}</a></p><p>Or enter this code in the app: <b>${code}</b> (valid for 10 minutes).</p>`;
  await client.send(new SendEmailCommand({
    Destination: { ToAddresses: [to] },
    Source: SES_FROM_EMAIL,
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: bodyText },
        Html: { Data: bodyHtml }
      }
    }
  }));
}
