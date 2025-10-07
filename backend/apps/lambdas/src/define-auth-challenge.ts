// Custom auth flow state machine
import type { Handler } from "aws-lambda";

export const handler: Handler = async (event: any) => {
  const session = event.request.session || [];
  const last = session[session.length - 1];

  // first attempt
  if (session.length === 0) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
    return event;
  }

  // if previous CUSTOM_CHALLENGE was successful → issue tokens
  if (last && last.challengeName === "CUSTOM_CHALLENGE" && last.challengeResult === true) {
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
    return event;
  }

  // retry up to 3 times
  if (session.length >= 3) {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  } else {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  }
  return event;
};
