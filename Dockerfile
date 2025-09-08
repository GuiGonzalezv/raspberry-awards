# ---------- STAGE 1: build ----------
FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ---------- STAGE 2: runtime ----------
FROM node:20-slim

RUN useradd --user-group --create-home --shell /bin/false app

WORKDIR /home/app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json tsconfig.json ./

COPY src/data ./dist/data

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

RUN chown -R app:app /home/app

USER app

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Comando de inicialização
CMD ["npm", "run", "start"]
