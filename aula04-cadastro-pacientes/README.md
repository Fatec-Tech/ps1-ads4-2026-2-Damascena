# Aula 04 — Express e CRUD Completo (Cadastro de Pacientes)

Atividade de **Programação de Scripts I — Backend**, construída a partir da Aula 03 sem alterar os arquivos anteriores. Implementação com **Node.js, Express, CORS e Fetch API**, com os dados em memória.

## Estrutura

```text
aula04-cadastro-pacientes/
├── backend/
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   └── tests/api.test.js
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── issues/
    ├── item-8-exercicios.md
    └── item-11-perguntas.md
```

## Executar localmente

1. Abra terminal em `aula04-cadastro-pacientes/backend`.
2. Execute `npm install` e depois `npm start`.
3. Confirme `http://localhost:3000/pacientes` e `http://localhost:3000/pacientes/total`.
4. No `frontend/js/app.js`, use temporariamente `http://localhost:3000/pacientes` em `URL_API` e abra o `frontend/index.html` pelo Live Server do VS Code.
5. Para verificar automaticamente os endpoints, rode `npm test` na pasta `backend/`. Os testes usam apenas Node.js e as dependências normais da aplicação.

## Endpoints e status

| Método | Endpoint | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/pacientes` | Lista todos | 200 | — |
| GET | `/pacientes?nome=ana` | Filtra por nome | 200 | — |
| GET | `/pacientes/total` | Conta pacientes | 200 | — |
| GET | `/pacientes/:id` | Busca por ID | 200 | 404 |
| POST | `/pacientes` | Cadastra | 201 | 400, 409 |
| PUT | `/pacientes/:id` | Atualiza | 200 | 400, 404, 409 |
| DELETE | `/pacientes/:id` | Remove | 204 | 404 |

A rota `/pacientes/total` é declarada antes de `/pacientes/:id`. A validação de e-mail repetido ignora maiúsculas/minúsculas.

## Exemplos de testes (terminal Bash)

```bash
curl http://localhost:3000/pacientes
curl http://localhost:3000/pacientes/total
curl 'http://localhost:3000/pacientes?nome=ana'
curl -i -X POST http://localhost:3000/pacientes -H 'Content-Type: application/json' -d '{}'
curl -i -X DELETE http://localhost:3000/pacientes/999
curl -i -X POST http://localhost:3000/pacientes -H 'Content-Type: application/json' -d '{"nome":"Carlos Lima","email":"carlos@email.com","nascimento":"1995-02-20"}'
curl -i -X PUT http://localhost:3000/pacientes/4 -H 'Content-Type: application/json' -d '{"nome":"Carlos Lima Jr.","email":"carlos@email.com","nascimento":"1995-02-20"}'
curl -i -X DELETE http://localhost:3000/pacientes/4
```

## Deploy no Render

O PDF de entrega **exige dois serviços com nomes padronizados**:

- **Web Service:** `api-clinica-damascena` (ou outro identificador próprio com prefixo `api-clinica-`). Branch `main`, Root Directory `aula04-cadastro-pacientes/backend`, Build `npm install`, Start `npm start`, instância Free quando disponível.
- **Static Site:** `app-clinica-damascena` (com prefixo `app-clinica-`). Branch `main`, Root Directory `aula04-cadastro-pacientes/frontend`, Build Command vazio e Publish Directory `.`.

**Atenção:** a constante `URL_API` em `frontend/js/app.js` está configurada com a URL do backend antigo da Aula 03, `https://api-pacientes-damascena.onrender.com/pacientes`, apenas como ponto de partida. **Antes de publicar este frontend**, altere-a para a URL real do **novo** Web Service da Aula 04 e faça commit. Se mudar o nome do serviço, a URL também pode mudar.

**Na entrega, enviar três links:** (1) pasta da Aula 04 no GitHub, (2) endpoint `/pacientes` do novo backend no Render e (3) frontend novo no Render.

**Issues:** criar **duas issues separadas** no GitHub: item 8 (exercícios) e item 11 (perguntas da aula). Os arquivos em `issues/` trazem os textos prontos para colar.

> Os dados são fictícios. A API não tem autenticação nem banco de dados; alterações se perdem ao reiniciar o serviço. Não cadastrar informações reais.
