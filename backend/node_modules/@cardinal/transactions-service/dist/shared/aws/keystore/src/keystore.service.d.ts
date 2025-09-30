export declare class KeystoreService {
    private readonly region;
    private readonly kmsClient;
    private readonly secretsClient;
    constructor(region?: string);
    encryptData(keyId: string, plaintext: string): Promise<string>;
    decryptData(ciphertext: string): Promise<string>;
    generateDataKey(keyId: string): Promise<{
        plaintext: string;
        ciphertext: string;
    }>;
    getSecret(secretName: string): Promise<string>;
    createSecret(secretName: string, secretValue: string, description?: string): Promise<string>;
    updateSecret(secretName: string, secretValue: string): Promise<string>;
    getSecretAsJson<T = any>(secretName: string): Promise<T>;
    encryptAndStoreSecret(secretName: string, plaintext: string, keyId: string): Promise<string>;
    getAndDecryptSecret(secretName: string, keyId: string): Promise<string>;
}
