# syntax=docker/dockerfile:1.7

# ==========================================
# Stage 1: Build Angular 22 application
# ==========================================
FROM node:22-alpine AS builder

ENV NODE_OPTIONS=--max-old-space-size=8192

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps \
    && npm cache clean --force

COPY . .

RUN npm run build

# ==========================================
# Stage 2: Serve with non-root Nginx
# ==========================================
FROM nginxinc/nginx-unprivileged:stable-alpine

USER root

RUN rm -rf /usr/share/nginx/html/* \
    && rm -f /etc/nginx/conf.d/default.conf

COPY --from=builder \
    --chown=nginx:nginx \
    /app/build/default.conf \
    /etc/nginx/conf.d/default.conf

COPY --from=builder \
    --chown=nginx:nginx \
    /app/dist/ \
    /usr/share/nginx/html/

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
