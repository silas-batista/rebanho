import { test } from "node:test";
import assert from "node:assert/strict";
import { criarPessoa } from "../src/pessoas.js";
import { bancoComUsuarios, iniciarServidor, entrar } from "./apoio.js";

async function comoSecretaria(t, banco) {
  const url = await iniciarServidor(t, banco);
  const { cookie } = await entrar(url, "secretaria@ipvf.org");
  return { url, headers: { cookie } };
}

test("GET /pessoas mostra pessoas, contagem de ativos e alerta de aptos", async (t) => {
  const banco = bancoComUsuarios();
  criarPessoa(banco, { nome: "Ana Souza", situacao: "membro_ativo" });
  criarPessoa(banco, { nome: "Carla Dias", situacao: "visitante", primeiraFrequenciaEm: "2020-01-01" });
  const { url, headers } = await comoSecretaria(t, banco);

  const html = await (await fetch(`${url}/pessoas`, { headers })).text();

  assert.match(html, /Ana Souza/);
  assert.match(html, /Membros ativos: 1/);
  assert.match(html, /1 visitante\(s\) apto\(s\) à membresia/);
});

test("POST /pessoas cadastra e redireciona para a lista", async (t) => {
  const { url, headers } = await comoSecretaria(t, bancoComUsuarios());

  const resposta = await fetch(`${url}/pessoas`, {
    method: "POST",
    headers,
    body: new URLSearchParams({ nome: "Bruno Lima", situacao: "visitante" }),
    redirect: "manual",
  });

  assert.equal(resposta.status, 303);
  assert.match(await (await fetch(`${url}/pessoas`, { headers })).text(), /Bruno Lima/);
});

test("POST /pessoas sem nome devolve 422 com a mensagem de erro", async (t) => {
  const { url, headers } = await comoSecretaria(t, bancoComUsuarios());

  const resposta = await fetch(`${url}/pessoas`, {
    method: "POST",
    headers,
    body: new URLSearchParams({ nome: "", situacao: "visitante" }),
  });

  assert.equal(resposta.status, 422);
  assert.match(await resposta.text(), /Nome é obrigatório/);
});
