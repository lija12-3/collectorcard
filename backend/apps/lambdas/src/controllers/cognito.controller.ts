import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CognitoService } from '../services/cognito.service';
import { CreateUserDto, UpdateUserDto, SignInDto, ConfirmSignUpDto } from '../dtos';

@Controller('cognito')
export class CognitoController {
  constructor(private readonly cognitoService: CognitoService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.cognitoService.signUp(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.cognitoService.signIn(signInDto);
  }

  @Post('confirm-signup')
  async confirmSignUp(@Body() confirmSignUpDto: ConfirmSignUpDto) {
    return this.cognitoService.confirmSignUp(confirmSignUpDto);
  }

  @Post('resend-confirmation')
  async resendConfirmation(@Body() body: { email: string }) {
    return this.cognitoService.resendConfirmation(body.email);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.cognitoService.forgotPassword(body.email);
  }

  @Post('confirm-forgot-password')
  async confirmForgotPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    return this.cognitoService.confirmForgotPassword(body.email, body.code, body.newPassword);
  }

  @Post('change-password')
  async changePassword(@Body() body: { accessToken: string; oldPassword: string; newPassword: string }) {
    return this.cognitoService.changePassword(body.accessToken, body.oldPassword, body.newPassword);
  }

  @Get('user/:email')
  async getUser(@Param('email') email: string) {
    return this.cognitoService.getUser(email);
  }

  @Put('user/:email')
  async updateUser(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.cognitoService.updateUser(email, updateUserDto);
  }

  @Delete('user/:email')
  async deleteUser(@Param('email') email: string) {
    return this.cognitoService.deleteUser(email);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.cognitoService.refreshToken(body.refreshToken);
  }

  @Post('signout')
  async signOut(@Body() body: { accessToken: string }) {
    return this.cognitoService.signOut(body.accessToken);
  }
}
