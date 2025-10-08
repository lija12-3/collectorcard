import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

const APP_DEEPLINK = process.env.APP_DEEPLINK || 'myapp://magic';

@Controller('auth')
export class AuthController {
  // Universal landing page for magic link (optional; deep-links to app)
  @Get('magic/consume')
  async consume(@Query('code') code: string, @Res() res: Response) {
    const redirect = `${APP_DEEPLINK}?code=${encodeURIComponent(code)}`;
    res.status(302).setHeader('Location', redirect).send(`Open the app: <a href="${redirect}">${redirect}</a>`);
  }
}
