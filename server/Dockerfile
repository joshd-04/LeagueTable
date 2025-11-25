# Stage 1 – Build
FROM node:20-alpine AS build
WORKDIR /app


# Install only dependencies first
COPY package*.json ./
RUN npm install

# Now copy source code
COPY . .
RUN npm run build

# Stage 2 – Run
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

EXPOSE 8000
CMD ["node", "dist/index.js"]
