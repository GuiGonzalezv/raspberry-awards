# 📽️ Golden Raspberry Awards API

API RESTful desenvolvida em **Node.js + TypeScript**, com **Express** e **SQLite (in-memory)**, para leitura e consulta da lista de indicados e vencedores da categoria **Pior Filme** do Golden Raspberry Awards.

Escolhi construir a api utilizando **Arquitetura Hexagonal (Ports and Adapters)** visando uma estruturação mais facil para evolução de projeto.

A aplicação carrega um **arquivo CSV** no banco de dados em memória e disponibiliza endpoints para:

- 📊 Obter o produtor com maior intervalo entre prêmios consecutivos
- 📊 Obter o produtor que ganhou dois prêmios em menor intervalo de tempo
- 🎬 Consultar filmes com filtros opcionais (ano, produtor, vencedor)

---

## 🚀 Tecnologias

- Node.js + TypeScript
- Express
- SQLite (in-memory)
- Jest para testes de integração
- Swagger para documentação
- tsyringe para Dependency Injection (DI)

---

## ⚡ Performance

Existe um script em python que fiz para gerar csv de teste, fiz testes com 1 milhão de linhas e 10 milhões, ele está na raiz do projeto.

- Testado com **10 milhões de linhas** no CSV.
- Tempo de carga: **~4 minutos**.
- Queries principais: **~7 segundos**.
- Otimizações futuras podem reduzir ainda mais esses tempos.
  ( Considerando que estava rodando na minha maquina pessoal, podem ter diferenças dependendo da maquina, não limitei cpu e ram no dockerfile. )

---

## 🛠️ Como rodar localmente

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-repo/raspberry-awards.git
cd raspberry-awards

# 2. Instale as dependências
npm install

# 3. Compile o projeto
npm run build

# 4. Rode a aplicação
npm start
```

A API estará disponível em:  
👉 [http://localhost:3000](http://localhost:3000)  
Swagger: 👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🧪 Testes de integração

Rodar com Jest e Supertest:

```bash
npm run test
```

---

## 🐳 Rodando com Docker

### Build da imagem

```bash
docker build -t raspberry-awards .
```

### Rodar o container

```bash
docker run -p 3000:3000 raspberry-awards
```

A API ficará disponível em:  
👉 [http://localhost:3000](http://localhost:3000)

Com healthcheck em:  
👉 [http://localhost:3000/health](http://localhost:3000/health)

---

## 📖 Documentação

Swagger UI:  
👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---
