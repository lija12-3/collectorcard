import type { Handler } from 'aws-lambda';

/**
 * Enhance ID token claims (v2): add tenantId and roles to the ID token.
 */
export const handler: Handler = async (event: any) => {
  const attrs = event.request.userAttributes || {};
  const claimsToAddOrOverride: Record<string, string> = {};

  if (attrs['custom:tenantId'])
    claimsToAddOrOverride['tenantId'] = attrs['custom:tenantId'];
  if (attrs['custom:roles'])
    claimsToAddOrOverride['roles'] = attrs['custom:roles'];

  event.response = event.response || {};
  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride,
  };
  return event;
};
