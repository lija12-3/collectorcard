"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const payment_service_module_1 = require("./payment-service.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(payment_service_module_1.PaymentServiceModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`Payment service is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map