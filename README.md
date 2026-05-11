<div align="center">

# CourseSphere

Plataforma full stack para organizar cursos online e aulas

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

CourseSphere é uma aplicação para organizar cursos online, aulas e rascunhos em um só lugar. A proposta é dar ao instrutor uma área limpa para criar cursos, acompanhar conteúdos publicados e manter a rotina de ensino mais organizada.

**Deploy:** https://coursesphere-fullstack.vercel.app

## Telas

![Página inicial](docs/screenshots/home.png)

![Área de trabalho](docs/screenshots/dashboard.png)

![Detalhes do curso](docs/screenshots/course-detail.png)

![Login](docs/screenshots/login.png)

## Funcionalidades

- cadastro, login e logout;
- sessão com cookie HTTP-only;
- cursos com criação, busca, edição e exclusão;
- aulas com criação, edição, exclusão e filtro por status;
- proteção para cada usuário acessar apenas os próprios cursos;
- sugestão de instrutor convidado a partir de uma API externa.

## Como rodar o projeto

O CourseSphere usa Next.js. As telas ficam em `src/app` e as rotas de API ficam em `src/app/api`, então frontend e backend rodam no mesmo servidor de desenvolvimento.

### 1. Dependências

```bash
npm install
```

### 2. Ambiente

```bash
cp .env.example .env
```

O arquivo de exemplo já aponta para o banco SQLite local:

```txt
DATABASE_URL="file:./dev.db"
```

### 3. Backend

Prepare o Prisma, crie o banco e rode o seed:

```bash
npm run prisma:generate
npm run db:setup
```

Depois disso, as rotas de API ficam disponíveis em `/api`.

### 4. Frontend

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

## Usuário de teste

O seed cria este usuário:

```txt
E-mail: teste@coursesphere.com
Senha: 123456
```

Também existe fluxo completo de cadastro pela tela `/cadastro`.

## Deploy

Frontend e backend estão publicados juntos na Vercel:

```txt
https://coursesphere-fullstack.vercel.app
```

Para testar o deploy, use o mesmo usuário:

```txt
E-mail: teste@coursesphere.com
Senha: 123456
```

## Docker

Não há configuração Docker neste projeto. A execução local é feita diretamente com Node.js, Prisma e Next.js.

## Testes

O projeto tem testes e2e com Playwright e cenários BDD escritos em Gherkin/Cucumber.

```bash
npm run test:e2e
npm run test:bdd
```

Para conferir apenas se os cenários BDD estão conectados aos steps, sem abrir o navegador:

```bash
npm run test:bdd:dry
```

## Comandos úteis

```bash
npm run dev
npm run build
npm run lint
npm run test:e2e
npm run test:bdd
npm run test:bdd:dry
npm run db:setup
```

## Stack

Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite, TanStack Query, Zustand, Zod, React Hook Form, Playwright e Cucumber.

## Banco de dados

O SQLite foi usado para deixar a avaliação e a execução local mais simples. Em um cenário de produção real, a próxima etapa seria trocar para PostgreSQL ou outro banco persistente gerenciado.

## Autor

<div align="center">

Geozedeque Guimarães — Estudante de Ciência da Computação, CIn-UFPE

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/GeozedequeGuimaraes)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/geozedeque-guimaraes)

</div>
