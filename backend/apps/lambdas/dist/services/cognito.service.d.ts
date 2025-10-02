import { CreateUserDto, UpdateUserDto, SignInDto, ConfirmSignUpDto } from '../dtos';
export declare class CognitoService {
    private cognitoClient;
    private userPoolId;
    private clientId;
    constructor();
    signUp(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        user: import("@aws-sdk/client-cognito-identity-provider").UserType;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        success: boolean;
        message: string;
        authenticationResult: any;
    }>;
    confirmSignUp(confirmSignUpDto: ConfirmSignUpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resendConfirmation(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    confirmForgotPassword(email: string, code: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(accessToken: string, oldPassword: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUser(email: string): Promise<{
        success: boolean;
        user: import("@aws-sdk/client-cognito-identity-provider").AdminGetUserCommandOutput;
    }>;
    updateUser(email: string, updateUserDto: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        success: boolean;
        authenticationResult: any;
    }>;
    signOut(accessToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateTemporaryPassword;
}
