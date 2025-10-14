import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EncryptionProvider } from '../providers';

export const Encrypt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const encryptionProvider = new EncryptionProvider();

    // Get the property to encrypt from the request body
    const property = data as string;
    const value = request.body[property];

    if (value && typeof value === 'string') {
      return encryptionProvider.encrypt(value);
    }

    return value;
  },
);
