FROM node:20-alpine AS build

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build:ts

FROM node:20-alpine AS production

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

USER node

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD npm run start:prod