# Etapa 1: build
FROM node:18 AS builder
WORKDIR /app

# Copiar arquivos
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: produção
FROM node:18
WORKDIR /app

# Copiar apenas os artefatos de produção
COPY --from=builder /app ./

EXPOSE 8080

CMD ["npm", "start"]
