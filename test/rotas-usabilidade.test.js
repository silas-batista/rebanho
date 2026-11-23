import { test } from "node:test";
import assert from "node:assert/strict";
import { bancoComUsuarios, iniciarServidor, entrar } from "./apoio.js";

test("rota inexistente mostra página 404 em português", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());

  const resposta = await fetch(`${url}/nao-existe`);

  assert.equal(resposta.status, 404);
  assert.match(await resposta.text(), /Página não encontrada/);
});

test("pessoa inexistente mostra a mesma página 404 em português", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const resposta = await fetch(`${url}/pessoas/999/editar`, { headers: { cookie } });

  assert.equal(resposta.status, 404);
  assert.match(await resposta.text(), /Página não encontrada/);
});

test("erro interno mostra página em português, sem detalhes técnicos", async (t) => {
  const banco = bancoComUsuarios();
  const url = await iniciarServidor(t, banco);
  banco.close();

  const resposta = await fetch(`${url}/agenda`);
  const html = await resposta.text();

  assert.equal(resposta.status, 500);
  assert.match(html, /Algo deu errado/);
  assert.doesNotMatch(html, /at .*\.js:\d+/);
});

test("depois de salvar, a lista mostra a confirmação", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const resposta = await fetch(`${url}/pessoas`, {
    method: "POST",
    headers: { cookie },
    body: new URLSearchParams({ nome: "Bruno Lima", situacao: "visitante" }),
    redirect: "manual",
  });
  const lista = await (await fetch(`${url}${resposta.headers.get("location")}`, { headers: { cookie } })).text();

  assert.match(lista, /Pessoa salva\./);
});

test("aviso desconhecido na URL não aparece na página", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());

  const html = await (await fetch(`${url}/agenda?ok=<script>alert(1)</script>`)).text();

  assert.doesNotMatch(html, /alert\(1\)/);
});
