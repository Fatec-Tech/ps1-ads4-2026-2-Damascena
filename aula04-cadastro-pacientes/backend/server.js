const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares pedidos pelo professor.
app.use(cors());
app.use(express.json());

// Dados ficticios em memoria. Sao reiniciados a cada restart do servidor.
const pacientes = [
  { id: 1, nome: 'Maria Silva', email: 'maria.silva@email.com', nascimento: '1990-04-12' },
  { id: 2, nome: 'João Pereira', email: 'joao.pereira@email.com', nascimento: '1985-11-30' },
  { id: 3, nome: 'Ana Costa', email: 'ana.costa@email.com', nascimento: '2001-07-08' },
];
let proximoId = 4;

function dadosValidos(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const { nome, email, nascimento } = body;
  if ([nome, email, nascimento].some(valor => typeof valor !== 'string' || !valor.trim())) {
    return null;
  }
  return { nome: nome.trim(), email: email.trim(), nascimento: nascimento.trim() };
}

function emailDuplicado(email, ignorarId = null) {
  return pacientes.some(p => p.id !== ignorarId && p.email.toLowerCase() === email.toLowerCase());
}

// A rota especifica deve ficar ANTES de /pacientes/:id.
app.get('/pacientes/total', (req, res) => {
  res.status(200).json({ total: pacientes.length });
});

// READ: lista completa ou filtrada por nome (exercicio 8, item 3).
app.get('/pacientes', (req, res) => {
  const filtro = typeof req.query.nome === 'string' ? req.query.nome.trim().toLowerCase() : '';
  const resultado = filtro
    ? pacientes.filter(p => p.nome.toLowerCase().includes(filtro))
    : pacientes;
  res.status(200).json(resultado);
});

// READ: paciente especifico.
app.get('/pacientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const paciente = pacientes.find(p => p.id === id);
  if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });
  res.status(200).json(paciente);
});

// CREATE: cadastrar paciente, recusar campos vazios e email duplicado.
app.post('/pacientes', (req, res) => {
  const dados = dadosValidos(req.body);
  if (!dados) {
    return res.status(400).json({ erro: 'Nome, e-mail e nascimento são obrigatórios' });
  }
  if (emailDuplicado(dados.email)) {
    return res.status(409).json({ erro: 'E-mail já cadastrado' });
  }
  const novoPaciente = { id: proximoId++, ...dados };
  pacientes.push(novoPaciente);
  res.status(201).json(novoPaciente);
});

// UPDATE: modificar paciente existente.
app.put('/pacientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const paciente = pacientes.find(p => p.id === id);
  if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

  const dados = dadosValidos(req.body);
  if (!dados) {
    return res.status(400).json({ erro: 'Nome, e-mail e nascimento são obrigatórios' });
  }
  if (emailDuplicado(dados.email, id)) {
    return res.status(409).json({ erro: 'E-mail já cadastrado' });
  }
  Object.assign(paciente, dados);
  res.status(200).json(paciente);
});

// DELETE: remover paciente existente; 204 nao envia JSON de resposta.
app.delete('/pacientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = pacientes.findIndex(p => p.id === id);
  if (indice === -1) return res.status(404).json({ erro: 'Paciente não encontrado' });
  pacientes.splice(indice, 1);
  res.status(204).send();
});

// Permite ao arquivo de teste importar o app sem abrir uma porta fixa.
if (require.main === module) {
  const PORTA = process.env.PORT || 3000;
  app.listen(PORTA, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
  });
}

module.exports = app;
