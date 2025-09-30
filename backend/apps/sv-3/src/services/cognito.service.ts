import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CognitoIdentityProviderClient, 
         AdminCreateUserCommand,
         AdminGetUserCommand,
         AdminUpdateUserAttributesCommand,
         AdminDeleteUserCommand,
         InitiateAuthCommand,
         ConfirmSignUpCommand,
         ResendConfirmationCodeCommand,
         ForgotPasswordCommand,
         ConfirmForgotPasswordCommand,
         ChangePasswordCommand,
         GlobalSignOutCommand,
         RefreshTokenCommand,
         AuthFlowType,
         MessageActionType
} from '@aws-sdk/client-cognito-identity-provider';
import { CreateUserDto, UpdateUserDto, SignInDto, ConfirmSignUpDto } from '../dtos';

@Injectable()
export class CognitoService {
  private cognitoClient: CognitoIdentityProviderClient;
  private userPoolId: string;
  private clientId: string;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.userPoolId = process.env.COGNITO_USER_POOL_ID;
    this.clientId = process.env.COGNITO_CLIENT_ID;
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const command = new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username: createUserDto.email,
        UserAttributes: [
          { Name: 'email', Value: createUserDto.email },
          { Name: 'given_name', Value: createUserDto.firstName },
          { Name: 'family_name', Value: createUserDto.lastName },
          { Name: 'email_verified', Value: 'true' },
        ],
        TemporaryPassword: createUserDto.temporaryPassword || this.generateTemporaryPassword(),
        MessageAction: MessageActionType.SUPPRESS,
      });

      const result = await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'User created successfully',
        user: result.User,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: signInDto.email,
          PASSWORD: signInDto.password,
        },
      });

      const result = await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Sign in successful',
        authenticationResult: result.AuthenticationResult,
      };
    } catch (error) {
      throw new UnauthorizedException(`Sign in failed: ${error.message}`);
    }
  }

  async confirmSignUp(confirmSignUpDto: ConfirmSignUpDto) {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: this.clientId,
        Username: confirmSignUpDto.email,
        ConfirmationCode: confirmSignUpDto.code,
      });

      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Email confirmed successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Confirmation failed: ${error.message}`);
    }
  }

  async resendConfirmation(email: string) {
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: this.clientId,
        Username: email,
      });

      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Confirmation code resent successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to resend confirmation: ${error.message}`);
    }
  }

  async forgotPassword(email: string) {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: this.clientId,
        Username: email,
      });

      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Password reset code sent successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to send password reset: ${error.message}`);
    }
  }

  async confirmForgotPassword(email: string, code: string, newPassword: string) {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: this.clientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      });

      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Password reset failed: ${error.message}`);
    }
  }

  async changePassword(accessToken: string, oldPassword: string, newPassword: string) {
    try {
      const command = new ChangePasswordCommand({
        AccessToken: accessToken,
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword,
      });

      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Password change failed: ${error.message}`);
    }
  }

  async getUser(email: string) {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: email,
      });

      const result = await this.cognitoClient.send(command);
      return {
        success: true,
        user: result,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get user: ${error.message}`);
    }
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    try {
      const attributes = [];
      
      if (updateUserDto.firstName) {
        attributes.push({ Name: 'given_name', Value: updateUserDto.firstName });
      }
      if (updateUserDto.lastName) {
        attributes.push({ Name: 'family_name', Value: updateUserDto.lastName });
      }
      if (updateUserDto.email) {
        attributes.push({ Name: 'email', Value: updateUserDto.email });
      }

      const command = new AdminUpdateUserAttributesCommand({
        UserPoolId: this.userPoolId,
        Username: email,
        UserAttributes: attributes,
      });

      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(email: string) {
    try {
      const command = new AdminDeleteUserCommand({
        UserPoolId: this.userPoolId,
        Username: email,
      });

      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const command = new RefreshTokenCommand({
        ClientId: this.clientId,
        RefreshToken: refreshToken,
      });

      const result = await this.cognitoClient.send(command);
      return {
        success: true,
        authenticationResult: result.AuthenticationResult,
      };
    } catch (error) {
      throw new UnauthorizedException(`Token refresh failed: ${error.message}`);
    }
  }

  async signOut(accessToken: string) {
    try {
      const command = new GlobalSignOutCommand({
        AccessToken: accessToken,
      });

      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Signed out successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Sign out failed: ${error.message}`);
    }
  }

  private generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
