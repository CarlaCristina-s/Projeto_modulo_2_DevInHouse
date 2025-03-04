# 🚀 TECFARMA - Sistema Logístico de Produtos Farmacêuticos


📌 Sobre o Projeto

A TECFARMA é um sistema desenvolvido para otimizar a gestão das movimentações de produtos entre as filiais de uma organização. A solução permite o gerenciamento eficiente de usuários, produtos e movimentações, garantindo maior controle e rastreabilidade dos processos logísticos.

🚀 Tecnologias Utilizadas

O backend da TECFARMA foi desenvolvido utilizando as seguintes tecnologias:

- Node.js - Ambiente de execução JavaScript no servidor

- TypeScript - Superset do JavaScript que adiciona tipagem estática para maior confiabilidade

- Express - Framework minimalista para criação de APIs

- TypeORM - ORM para modelagem e manipulação do banco de dados

- PostgreSQL - Banco de dados relacional robusto e escalável

- JWT - Integração entre usuários e servidor de forma segura

🎯 Funcionalidades Implementadas

A API RESTful do TECFARMA possui as seguintes rotas:

🔹 Login

- [POST] /login - Login de usuário

🔹 Usuários

- [POST] /users - Cadastro de usuário

- [GET] /users - Listagem de todos os usuários

- [GET] /users/:id - Busca de usuário por ID

- [PUT] /users/:id - Atualização de dados do usuário

- [PATCH] /users/:id/status - Atualização do status do usuário

🔹 Produtos

- [POST] /products - Cadastro de produto

- [GET] /products - Listagem de produtos

🔹 Movimentações

- [POST] /movements - Cadastro de movimentação (Filial)

- [GET] /movements - Listagem de movimentações

- [PATCH] /movements/:id/start - Inicializa uma entrega

- [PATCH] /movements/:id/end - Finaliza uma entrega 

🔹 Motoristas

- [GET] /drivers/topPerformers - Listagem dos dez motoristas com mais entregas finalizadas

- [GET] /drivers/worstPerformers - Listagem dos dez motoristas com menos entregas finalizadas

🛠 Como Executar o Projeto

📌 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js

- PostgreSQL

- Git

🔧 Passos para rodar o projeto

1. Clone o repositório:

git clone https://github.com/CarlaCristina-s/Projeto_modulo_2_DevInHouse.git

cd projeto_modulo_2

2. Instale as dependências:

npm install

3. Configure as variáveis de ambiente: Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:

- DB_HOST: Host do banco de dados
- DB_PORT: Porta do banco de dados
- DB_USERNAME: Usuário do banco de dados
- DB_PASSWORD: Senha do banco de dados
- DB_NAME: Nome do banco de dados
- NODE_ENV: Ambiente de desenvolvimento
- PORT: Porta do projeto
- JWT_SECRET: Chave secreta para o token JWT
- SALT_BCRYPT: Salt rounds

⚡ Exemplo de arquivo `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=senha1234
DB_NAME=tecfarma
NODE_ENV=development
PORT=3000
JWT_SECRET=sua_chave_secreta
SALT_BCRYPT=10
```

4. Execute as migrações do banco de dados:

npm run migration:run

5. Inicie o servidor:

npm run start

A API estará disponível em http://localhost:3000

📈 Melhorias Futuras

Algumas melhorias que podem ser implementadas nas próximas versões:

📌 Dashboard para monitoramento de movimentações em tempo real

📌 Testes automatizados para garantir a confiabilidade da API

📌 Middleware dinâmico para verificação de role

📄 Licença

Este projeto está sob a licença MIT.



---
Desenvolvido com ❤️ por **Carla Cristina de Souza**  
🔗 [LinkedIn](https://www.linkedin.com/in/carlacrissouza/) | 📂 [GitHub](https://github.com/CarlaCristina-s/)
