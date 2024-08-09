# Loomi ecomerce-api

Esta API faz parte do desafio da Loomi para construir uma API REST de e-commerce.

## Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **TypeScript**
- **Prisma**
- **Swagger**
- **AWS S3**

## Práticas Adotadas

- **Princípios SOLID**
- **Clean Code**
- **ESLint**

## Funcionalidades

## Funcionalidades

- **API RESTful**: Implementa os princípios RESTful para fornecer uma interface intuitiva e escalável para interação com os recursos do sistema. Utiliza métodos HTTP padrão para operações CRUD e manipulação de dados.

- **Consultas e Gerenciamento de Dados com Prisma**: Utiliza o Prisma como ORM para consultas eficientes e gerenciamento robusto do banco de dados. Permite uma comunicação direta e segura com o banco de dados, facilitando operações complexas e manutenção de dados.

- **Injeção de Dependência**: Adota princípios de injeção de dependência para promover uma arquitetura modular e desacoplada. Facilita a substituição e teste de componentes individuais, melhorando a manutenção e escalabilidade do código.

- **Tratamento de Erros Estruturado**: Implementa um sistema de tratamento de erros robusto e estruturado. Fornece respostas de erro informativas e padronizadas, melhorando a experiência do desenvolvedor e a depuração de problemas.

- **Documentação Swagger Automática**: A documentação da API é gerada e atualizada automaticamente usando o módulo Swagger do NestJS. Proporciona uma interface Swagger UI acessível para explorar e testar os endpoints da API de forma interativa.

- **Autenticação e Autorização**: Implementa mecanismos de autenticação e autorização para proteger recursos e garantir que apenas usuários autorizados possam acessar funcionalidades específicas. Suporta autenticação básica, JWT, ou outras abordagens conforme necessário.

- **Validação e Transformação de Dados**: Utiliza validação e transformação de dados para garantir a integridade e conformidade das entradas da API. Aplica regras de validação em DTOs para garantir que os dados recebidos atendem aos critérios esperados.

- **Testes Automatizados**: Inclui testes automatizados para garantir que a aplicação funcione conforme esperado e que novas alterações não introduzam regressões. Utiliza frameworks de teste como Jest para realizar testes unitários e de integração.

- **Internacionalização e Localização**: Suporta múltiplos idiomas e formatos regionais para fornecer uma experiência personalizada para usuários de diferentes localidades. Permite a tradução de mensagens e formatos conforme as configurações regionais.

- **Mecanismos de Cache**: Implementa estratégias de cache para melhorar o desempenho e reduzir a carga no servidor e no banco de dados. Utiliza mecanismos de cache em memória ou de terceiros para otimizar a resposta das solicitações.

- **Logs e Monitoramento**: Oferece funcionalidades de logging e monitoramento para rastrear a saúde e o desempenho da aplicação. Utiliza ferramentas e práticas de logging para coletar e analisar informações sobre o funcionamento da aplicação e detectar problemas.

- **Gerenciamento de Configurações**: Utiliza um sistema centralizado de gerenciamento de configurações para ajustar parâmetros de aplicação e ambiente. Permite a configuração de variáveis de ambiente e outras propriedades necessárias para a operação da aplicação.


## Como Executar o BACK-END

1. _Clone Git Repository_
   bash
   git clone <URL_repository>

2. _Instale as Dependências_
   npm install

3. _Crie o Banco de Dados_
   npx prisma migrate dev

4. _Create first user administrator to use the application_
   npm run prisma:admin

5. _Crie o Primeiro Usuário Administrador_
   npm run start

## Acesso à Documentação
- ** Para acessar a documentação dos endpoints da API, abra o navegador e visite o seguinte URL com a aplicação rodando:

- **Documentação Swagger: http://localhost:3000/ecommerce-api
