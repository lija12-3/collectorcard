FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .

RUN npx tsc -p tsconfig.json

ENV NODE_ENV=production
EXPOSE 3000


CMD ["node", "dist/apps/api/src/main.js"]



