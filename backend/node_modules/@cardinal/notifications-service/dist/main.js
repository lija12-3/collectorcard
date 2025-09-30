"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const notification_service_module_1 = require("./notification-service.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(notification_service_module_1.NotificationServiceModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const port = process.env.PORT || 3003;
    await app.listen(port);
    console.log(`Notification service is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map