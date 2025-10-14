import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionProvider {
  private readonly logger = new Logger(EncryptionProvider.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly tagLength = 16;

  constructor() {
    // In production, get this from environment variables or secure key management
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateKey();
  }

  private encryptionKey: string;

  private generateKey(): string {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }

  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      // Combine iv, tag, and encrypted data
      const result =
        iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;

      this.logger.debug('Data encrypted successfully');
      return result;
    } catch (error) {
      this.logger.error('Encryption failed', error);
      throw new Error('Encryption failed');
    }
  }

  decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const tag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipher(
        this.algorithm,
        this.encryptionKey,
      );
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      this.logger.debug('Data decrypted successfully');
      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed', error);
      throw new Error('Decryption failed');
    }
  }

  hash(text: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(text, actualSalt, 10000, 64, 'sha512');
    return `${actualSalt}:${hash.toString('hex')}`;
  }

  verifyHash(text: string, hashedText: string): boolean {
    try {
      const [salt, hash] = hashedText.split(':');
      const hashToVerify = crypto.pbkdf2Sync(text, salt, 10000, 64, 'sha512');
      return hash === hashToVerify.toString('hex');
    } catch (error) {
      this.logger.error('Hash verification failed', error);
      return false;
    }
  }

  generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
