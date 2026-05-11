FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/db/package.json packages/db/
COPY apps/backend/package.json apps/backend/
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules packages/shared/node_modules/
COPY --from=deps /app/packages/db/node_modules packages/db/node_modules/
COPY --from=deps /app/apps/backend/node_modules apps/backend/node_modules/
COPY . .
ENV SKIP_ENV_VALIDATION=true
RUN pnpm run build:shared-packages
RUN cd apps/backend && pnpm build

FROM base AS runtime
ENV NODE_ENV=production
ENV TZ=America/Lima
COPY --from=build /app /app
WORKDIR /app/apps/backend
EXPOSE 5001
CMD ["sh", "-c", "DB_MIGRATING=true node build/src/core/db/migrate.js && TZ=America/Lima node build/src/index.js"]
