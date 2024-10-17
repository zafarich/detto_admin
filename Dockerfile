# build stage
FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

# production stage

FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist/spa/* /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


