import type { Handler } from 'aws-lambda';
import { newCode, newLinkToken, putCode, sendMagicLinkEmail } from './shared';

const BASE = process.env.MAGIC_LINK_BASE_URL || 'myapp://magic';

/**
 * Sends a magic link via SES and stores code+token in DynamoDB (TTL 10 min).
 * Public params are shown to the client (optional).
 * Private params hold the correct answer for non-link verification.
 */
export const handler: Handler = async (event: any) => {
  if (event.request.challengeName !== 'CUSTOM_CHALLENGE') return event;

  const email = event.request.userAttributes.email || event.userName;
  const code = newCode();
  const linkToken = newLinkToken();

  // store link token (preferred) AND short code (manual entry) bound to user
  await putCode(linkToken, event.userName, 600);
  await putCode(code, event.userName, 600);

  const linkUrl = BASE.includes('://')
    ? `${BASE}?code=${encodeURIComponent(linkToken)}`
    : `${BASE}/auth/magic/consume?code=${encodeURIComponent(linkToken)}`;

  await sendMagicLinkEmail(email, linkUrl, code);

  event.response.publicChallengeParameters = { delivery: 'email' };
  event.response.privateChallengeParameters = { answer: code, linkToken };
  event.response.challengeMetadata = 'MAGIC_LINK';
  return event;
};
