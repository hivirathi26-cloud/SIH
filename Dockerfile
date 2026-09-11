# Production Dockerfile for JSICP Full-Stack Platform
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY services/backend-server/package*.json ./services/backend-server/

# Install dependencies
RUN npm ci || npm install

# Copy entire source code
COPY . .

# Build React frontend
RUN npm run build

# Production Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app ./

EXPOSE 4000

CMD ["node", "services/backend-server/server.js"]
