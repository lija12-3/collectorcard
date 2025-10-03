import { CognitoService } from '../services/cognito.service';
import { CreateUserDto, UpdateUserDto, SignInDto, ConfirmSignUpDto } from '../dtos';
export declare class CognitoController {
    private readonly cognitoService;
    constructor(cognitoService: CognitoService);
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
    resendConfirmation(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    confirmForgotPassword(body: {
        email: string;
        code: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(body: {
        accessToken: string;
        oldPassword: string;
        newPassword: string;
    }): Promise<{
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
    refreshToken(body: {
        refreshToken: string;
    }): Promise<{
        success: boolean;
        authenticationResult: any;
    }>;
    signOut(body: {
        accessToken: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
