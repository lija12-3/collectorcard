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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoController = void 0;
const common_1 = require("@nestjs/common");
const cognito_service_1 = require("../services/cognito.service");
const dtos_1 = require("../dtos");
let CognitoController = class CognitoController {
    constructor(cognitoService) {
        this.cognitoService = cognitoService;
    }
    async signUp(createUserDto) {
        return this.cognitoService.signUp(createUserDto);
    }
    async signIn(signInDto) {
        return this.cognitoService.signIn(signInDto);
    }
    async confirmSignUp(confirmSignUpDto) {
        return this.cognitoService.confirmSignUp(confirmSignUpDto);
    }
    async resendConfirmation(body) {
        return this.cognitoService.resendConfirmation(body.email);
    }
    async forgotPassword(body) {
        return this.cognitoService.forgotPassword(body.email);
    }
    async confirmForgotPassword(body) {
        return this.cognitoService.confirmForgotPassword(body.email, body.code, body.newPassword);
    }
    async changePassword(body) {
        return this.cognitoService.changePassword(body.accessToken, body.oldPassword, body.newPassword);
    }
    async getUser(email) {
        return this.cognitoService.getUser(email);
    }
    async updateUser(email, updateUserDto) {
        return this.cognitoService.updateUser(email, updateUserDto);
    }
    async deleteUser(email) {
        return this.cognitoService.deleteUser(email);
    }
    async refreshToken(body) {
        return this.cognitoService.refreshToken(body.refreshToken);
    }
    async signOut(body) {
        return this.cognitoService.signOut(body.accessToken);
    }
};
exports.CognitoController = CognitoController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.SignInDto]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('confirm-signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ConfirmSignUpDto]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "confirmSignUp", null);
__decorate([
    (0, common_1.Post)('resend-confirmation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "resendConfirmation", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('confirm-forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "confirmForgotPassword", null);
__decorate([
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('user/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "getUser", null);
__decorate([
    (0, common_1.Put)('user/:email'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('user/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('signout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "signOut", null);
exports.CognitoController = CognitoController = __decorate([
    (0, common_1.Controller)('cognito'),
    __metadata("design:paramtypes", [cognito_service_1.CognitoService])
], CognitoController);
//# sourceMappingURL=cognito.controller.js.map