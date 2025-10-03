"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const aws_serverless_express_1 = require("aws-serverless-express");
const middleware_1 = require("aws-serverless-express/middleware");
const express = require("express");
let cachedServer;
async function createNestServer() {
    if (!cachedServer) {
        const expressApp = express();
        const nestApp = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        nestApp.use((0, middleware_1.eventContext)());
        nestApp.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }));
        await nestApp.init();
        cachedServer = (0, aws_serverless_express_1.createServer)(expressApp);
    }
    return cachedServer;
}
const lambdaHandler = async (event, context) => {
    const server = await createNestServer();
    return (0, aws_serverless_express_1.proxy)(server, event, context, 'PROMISE').promise;
};
exports.lambdaHandler = lambdaHandler;
//# sourceMappingURL=main.js.map