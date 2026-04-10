FROM node:24-slim AS builder


WORKDIR /app

COPY package-lock.json package.json ./


RUN npm ci


COPY . .

RUN npx prisma generate

RUN npm run build

WORKDIR /app


ENV NODE_ENV=production

COPY package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/generated/prisma  /app/src/generated/prisma


RUN npm install --omit=dev

EXPOSE 3333


CMD ["node", "build/server.js"]