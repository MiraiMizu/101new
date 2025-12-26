FROM node:18-alpine as build

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

COPY client .
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
