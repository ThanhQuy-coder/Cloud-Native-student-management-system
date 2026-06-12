# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first to leverage caching.
COPY package.json package-lock.json* ./
RUN npm install

# Copy project files and build.
COPY tsconfig.json vite.config.ts postcss.config.mjs index.html ./
COPY src ./src
ARG VITE_API_BASE_URL=http://localhost:7000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
