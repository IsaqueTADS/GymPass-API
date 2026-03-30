# GymPass API

API RESTful para sistema de check-ins em academias com geolocalização.

## Sobre o Projeto

API desenvolvida em Node.js com TypeScript que permite aos usuários realizar check-ins em academias próximas, com suporte a busca por localização, validação de check-ins por administradores e métricas pessoais de uso. O projeto segue princípios de **Clean Architecture** e **SOLID**, com uso de **Use Cases** para lógica de negócio e **Repository Pattern** para abstração de dados.

## Funcionalidades

- **Autenticação**: Registro, login e refresh de tokens JWT
- **Gestão de Usuários**: Perfil, avatar upload (Cloudinary)
- **Check-ins**: Criar, validar e consultar histórico de check-ins
- **Academias**: Criar, buscar por nome e encontrar academias próximas por geolocalização
- **Métricas**: Estatísticas pessoais de check-ins
- **Controle de Acesso**: Roles (ADMIN e MEMBER)

## Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| Linguagem | TypeScript |
| Runtime | Node.js |
| Framework | Fastify v5 |
| ORM | Prisma v7 |
| Banco de Dados | PostgreSQL |
| Validação | Zod |
| Autenticação | JWT + Cookies |
| Testes | Vitest |
| Linting | Biome |
| Build | tsup |
| Upload | Cloudinary |

## Arquitetura e Princípios

```
src/
├── dtos/           # Data Transfer Objects
├── env/            # Configuração de variáveis de ambiente
├── gateways/       # Integrações externas (Cloudinary)
├── http/
│   ├── controllers/  # Controllers Fastify
│   ├── middleware/  # Middlewares (JWT, Roles)
│   ├── routes/      # Definição de rotas
│   ├── schemas/     # Schemas Zod
│   └── utils/       # Utilitários
├── lib/            # Setup Prisma
├── repositories/   # Repository Pattern
│   ├── in-memory/   # Implementações em memória (testes)
│   └── prisma/     # Implementações Prisma
├── use-cases/      # Use Cases (Clean Architecture)
│   ├── errors/     # Erros customizados
│   └── factories/ # Factories para DI
└── utils/          # Funções utilitárias
```

**Padrões Aplicados:**
- Clean Architecture
- SOLID (Single Responsibility, Dependency Inversion)
- Repository Pattern
- Factory Pattern
- Use Cases
- TDD com testes unitários e E2E

## Requisitos Prévios

- Node.js 24.x
- PostgreSQL
- npm
- Conta no Cloudinary (para upload de avatars)

## Guia de Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd gympass
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Server
PORT=3333
NODE_ENV=dev
API_URL=http://localhost:3333

# Database
DATABASE_URL="postgresql://docker:docker@localhost:5432/gympass?schema=public"

# JWT
JWT_SECRET=your-secret-key-min-32-chars

# Cloudinary
CLOUDINARY_KEY=your-key
CLOUDINARY_SECRET=your-secret
CLOUDINARY_NAME=your-cloud-name

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 4. Inicie o banco de dados com Docker

```bash
docker compose up -d
```

O PostgreSQL estará disponível em `localhost:5432`.

### 5. Configure o banco de dados

```bash
# Gerar Prisma Client
npm run db:generate

# Executar migrations
npm run db:migrate

# (Opcional) Popular banco com dados iniciais
npm run db:seed
```

### 5. Inicie o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3333`

## Documentação da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/users` | Registrar novo usuário |
| `POST` | `/sessions` | Autenticar usuário |
| `PATCH` | `/token/refresh` | Atualizar token JWT |

### Usuário

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/me` | Obter perfil do usuário |
| `PATCH` | `/uploads` | Atualizar avatar |

### Academias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/gyms` | Criar academia (Admin) |
| `GET` | `/gyms/search` | Buscar academias por nome |
| `GET` | `/gyms/nearby` | Listar academias próximas |

### Check-ins

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/gyms/:gymId/check-ins` | Criar check-in |
| `PATCH` | `/check-ins/:checkInId/validade` | Validar check-in (Admin) |
| `GET` | `/check-ins/history` | Histórico de check-ins |
| `GET` | `/check-ins/metrics` | Métricas do usuário |

## Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `PORT` | Porta do servidor (padrão: 3333) | Não |
| `DATABASE_URL` | String de conexão PostgreSQL | Sim |
| `NODE_ENV` | Ambiente (dev, test, production) | Não |
| `API_URL` | URL base da API | Não |
| `JWT_SECRET` | Chave secreta para JWT | Sim |
| `CLOUDINARY_KEY` | Chave API Cloudinary | Sim |
| `CLOUDINARY_SECRET` | Segredo API Cloudinary | Sim |
| `CLOUDINARY_NAME` | Nome da conta Cloudinary | Sim |
| `FRONTEND_URL` | URL do frontend | Sim |

## Testes

```bash
# Executar testes unitários
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes E2E
npm run test:e2e

# Executar testes com coverage
npm run test:coverage

# Executar testes com UI
npm run test:ui
```

## Licença

MIT
