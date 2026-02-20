FROM node:18-alpine

RUN addgroup -S app && adduser -S app -G app

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

RUN apk add --no-cache curl

COPY . .

ENV NODE_ENV=production
ENV PORT=3004

USER app

EXPOSE 3004

CMD ["node", "app.js"]
