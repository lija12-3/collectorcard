"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const notification_service_module_1 = require("./notification-service.module");
const common_1 = require("@nestjs/common");
const aws_serverless_express_1 = require("aws-serverless-express");
const middleware_1 = require("aws-serverless-express/middleware");
const express = require("express");
let cachedServer;
async function createExpressApp() {
    if (!cachedServer) {
        const expressApp = express();
        const nestApp = await core_1.NestFactory.create(notification_service_module_1.NotificationServiceModule, new platform_express_1.ExpressAdapter(expressApp));
        nestApp.use((0, middleware_1.eventContext)());
        nestApp.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        nestApp.enableCors();
        await nestApp.init();
        cachedServer = (0, aws_serverless_express_1.createServer)(expressApp);
    }
    return cachedServer;
}
const handler = async (event, context, callback) => {
    const server = await createExpressApp();
    return (0, aws_serverless_express_1.proxy)(server, event, context, 'PROMISE').promise;
};
exports.handler = handler;
//# sourceMappingURL=main.lambda.js.map