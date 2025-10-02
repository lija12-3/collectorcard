"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoService = void 0;
const common_1 = require("@nestjs/common");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
let CognitoService = class CognitoService {
    constructor() {
        this.cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
            region: process.env.AWS_REGION || 'us-east-1',
        });
        this.userPoolId = process.env.COGNITO_USER_POOL_ID;
        this.clientId = process.env.COGNITO_CLIENT_ID;
    }
    async signUp(createUserDto) {
        try {
            const command = new client_cognito_identity_provider_1.AdminCreateUserCommand({
                UserPoolId: this.userPoolId,
                Username: createUserDto.email,
                UserAttributes: [
                    { Name: 'email', Value: createUserDto.email },
                    { Name: 'given_name', Value: createUserDto.firstName },
                    { Name: 'family_name', Value: createUserDto.lastName },
                    { Name: 'email_verified', Value: 'true' },
                ],
                TemporaryPassword: createUserDto.temporaryPassword || this.generateTemporaryPassword(),
                MessageAction: client_cognito_identity_provider_1.MessageActionType.SUPPRESS,
            });
            const result = await this.cognitoClient.send(command);
            return {
                success: true,
                message: 'User created successfully',
                user: result.User,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create user: ${error.message}`);
        }
    }
    async signIn(signInDto) {
        try {
            const command = new client_cognito_identity_provider_1.InitiateAuthCommand({
                AuthFlow: client_cognito_identity_provider_1.AuthFlowType.USER_PASSWORD_AUTH,
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
        }
        catch (error) {
            throw new common_1.UnauthorizedException(`Sign in failed: ${error.message}`);
        }
    }
    async confirmSignUp(confirmSignUpDto) {
        try {
            const command = new client_cognito_identity_provider_1.ConfirmSignUpCommand({
                ClientId: this.clientId,
                Username: confirmSignUpDto.email,
                ConfirmationCode: confirmSignUpDto.code,
            });
            await this.cognitoClient.send(command);
            return {
                success: true,
                message: 'Email confirmed successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Confirmation failed: ${error.message}`);
        }
    }
    async resendConfirmation(email) {
        try {
            const command = new client_cognito_identity_provider_1.ResendConfirmationCodeCommand({
                ClientId: this.clientId,
                Username: email,
            });
            await this.cognitoClient.send(command);
            return {
                success: true,
                message: 'Confirmation code resent successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to resend confirmation: ${error.message}`);
        }
    }
    async forgotPassword(email) {
        try {
            const command = new client_cognito_identity_provider_1.ForgotPasswordCommand({
                ClientId: this.clientId,
                Username: email,
            });
            await this.cognitoClient.send(command);
            return {
                success: true,
                message: 'Password reset code sent successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to send password reset: ${error.message}`);
        }
    }
    async confirmForgotPassword(email, code, newPassword) {
        try {
            const command = new client_cognito_identity_provider_1.ConfirmForgotPasswordCommand({
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
        }
        catch (error) {
            throw new common_1.BadRequestException(`Password reset failed: ${error.message}`);
        }
    }
    async changePassword(accessToken, oldPassword, newPassword) {
        try {
            const command = new client_cognito_identity_provider_1.ChangePasswordCommand({
                AccessToken: accessToken,
                PreviousPassword: oldPassword,
                ProposedPassword: newPassword,
            });
            await this.cognitoClient.send(command);
            return {
                success: true,
                message: 'Password changed successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Password change failed: ${error.message}`);
        }
    }
    async getUser(email) {
        try {
            const command = new client_cognito_identity_provider_1.AdminGetUserCommand({
                UserPoolId: this.userPoolId,
                Username: email,
            });
            const result = await this.cognitoClient.send(command);
            return {
                success: true,
                user: result,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get user: ${error.message}`);
        }
    }
    async updateUser(email, updateUserDto) {
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
            const command = new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand({
                UserPoolId: this.userPoolId,
                Username: email,
                UserAttributes: attributes,
            });
            await this.cognitoClient.send(command);
            return {
                success: true,
                message: 'User updated successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to update user: ${error.message}`);
        }
    }
    async deleteUser(email) {
        try {
            const command = new client_cognito_identity_provider_1.AdminDeleteUserCommand({
                UserPoolId: this.userPoolId,
                Username: email,
            });
            await this.cognitoClient.send(command);
            return {
                success: true,
                message: 'User deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to delete user: ${error.message}`);
        }
    }
    async refreshToken(refreshToken) {
        try {
            const command = new client_cognito_identity_provider_1.RevokeTokenCommand({
                ClientId: this.clientId,
                Token: refreshToken,
            });
            const result = await this.cognitoClient.send(command);
            return {
                success: true,
                authenticationResult: result.AuthenticationResult,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException(`Token refresh failed: ${error.message}`);
        }
    }
    async signOut(accessToken) {
        try {
            const command = new client_cognito_identity_provider_1.GlobalSignOutCommand({
                AccessToken: accessToken,
            });
            await this.cognitoClient.send(command);
            return {
                success: true,
                message: 'Signed out successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Sign out failed: ${error.message}`);
        }
    }
    generateTemporaryPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
};
exports.CognitoService = CognitoService;
exports.CognitoService = CognitoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CognitoService);
//# sourceMappingURL=cognito.service.js.map