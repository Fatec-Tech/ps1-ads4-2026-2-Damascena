// URL real do backend atual no Render. Se o servico for renomeado,
// atualize esta constante e publique novamente o frontend.
// Para executar localmente: 'http://localhost:3000/pacientes'.
const URL_API = 'https://api-pacientes-damascena.onrender.com/pacientes';

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagem = document.getElementById('mensagem');
const carregando = document.getElementById('carregando');
const campoId = document.getElementById('id');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoNascimento = document.getElementById('nascimento');
const botaoSalvar = document.getElementById('btn-salvar');
const botaoCancelar = document.getElementById('btn-cancelar');
const botaoRecarregar = document.getElementById('btn-recarregar');

function mostrarMensagem(texto, tipo = 'danger') {
  mensagem.replaceChildren();
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = texto; // nunca inserir campos do usuario via innerHTML
  mensagem.appendChild(alerta);
}

function formatarData(dataISO) {
  if (typeof dataISO !== 'string' || !dataISO.includes('-')) return dataISO || '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto == null ? '' : String(texto);
  return td;
}

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);
  if (!resposta.ok) {
    let texto = `Erro HTTP ${resposta.status}`;
    try {
      const corpo = await resposta.json();
      if (corpo && corpo.erro) texto = corpo.erro;
    } catch (_) {
      // A API pode responder sem corpo JSON em caso de falha inesperada.
    }
    throw new Error(texto);
  }
  return resposta.status === 204 ? null : resposta.json();
}

function iniciarEdicao(paciente) {
  campoId.value = paciente.id;
  campoNome.value = paciente.nome;
  campoEmail.value = paciente.email;
  campoNascimento.value = paciente.nascimento;
  botaoSalvar.textContent = 'Atualizar';
  botaoCancelar.classList.remove('d-none');
  campoNome.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparFormulario() {
  formulario.reset();
  campoId.value = '';
  botaoSalvar.textContent = 'Salvar';
  botaoCancelar.classList.add('d-none');
}

function renderizarTabela(pacientes) {
  tabela.replaceChildren();
  if (pacientes.length === 0) {
    const linha = document.createElement('tr');
    const celula = document.createElement('td');
    celula.colSpan = 4;
    celula.textContent = 'Nenhum paciente cadastrado.';
    linha.appendChild(celula);
    tabela.appendChild(linha);
    return;
  }
  pacientes.forEach((paciente) => {
    const linha = document.createElement('tr');
    linha.appendChild(criarCelula(paciente.nome));
    linha.appendChild(criarCelula(paciente.email));
    linha.appendChild(criarCelula(formatarData(paciente.nascimento)));

    const acoes = document.createElement('td');
    const editar = document.createElement('button');
    editar.type = 'button';
    editar.className = 'btn btn-sm btn-outline-primary me-2';
    editar.textContent = 'Editar';
    editar.addEventListener('click', () => iniciarEdicao(paciente));

    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'btn btn-sm btn-outline-danger';
    excluir.textContent = 'Excluir';
    excluir.addEventListener('click', () => excluirPaciente(paciente.id));

    acoes.append(editar, excluir);
    linha.appendChild(acoes);
    tabela.appendChild(linha);
  });
}

async function listarPacientes() {
  carregando.hidden = false;
  try {
    const pacientes = await requisicao(URL_API);
    renderizarTabela(pacientes);
  } catch (erro) {
    console.error(erro);
    mostrarMensagem(`Não foi possível carregar os pacientes. ${erro.message}`);
  } finally {
    carregando.hidden = true;
  }
}

async function excluirPaciente(id) {
  if (!window.confirm('Deseja realmente excluir este paciente?')) return;
  try {
    await requisicao(`${URL_API}/${id}`, { method: 'DELETE' });
    if (campoId.value === String(id)) limparFormulario();
    mostrarMensagem('Paciente excluído com sucesso.', 'success');
    await listarPacientes();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const dados = {
    nome: campoNome.value.trim(),
    email: campoEmail.value.trim(),
    nascimento: campoNascimento.value,
  };
  const id = campoId.value;
  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${URL_API}/${id}` : URL_API;
  try {
    await requisicao(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    mostrarMensagem(id ? 'Paciente atualizado com sucesso.' : 'Paciente cadastrado com sucesso.', 'success');
    limparFormulario();
    await listarPacientes();
  } catch (erro) {
    mostrarMensagem(erro.message); // inclui o erro 409 de e-mail duplicado
  }
});

botaoCancelar.addEventListener('click', limparFormulario);
botaoRecarregar.addEventListener('click', listarPacientes);
listarPacientes();
