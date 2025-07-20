FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache wget netcat-openbsd

COPY package*.json ./

RUN npm ci --only=production

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker-entrypoint.sh"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1