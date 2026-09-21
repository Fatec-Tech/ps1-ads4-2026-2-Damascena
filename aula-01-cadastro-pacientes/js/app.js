const CHAVE_STORAGE = 'aula01-pacientes';
const pacientes = [];
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const busca = document.getElementById('busca');
const total = document.getElementById('total-pacientes');
const aviso = document.getElementById('aviso');
let ordemCrescente = true;

function salvarPacientes() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pacientes));
    aviso.textContent = '';
  } catch {
    aviso.textContent = 'Não foi possível salvar no navegador. Os dados permanecem disponíveis nesta página até ela ser fechada ou recarregada.';
  }
}

function carregarPacientes() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || '[]');
    if (!Array.isArray(dados) || !dados.every(p => p &&
      typeof p.nome === 'string' && typeof p.email === 'string' &&
      typeof p.nascimento === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.nascimento))) {
      throw new Error('Dados inválidos');
    }
    pacientes.push(...dados);
  } catch {
    aviso.textContent = 'Não foi possível recuperar os cadastros salvos no navegador.';
  }
}

function calcularIdade(dataISO, hoje = new Date()) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  let idade = hoje.getFullYear() - ano;
  if (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)) {
    idade--;
  }
  return idade;
}

function formatarData(dataISO) {
  return dataISO.split('-').reverse().join('/');
}

function renderizarTabela() {
  tabela.replaceChildren();
  total.textContent = `Total de pacientes: ${pacientes.length}`;
  const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
  pacientes.filter(p => p.nome.toLocaleLowerCase('pt-BR').includes(termo)).forEach(paciente => {
    const linha = document.createElement('tr');
    [paciente.nome, paciente.email, paciente.telefone || '', formatarData(paciente.nascimento), calcularIdade(paciente.nascimento)].forEach(valor => {
      const celula = document.createElement('td');
      // textContent exibe o cadastro como texto, sem interpretar HTML digitado.
      celula.textContent = valor;
      linha.appendChild(celula);
    });
    const acoes = document.createElement('td');
    const remover = document.createElement('button');
    remover.type = 'button';
    remover.className = 'btn btn-danger btn-sm';
    remover.textContent = 'Remover';
    remover.setAttribute('aria-label', `Remover ${paciente.nome}`);
    remover.addEventListener('click', () => {
      // Remove o objeto correto mesmo quando a tabela está filtrada ou ordenada.
      pacientes.splice(pacientes.indexOf(paciente), 1);
      salvarPacientes();
      renderizarTabela();
    });
    acoes.appendChild(remover);
    linha.appendChild(acoes);
    tabela.appendChild(linha);
  });
  document.getElementById('sem-resultados').hidden = tabela.children.length > 0;
}

formulario.addEventListener('submit', event => {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const telefone = document.getElementById('telefone').value.trim();
  const nascimento = document.getElementById('nascimento').value;
  if (!nome || !telefone || !nascimento || calcularIdade(nascimento) < 0) {
    alert('Preencha nome, telefone e uma data de nascimento válida, que não esteja no futuro.');
    return;
  }
  if (pacientes.some(p => p.email.trim().toLowerCase() === email)) {
    alert('Este e-mail já está cadastrado.');
    return;
  }
  pacientes.push({ nome, email, telefone, nascimento });
  salvarPacientes();
  renderizarTabela();
  formulario.reset();
});

busca.addEventListener('input', renderizarTabela);
document.getElementById('ordenar-nome').addEventListener('click', () => {
  pacientes.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR') * (ordemCrescente ? 1 : -1));
  document.getElementById('cabecalho-nome').setAttribute('aria-sort', ordemCrescente ? 'ascending' : 'descending');
  ordemCrescente = !ordemCrescente;
  salvarPacientes();
  renderizarTabela();
});
const hoje = new Date();
document.getElementById('nascimento').max = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
carregarPacientes();
renderizarTabela();
