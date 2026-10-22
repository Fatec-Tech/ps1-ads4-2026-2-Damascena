const http = require('http');

// Lista de pacientes simulando um banco de dados em memória.
const pacientes = [
  { id: 1, nome: 'Maria Silva', email: 'maria.silva@email.com', nascimento: '1990-04-12' },
  { id: 2, nome: 'João Pereira', email: 'joao.pereira@email.com', nascimento: '1985-11-30' },
  { id: 3, nome: 'Ana Costa', email: 'ana.costa@email.com', nascimento: '2001-07-08' },
  { id: 4, nome: 'Lucas Almeida', email: 'lucas.almeida@email.com', nascimento: '1995-02-14' },
];

const servidor = http.createServer((req, res) => {
  // Permite que o frontend, em outra origem, acesse a API.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Retorna todos os pacientes cadastrados no array.
  if (req.method === 'GET' && req.url === '/pacientes') {
    res.writeHead(200);
    res.end(JSON.stringify(pacientes));
    return;
  }

  // Exercício 1: retorna o total, atualizado conforme o array.
  if (req.method === 'GET' && req.url === '/pacientes/total') {
    res.writeHead(200);
    res.end(JSON.stringify({ total: pacientes.length }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
});

// O Render define PORT automaticamente; localmente usamos 3000.
const PORTA = Number(process.env.PORT) || 3000;
servidor.listen(PORTA, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
