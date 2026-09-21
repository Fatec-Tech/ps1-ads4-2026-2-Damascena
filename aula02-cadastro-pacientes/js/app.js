const pacientes = [];
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagemCarregando = document.getElementById('carregando');
const tabelaCompleta = document.getElementById('lista-pacientes');
const listaVazia = document.getElementById('lista-vazia');

function adicionarPaciente(nome, email, nascimento, origem = 'manual') {
  pacientes.push({ nome, email, nascimento, origem });
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
  const totalJSON = pacientes.filter(p => p.origem === 'json').length;
  document.getElementById('contador-json').textContent = `Pacientes do JSON: ${totalJSON}`;
  document.getElementById('contador-manual').textContent = `Cadastrados nesta sessão: ${pacientes.length - totalJSON}`;
  tabelaCompleta.hidden = pacientes.length === 0;
  listaVazia.hidden = pacientes.length !== 0;
}

function formatarData(dataISO) {
  return dataISO.split('-').reverse().join('/');
}

async function carregarPacientesIniciais() {
  mensagemCarregando.textContent = 'Carregando pacientes...';
  mensagemCarregando.className = 'text-muted';
  listaVazia.hidden = true;
  try {
    // Aguarda sem bloquear a interface antes de iniciar a requisição.
    await new Promise(resolve => setTimeout(resolve, 1000));
    // ?simularErro=1 permite demonstrar um erro 404 sem quebrar o modo normal.
    const simularErro = new URLSearchParams(window.location.search).get('simularErro') === '1';
    const resposta = await fetch(simularErro ? 'data/arquivo-inexistente.json' : 'data/pacientes.json');
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
    const dados = await resposta.json();
    if (!Array.isArray(dados) || !dados.every(p => p &&
      typeof p.nome === 'string' && typeof p.email === 'string' &&
      typeof p.nascimento === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.nascimento))) {
      throw new Error('Formato inválido no arquivo de pacientes.');
    }
    dados.forEach(p => adicionarPaciente(p.nome, p.email, p.nascimento, 'json'));
    renderizarTabela();
    mensagemCarregando.textContent = 'Dados carregados com sucesso.';
  } catch (erro) {
    console.error('Não foi possível carregar os pacientes:', erro);
    renderizarTabela();
    // Uma falha de busca não comprova que o arquivo está vazio.
    listaVazia.hidden = true;
    mensagemCarregando.className = 'text-danger';
    mensagemCarregando.textContent = 'Não foi possível carregar a lista de pacientes. Verifique sua conexão e tente recarregar a página. Você ainda pode cadastrar pacientes pelo formulário.';
  }
}

formulario.addEventListener('submit', event => {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const nascimento = document.getElementById('nascimento').value;
  if (!nome) {
    alert('Informe o nome do paciente.');
    return;
  }
  adicionarPaciente(nome, email, nascimento);
  renderizarTabela();
  formulario.reset();
});

carregarPacientesIniciais();
