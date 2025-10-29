FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY apps/api ./apps/api
COPY tsconfig.json ./tsconfig.json

RUN npx tsc -p tsconfig.json

ENV NODE_ENV=production
EXPOSE 3000

# ✅ Run from where TypeScript actually outputs JS
CMD ["node", "dist/main.js"]
