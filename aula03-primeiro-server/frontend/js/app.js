// Local: http://localhost:3000/pacientes
// Após publicar o backend no Render, substitua a URL pela pública da API.
const URL_API = 'https://api-pacientes-damascena.onrender.com/pacientes';

const pacientes = [];
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagemCarregando = document.getElementById('carregando');
const tabelaCompleta = document.getElementById('lista-pacientes');
const listaVazia = document.getElementById('lista-vazia');
git add aula03-primeiro-server/frontend/js/app.js
function adicionarPaciente(nome, email, nascimento, origem = 'manual') {
  pacientes.push({ nome, email, nascimento, origem });
}

function formatarData(dataISO) {
  return dataISO.split('-').reverse().join('/');
}

function renderizarTabela() {
  tabela.replaceChildren();

  pacientes.forEach(paciente => {
    const linha = document.createElement('tr');
    [paciente.nome, paciente.email, formatarData(paciente.nascimento)].forEach(valor => {
      const celula = document.createElement('td');
      celula.textContent = valor;
      linha.appendChild(celula);
    });
    tabela.appendChild(linha);
  });

  const totalAPI = pacientes.filter(p => p.origem === 'api').length;
  document.getElementById('contador-json').textContent = `Pacientes da API: ${totalAPI}`;
  document.getElementById('contador-manual').textContent = `Cadastrados nesta sessão: ${pacientes.length - totalAPI}`;
  tabelaCompleta.hidden = pacientes.length === 0;
  listaVazia.hidden = pacientes.length !== 0;
}

async function carregarPacientesIniciais() {
  mensagemCarregando.className = 'text-muted';
  mensagemCarregando.textContent = 'Carregando pacientes...';
  listaVazia.hidden = true;

  try {
    const resposta = await fetch(URL_API);
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

    const dados = await resposta.json();
    if (!Array.isArray(dados)) throw new Error('Formato de resposta inválido');

    dados.forEach(p => adicionarPaciente(p.nome, p.email, p.nascimento, 'api'));
    renderizarTabela();
    mensagemCarregando.textContent = 'Dados carregados com sucesso.';
  } catch (erro) {
    console.error('Não foi possível carregar os pacientes:', erro);
    mensagemCarregando.className = 'text-danger';
    mensagemCarregando.textContent =
      'Erro ao carregar pacientes. O servidor está rodando?';
    listaVazia.hidden = true;
  }
}

formulario.addEventListener('submit', event => {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const nascimento = document.getElementById('nascimento').value;
  if (!nome) return;
  // Sem POST nesta aula: novos cadastros feitos pelo formulário ficam na página.
  adicionarPaciente(nome, email, nascimento);
  renderizarTabela();
  formulario.reset();
});

carregarPacientesIniciais();
