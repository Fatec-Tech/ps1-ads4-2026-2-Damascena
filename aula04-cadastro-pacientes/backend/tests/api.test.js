const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

// Um teste sequencial de ponta a ponta, sem dependencias de teste extras.
test('CRUD e exercicios da Aula 04', async () => {
  const servidor = app.listen(0, '127.0.0.1');
  await new Promise(resolve => servidor.once('listening', resolve));
  const base = `http://127.0.0.1:${servidor.address().port}`;

  async function enviar(caminho, metodo = 'GET', dados) {
    const opcoes = { method: metodo };
    if (dados !== undefined) {
      opcoes.headers = { 'Content-Type': 'application/json' };
      opcoes.body = JSON.stringify(dados);
    }
    return fetch(base + caminho, opcoes);
  }

  try {
    let resposta = await enviar('/pacientes');
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).length, 3);

    resposta = await enviar('/pacientes/1');
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).nome, 'Maria Silva');

    resposta = await enviar('/pacientes/999');
    assert.equal(resposta.status, 404);

    resposta = await enviar('/pacientes/total');
    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), { total: 3 });

    resposta = await enviar('/pacientes?nome=ana');
    assert.equal(resposta.status, 200);
    assert.deepEqual((await resposta.json()).map(p => p.nome), ['Ana Costa']);

    resposta = await enviar('/pacientes', 'POST', {});
    assert.equal(resposta.status, 400);

    resposta = await enviar('/pacientes', 'POST', {
      nome: 'Outra Maria', email: 'MARIA.SILVA@email.com', nascimento: '1999-01-01'
    });
    assert.equal(resposta.status, 409);

    resposta = await enviar('/pacientes', 'POST', {
      nome: 'Carlos Lima', email: 'carlos@email.com', nascimento: '1995-02-20'
    });
    assert.equal(resposta.status, 201);
    const criado = await resposta.json();
    assert.equal(criado.id, 4);

    resposta = await enviar('/pacientes/total');
    assert.deepEqual(await resposta.json(), { total: 4 });

    resposta = await enviar('/pacientes/4', 'PUT', {
      nome: 'Carlos Lima Jr.', email: 'carlos@email.com', nascimento: '1995-02-20'
    });
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).nome, 'Carlos Lima Jr.');

    resposta = await enviar('/pacientes/999', 'PUT', {
      nome: 'Outro', email: 'outro@email.com', nascimento: '2000-01-01'
    });
    assert.equal(resposta.status, 404);

    resposta = await enviar('/pacientes/4', 'DELETE');
    assert.equal(resposta.status, 204);
    assert.equal(await resposta.text(), '');

    resposta = await enviar('/pacientes/999', 'DELETE');
    assert.equal(resposta.status, 404);

    resposta = await enviar('/pacientes/total');
    assert.deepEqual(await resposta.json(), { total: 3 });
  } finally {
    await new Promise((resolve, reject) => servidor.close(err => err ? reject(err) : resolve()));
  }
});
