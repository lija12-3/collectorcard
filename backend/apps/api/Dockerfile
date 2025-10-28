FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i --omit=dev

COPY apps/api ./apps/api
COPY tsconfig.json ./tsconfig.json

RUN npx tsc -p apps/api/tsconfig.json

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
