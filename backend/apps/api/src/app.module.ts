import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller'; // ✅ import added

@Module({
  controllers: [AuthController, HealthController], // ✅ include here
})
export class AppModule {}
