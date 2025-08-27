# Etapa 1: build
FROM node:18 AS builder
WORKDIR /app

# Copiar pacotes e instalar dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar o restante do código
COPY . .
RUN npm run build

# Etapa 2: produção
FROM node:18
WORKDIR /app

# Copiar apenas os artefatos de produção
COPY --from=builder /app ./

EXPOSE 8080

# Start no Cloud Run (porta 8080 obrigatória)
CMD ["npm", "start"]
