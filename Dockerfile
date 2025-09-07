# ---------- STAGE 1: build ----------
# Usa a imagem oficial do Node para build (tem toolchain completa)
FROM node:20 AS builder

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json + package-lock.json (ou pnpm-lock.yaml/yarn.lock)
# para aproveitar cache do Docker durante instalações
COPY package*.json ./

# Instala dependências de build (dev + prod) rapidamente
RUN npm ci

# Copia todo o código fonte
COPY . .

# Build (assume que há um script "build" no package.json que transpila TypeScript para ./dist)
RUN npm run build

# ---------- STAGE 2: runtime ----------
# Imagem final mais enxuta (sem toolchain)
FROM node:20-slim

# Cria usuário não-root
RUN useradd --user-group --create-home --shell /bin/false app

WORKDIR /home/app

# Apenas variáveis de runtime
ENV NODE_ENV=production
ENV PORT=3000

# Copia apenas o package.json e package-lock para instalar deps de produção
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --omit=dev

# Copia arquivos construídos da stage anterior
COPY --from=builder /usr/src/app/dist ./dist

# (Opcional) se você precisa de arquivos estáticos ou templates:
# COPY --from=builder /usr/src/app/public ./public

# Ajusta dono dos arquivos para o usuário não-root
RUN chown -R app:app /home/app

# Muda para usuário não-root
USER app

# Exponha a porta
EXPOSE 3000

# Healthcheck (ajuste a URL/porta conforme sua rota de health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Comando de inicialização (assume script "start" que executa node dist/index.js)
CMD ["npm", "run", "start"]
