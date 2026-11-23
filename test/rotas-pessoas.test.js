import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { criarApp } from "../src/app.js";
import { criarPessoa } from "../src/pessoas.js";

async function servidor(banco) {
  const http = criarApp(banco).listen(0);
  await new Promise((resolve) => http.once("listening", resolve));
  return { url: `http://localhost:${http.address().port}`, fechar: () => http.close() };
}

test("GET /pessoas mostra pessoas, contagem de ativos e alerta de aptos", async (t) => {
  const banco = abrirBanco();
  criarPessoa(banco, { nome: "Ana Souza", situacao: "membro_ativo" });
  criarPessoa(banco, { nome: "Carla Dias", situacao: "visitante", primeiraFrequenciaEm: "2020-01-01" });
  const { url, fechar } = await servidor(banco);
  t.after(fechar);

  const html = await (await fetch(`${url}/pessoas`)).text();

  assert.match(html, /Ana Souza/);
  assert.match(html, /Membros ativos: 1/);
  assert.match(html, /1 visitante\(s\) apto\(s\) à membresia/);
});

test("POST /pessoas cadastra e redireciona para a lista", async (t) => {
  const banco = abrirBanco();
  const { url, fechar } = await servidor(banco);
  t.after(fechar);

  const resposta = await fetch(`${url}/pessoas`, {
    method: "POST",
    body: new URLSearchParams({ nome: "Bruno Lima", situacao: "visitante" }),
    redirect: "manual",
  });

  assert.equal(resposta.status, 303);
  assert.match(await (await fetch(`${url}/pessoas`)).text(), /Bruno Lima/);
});

test("POST /pessoas sem nome devolve 422 com a mensagem de erro", async (t) => {
  const { url, fechar } = await servidor(abrirBanco());
  t.after(fechar);

  const resposta = await fetch(`${url}/pessoas`, {
    method: "POST",
    body: new URLSearchParams({ nome: "", situacao: "visitante" }),
  });

  assert.equal(resposta.status, 422);
  assert.match(await resposta.text(), /Nome é obrigatório/);
});
