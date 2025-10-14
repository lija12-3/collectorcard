import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EncryptionProvider } from '../providers';

export const Decrypt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const encryptionProvider = new EncryptionProvider();

    // Get the property to decrypt from the request body
    const property = data as string;
    const value = request.body[property];

    if (value && typeof value === 'string') {
      try {
        return encryptionProvider.decrypt(value);
      } catch (error) {
        // Return original value if decryption fails
        return value;
      }
    }

    return value;
  },
);
