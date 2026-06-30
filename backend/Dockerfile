FROM node:20-alpine AS base

FROM base AS deps
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile

FROM base AS builder
RUN corepack enable pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY . .
WORKDIR /app/backend
# Generate Prisma Client if needed later
# RUN npx prisma generate
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/backend/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/backend/package.json ./

USER nestjs
EXPOSE 3001
ENV PORT 3001

CMD ["node", "dist/main.js"]
