

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Com o proxy do Nginx, o frontend faz chamadas para /iara/ (relativo à
# própria origem). Não depende mais de VITE_API_URL em build time.
# Se quiser sobrescrever (ex: outro domínio), defina VITE_API_URL no Railway.
ARG VITE_API_URL=/iara
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# ── Stage 2: Nginx ─────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove a config padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa config com o proxy
COPY nginx.conf /etc/nginx/conf.d/app.conf.template

# Copia os arquivos do build do Vue
COPY --from=builder /app/dist /usr/share/nginx/html

# Script de entrypoint: substitui BACKEND_PLACEHOLDER pela URL real do backend
# (definida em BACKEND_URL no Railway) e inicia o Nginx
RUN printf '#!/bin/sh\n\
BACKEND_URL="${BACKEND_URL:-http://localhost:3000}"\n\
sed "s|BACKEND_PLACEHOLDER|$BACKEND_URL|g" /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf\n\
echo "[startup] Proxy /iara/ → $BACKEND_URL"\n\
exec nginx -g "daemon off;"\n' > /docker-entrypoint-custom.sh \
&& chmod +x /docker-entrypoint-custom.sh

EXPOSE 8080

CMD ["/docker-entrypoint-custom.sh"]