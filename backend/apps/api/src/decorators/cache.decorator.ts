import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cache';
export const CACHE_TTL_KEY = 'cacheTtl';

export const Cache = (ttl: number = 300000) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY, true)(target, propertyKey, descriptor);
    SetMetadata(CACHE_TTL_KEY, ttl)(target, propertyKey, descriptor);
    return descriptor;
  };
};
