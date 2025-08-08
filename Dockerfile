# Base development image
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# API development image
FROM base AS api
WORKDIR /app
COPY . .
EXPOSE 3001
CMD ["npm", "run", "api:dev"]

# Frontend development image
FROM base AS frontend
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production build environment
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/build /app/build
COPY --from=build /app/api /app/api
EXPOSE 3000 3001
CMD ["npm", "run", "start"]