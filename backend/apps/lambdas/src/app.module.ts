import { Module } from '@nestjs/common';
import { CognitoController } from './controllers/cognito.controller';
import { CognitoService } from './services/cognito.service';

@Module({
  imports: [],
  controllers: [CognitoController],
  providers: [CognitoService],
})
export class AppModule {}
