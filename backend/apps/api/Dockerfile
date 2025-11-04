FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

# Copy dependency files from backend root
COPY ../../package*.json ./

# Install dependencies (omit dev to keep image lighter)
RUN npm ci --omit=dev

# Copy required source and configs
COPY ../../tsconfig*.json ./
COPY ../../apps ./apps

# Build the API app
RUN npx tsc -p apps/api/tsconfig.json

# Set production environment
ENV NODE_ENV=production

# Expose API port
EXPOSE 3000

# Start the compiled app
CMD ["node", "dist/apps/api/src/main.js"]

