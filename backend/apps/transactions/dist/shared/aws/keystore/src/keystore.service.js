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
exports.KeystoreService = void 0;
const common_1 = require("@nestjs/common");
const client_kms_1 = require("@aws-sdk/client-kms");
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
let KeystoreService = class KeystoreService {
    constructor(region = 'us-east-1') {
        this.region = region;
        this.kmsClient = new client_kms_1.KMSClient({ region: this.region });
        this.secretsClient = new client_secrets_manager_1.SecretsManagerClient({ region: this.region });
    }
    async encryptData(keyId, plaintext) {
        try {
            const command = new client_kms_1.EncryptCommand({
                KeyId: keyId,
                Plaintext: Buffer.from(plaintext, 'utf8'),
            });
            const result = await this.kmsClient.send(command);
            return Buffer.from(result.CiphertextBlob || new Uint8Array()).toString('base64');
        }
        catch (error) {
            throw new Error(`Failed to encrypt data with KMS: ${error.message}`);
        }
    }
    async decryptData(ciphertext) {
        try {
            const command = new client_kms_1.DecryptCommand({
                CiphertextBlob: Buffer.from(ciphertext, 'base64'),
            });
            const result = await this.kmsClient.send(command);
            return Buffer.from(result.Plaintext || new Uint8Array()).toString('utf8');
        }
        catch (error) {
            throw new Error(`Failed to decrypt data with KMS: ${error.message}`);
        }
    }
    async generateDataKey(keyId) {
        try {
            const command = new client_kms_1.GenerateDataKeyCommand({
                KeyId: keyId,
                KeySpec: 'AES_256',
            });
            const result = await this.kmsClient.send(command);
            return {
                plaintext: Buffer.from(result.Plaintext || new Uint8Array()).toString('base64'),
                ciphertext: Buffer.from(result.CiphertextBlob || new Uint8Array()).toString('base64'),
            };
        }
        catch (error) {
            throw new Error(`Failed to generate data key: ${error.message}`);
        }
    }
    async getSecret(secretName) {
        try {
            const command = new client_secrets_manager_1.GetSecretValueCommand({
                SecretId: secretName,
            });
            const result = await this.secretsClient.send(command);
            return result.SecretString || '';
        }
        catch (error) {
            throw new Error(`Failed to get secret: ${error.message}`);
        }
    }
    async createSecret(secretName, secretValue, description) {
        try {
            const command = new client_secrets_manager_1.CreateSecretCommand({
                Name: secretName,
                SecretString: secretValue,
                Description: description,
            });
            const result = await this.secretsClient.send(command);
            return result.ARN || '';
        }
        catch (error) {
            throw new Error(`Failed to create secret: ${error.message}`);
        }
    }
    async updateSecret(secretName, secretValue) {
        try {
            const command = new client_secrets_manager_1.UpdateSecretCommand({
                SecretId: secretName,
                SecretString: secretValue,
            });
            const result = await this.secretsClient.send(command);
            return result.ARN || '';
        }
        catch (error) {
            throw new Error(`Failed to update secret: ${error.message}`);
        }
    }
    async getSecretAsJson(secretName) {
        try {
            const secretString = await this.getSecret(secretName);
            return JSON.parse(secretString);
        }
        catch (error) {
            throw new Error(`Failed to parse secret as JSON: ${error.message}`);
        }
    }
    async encryptAndStoreSecret(secretName, plaintext, keyId) {
        try {
            const encryptedValue = await this.encryptData(keyId, plaintext);
            return await this.createSecret(secretName, encryptedValue);
        }
        catch (error) {
            throw new Error(`Failed to encrypt and store secret: ${error.message}`);
        }
    }
    async getAndDecryptSecret(secretName, keyId) {
        try {
            const encryptedValue = await this.getSecret(secretName);
            return await this.decryptData(encryptedValue);
        }
        catch (error) {
            throw new Error(`Failed to get and decrypt secret: ${error.message}`);
        }
    }
};
exports.KeystoreService = KeystoreService;
exports.KeystoreService = KeystoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], KeystoreService);
//# sourceMappingURL=keystore.service.js.map