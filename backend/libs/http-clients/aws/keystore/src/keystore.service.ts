import { Injectable } from '@nestjs/common';
import {
  KMSClient,
  EncryptCommand,
  DecryptCommand,
  GenerateDataKeyCommand,
} from '@aws-sdk/client-kms';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager';

@Injectable()
export class KeystoreService {
  private readonly kmsClient: KMSClient;
  private readonly secretsClient: SecretsManagerClient;

  constructor(private readonly region: string = 'us-east-1') {
    this.kmsClient = new KMSClient({ region: this.region });
    this.secretsClient = new SecretsManagerClient({ region: this.region });
  }

  // KMS Methods
  async encryptData(keyId: string, plaintext: string): Promise<string> {
    try {
      const command = new EncryptCommand({
        KeyId: keyId,
        Plaintext: Buffer.from(plaintext, 'utf8'),
      });

      const result = await this.kmsClient.send(command);
      return Buffer.from(result.CiphertextBlob || new Uint8Array()).toString(
        'base64',
      );
    } catch (error) {
      throw new Error(`Failed to encrypt data with KMS: ${error.message}`);
    }
  }

  async decryptData(ciphertext: string): Promise<string> {
    try {
      const command = new DecryptCommand({
        CiphertextBlob: Buffer.from(ciphertext, 'base64'),
      });

      const result = await this.kmsClient.send(command);
      return Buffer.from(result.Plaintext || new Uint8Array()).toString('utf8');
    } catch (error) {
      throw new Error(`Failed to decrypt data with KMS: ${error.message}`);
    }
  }

  async generateDataKey(keyId: string): Promise<{
    plaintext: string;
    ciphertext: string;
  }> {
    try {
      const command = new GenerateDataKeyCommand({
        KeyId: keyId,
        KeySpec: 'AES_256',
      });

      const result = await this.kmsClient.send(command);
      return {
        plaintext: Buffer.from(result.Plaintext || new Uint8Array()).toString(
          'base64',
        ),
        ciphertext: Buffer.from(
          result.CiphertextBlob || new Uint8Array(),
        ).toString('base64'),
      };
    } catch (error) {
      throw new Error(`Failed to generate data key: ${error.message}`);
    }
  }

  // Secrets Manager Methods
  async getSecret(secretName: string): Promise<string> {
    try {
      const command = new GetSecretValueCommand({
        SecretId: secretName,
      });

      const result = await this.secretsClient.send(command);
      return result.SecretString || '';
    } catch (error) {
      throw new Error(`Failed to get secret: ${error.message}`);
    }
  }

  async createSecret(
    secretName: string,
    secretValue: string,
    description?: string,
  ): Promise<string> {
    try {
      const command = new CreateSecretCommand({
        Name: secretName,
        SecretString: secretValue,
        Description: description,
      });

      const result = await this.secretsClient.send(command);
      return result.ARN || '';
    } catch (error) {
      throw new Error(`Failed to create secret: ${error.message}`);
    }
  }

  async updateSecret(secretName: string, secretValue: string): Promise<string> {
    try {
      const command = new UpdateSecretCommand({
        SecretId: secretName,
        SecretString: secretValue,
      });

      const result = await this.secretsClient.send(command);
      return result.ARN || '';
    } catch (error) {
      throw new Error(`Failed to update secret: ${error.message}`);
    }
  }

  async getSecretAsJson<T = any>(secretName: string): Promise<T> {
    try {
      const secretString = await this.getSecret(secretName);
      return JSON.parse(secretString);
    } catch (error) {
      throw new Error(`Failed to parse secret as JSON: ${error.message}`);
    }
  }

  // Utility Methods
  async encryptAndStoreSecret(
    secretName: string,
    plaintext: string,
    keyId: string,
  ): Promise<string> {
    try {
      const encryptedValue = await this.encryptData(keyId, plaintext);
      return await this.createSecret(secretName, encryptedValue);
    } catch (error) {
      throw new Error(`Failed to encrypt and store secret: ${error.message}`);
    }
  }

  async getAndDecryptSecret(
    secretName: string,
    _keyId: string,
  ): Promise<string> {
    try {
      const encryptedValue = await this.getSecret(secretName);
      return await this.decryptData(encryptedValue);
    } catch (error) {
      throw new Error(`Failed to get and decrypt secret: ${error.message}`);
    }
  }
}
