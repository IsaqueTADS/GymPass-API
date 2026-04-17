# Builder stage
FROM node:24-slim AS builder

WORKDIR /app

COPY package-lock.json package.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="faker"

RUN npx prisma generate

RUN npm run build

# Production stage
FROM node:24-slim AS runner

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pm2

COPY package.json ./

RUN mkdir -p prisma
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

COPY --from=builder /app/build ./build
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/docker ./docker

RUN npm install --omit=dev

EXPOSE 3333

CMD ["pm2-runtime", "start", "docker/api/pm2/pm2-production.json"]
