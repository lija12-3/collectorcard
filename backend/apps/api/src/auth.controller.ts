import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminGetUserCommand, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { Response } from 'express';

const REGION = process.env.AWS_REGION || 'us-east-1';
const USER_POOL_ID = process.env.USER_POOL_ID;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // from Google console
const APP_DEEPLINK = process.env.APP_DEEPLINK || 'myapp://magic';

@Controller('auth')
export class AuthController {
  @Post('social/google/register')
  async google(@Body() body: { idToken: string }) {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: body.idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return { ok: false, error: 'No email from Google token.' };
    }
    const email = payload.email;
    const name = `${payload.given_name || ''} ${payload.family_name || ''}`.trim();

    const cognito = new CognitoIdentityProviderClient({ region: REGION });

    // ensure user exists and is confirmed
    try {
      await cognito.send(new AdminGetUserCommand({ UserPoolId: USER_POOL_ID, Username: email }));
    } catch {
      await cognito.send(new AdminCreateUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        MessageAction: 'SUPPRESS', // don't email temp password
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'name', Value: name },
          { Name: 'custom:isSocial', Value: 'true' }
        ]
      }));
      // make sure attributes reflect social signup (no password required; magic link will complete)
      await cognito.send(new AdminUpdateUserAttributesCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'email_verified', Value: 'true' },
          { Name: 'custom:isSocial', Value: 'true' }
        ]
      }));
    }

    // client now calls Amplify.Auth.signIn with CUSTOM_AUTH (username=email)
    return { ok: true, username: email };
  }

  // Universal landing page for magic link (optional; deep-links to app)
  @Get('magic/consume')
  async consume(@Query('code') code: string, @Res() res: Response) {
    // Validate code: alphanumeric, 6-64 chars 
    if (!code || !/^[A-Za-z0-9_-]{6,64}$/.test(code)) {
      return res.status(400).send('Invalid code parameter.');
    }
    const redirect = `${APP_DEEPLINK}?code=${encodeURIComponent(code)}`;
    res.status(302).setHeader('Location', redirect).send(`Open the app: <a href="${redirect}">${redirect}</a>`);
  }
}
