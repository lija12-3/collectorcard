import type { Handler } from "aws-lambda";

/**
 * Enhance ID token claims (v2): add tenantId, roles, isSocial to the ID token.
 */
export const handler: Handler = async (event: any) => {
  const attrs = event.request.userAttributes || {};
  const claimsToAddOrOverride: Record<string,string> = {};

  if (attrs["custom:tenantId"]) claimsToAddOrOverride["tenantId"] = attrs["custom:tenantId"];
  if (attrs["custom:roles"]) claimsToAddOrOverride["roles"] = attrs["custom:roles"];
  if (attrs["custom:isSocial"]) claimsToAddOrOverride["isSocial"] = attrs["custom:isSocial"];

  event.response = event.response || {};
  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride
  };
  return event;
};
