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

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pm2

COPY package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma

RUN npm install --omit=dev

EXPOSE 3333

CMD ["pm2-runtime", "start", "npm", "--", "start"]
