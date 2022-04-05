FROM node:17-alpine as base

ENV NODE_ENV=production
ENV husky_skip_init="1"
ENV HUSKY_DEBUG="1"
ENV NODE_OPTIONS="--max_old_space_size=4000 --openssl-legacy-provider"

WORKDIR /app

FROM base as builder

RUN apk add --no-cache curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN echo "yarn cache clean --force && node-prune" > /usr/local/bin/node-clean && chmod +x /usr/local/bin/node-clean

COPY package.json yarn.lock ./

RUN yarn --production=false --frozen-lockfile

COPY ./ ./
RUN yarn build
RUN yarn --production=true --frozen-lockfile
RUN /usr/local/bin/node-clean


FROM nginx:alpine

WORKDIR /app

COPY nginx.conf /etc/nginx/.
COPY dist/*.* /app/.

RUN ls -1la

CMD ["nginx"]
