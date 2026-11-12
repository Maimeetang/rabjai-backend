# --- Stage 1: Base ---
FROM ghcr.io/pnpm/pnpm:12 AS base
RUN pnpm runtime set node 24 -g

WORKDIR /app

# --- Stage 2: Build ---
FROM base AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm install --store-dir /var/cache/pnpm --frozen-lockfile

COPY . .
RUN pnpm run build

RUN pnpm deploy --prod /prod

# --- Stage 3: Production ---
FROM base AS production

ENV NODE_ENV=production

COPY --from=build /prod/package.json ./
COPY --from=build /prod/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER nobody

EXPOSE 3000

CMD [ "node", "dist/main" ]
