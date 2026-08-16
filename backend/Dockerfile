FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./
COPY backend/package.json backend/
COPY lib/db/package.json lib/db/
COPY lib/api-zod/package.json lib/api-zod/

COPY lib/db lib/db
COPY lib/api-zod lib/api-zod
COPY backend backend

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/backend build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/index.js"]
