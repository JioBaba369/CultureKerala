# Development
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["npm", "start"]