import type { Handler } from "aws-lambda";
import { getAndDeleteCode } from "./shared";

/**
 * Accept either the short numeric code or the long link token.
 */
export const handler: Handler = async (event: any) => {
  const userAnswer: string = (event.request.challengeAnswer || "").trim();

  // accept either the private code or a stored link token
  const privateAnswer = event.request.privateChallengeParameters?.answer;
  let ok = false;

  if (userAnswer && privateAnswer && userAnswer === privateAnswer) {
    ok = true;
  } else if (userAnswer) {
    const record = await getAndDeleteCode(userAnswer);
    ok = !!(
    record &&
    record.username === event.userName &&
    typeof record.expiresAt === "number" &&
    Date.now() < record.expiresAt
    );
  }

  event.response.answerCorrect = ok;
  return event;
};
