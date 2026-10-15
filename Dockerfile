# Stage 1: Base & Dependencies
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY .yalc ./.yalc
RUN npm ci

# Stage 2: Local Development (Hot-Reloading Vite Server)
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Stage 3: Production Static Build
FROM base AS builder
COPY . .
RUN npm run build

# Stage 4: Production Nginx SPA Server
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
