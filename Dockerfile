FROM node:22-alpine

WORKDIR /app

# Install dependencies first for Docker caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy remaining source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
