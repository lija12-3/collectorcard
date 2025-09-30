export declare class EncryptionService {
    private readonly encryptionKey;
    private readonly algorithm;
    private readonly keyLength;
    private readonly ivLength;
    private readonly tagLength;
    constructor(encryptionKey: string);
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
    hashPassword(password: string): string;
    verifyPassword(password: string, hashedPassword: string): boolean;
    generateRandomString(length?: number): string;
}
