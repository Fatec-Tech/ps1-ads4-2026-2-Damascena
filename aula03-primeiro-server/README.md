# Aula 03 - Primeiro Backend (Cadastro de Pacientes)

Atividade 06 de Programação de Scripts: backend em Node.js com módulo nativo `http`, integrado a um frontend HTML/Bootstrap via `fetch`.

## Executar localmente

1. Em um terminal na pasta `aula03-primeiro-server/backend`, execute `npm start`.
2. Confira `http://localhost:3000/pacientes` (4 pacientes em JSON).
3. Confira `http://localhost:3000/pacientes/total` (`{"total":4}`).
4. Abra `frontend/index.html` pelo **Live Server** do VS Code. A tabela deve exibir os 4 pacientes da API.
5. Exercício de erro: pressione `Ctrl+C` no terminal do backend e atualize o frontend. Deve aparecer: **Erro ao carregar pacientes. O servidor está rodando?**. Reinicie `npm start` depois.

## Exercícios práticos

- **Rota GET /pacientes/total:** implementada; retorna a contagem atual de pacientes (`4` após o exercício 2, originalmente `3`).
- **Quarto paciente:** Lucas Almeida, cadastrado apenas no array do `server.js`.
- **Simulação de falha:** mensagem amigável implementada no `catch` do frontend; realizar o teste desligando o backend localmente.
- **Issue:** criar issue no GitHub com descrição dos três exercícios; pode ser aberta antes ou depois da implementação.

> Observação: o formulário do frontend adiciona pacientes somente na página, porque a atividade ainda não pede POST/persistência no backend.

## Deploy no Render (backend + frontend separados)

**Web Service (backend):**

- Repositório `Fatec-Tech/ps1-ads4-2026-2-Damascena`, branch `main`.
- Root Directory: `aula03-primeiro-server/backend`.
- Language/Runtime: `Node`.
- Build Command: `npm install`.
- Start Command: `npm start`.
- Instance Type: `Free` (se disponível).
- O código usa automaticamente `process.env.PORT` para funcionar no Render.

Após obter a URL pública do Web Service, abra `frontend/js/app.js` e substitua:

```js
const URL_API = 'http://localhost:3000/pacientes';
```

por, por exemplo:

```js
const URL_API = 'https://SEU-BACKEND.onrender.com/pacientes';
```

Use a **URL real** obtida no Render; não use o exemplo literal. Faça novo commit/push dessa alteração.

**Static Site (frontend):**

- Repositório igual, branch `main`.
- Root Directory: `aula03-primeiro-server/frontend`.
- Build Command: deixe vazio.
- Publish Directory: `.` (ponto).
- Abra a URL pública fornecida pelo Render e confirme se os quatro pacientes aparecem.

O guia de deploy cita Express/CORS como exemplo, mas **a Atividade 06 manda usar o módulo nativo `http`**. O `server.js` usa esse módulo e libera CORS por cabeçalho, sem depender de pacotes externos.
