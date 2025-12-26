FROM node:18-alpine

WORKDIR /app

# Copy shared package
COPY shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

# Copy server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install

COPY server .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
