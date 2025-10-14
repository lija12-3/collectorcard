import type { Handler } from 'aws-lambda';

/**
 * Block sign-in if email not verified, or other risk checks.
 */
export const handler: Handler = async (event: any) => {
  const attrs = event.request.userAttributes || {};
  if (attrs.email_verified !== 'true') {
    throw new Error('Email is not verified.');
  }
  // (Optional) Block disabled users or suspicious IPs, etc.
  return event;
};
