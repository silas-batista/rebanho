import { test } from "node:test";
import assert from "node:assert/strict";
import { bancoComUsuarios, iniciarServidor, entrar } from "./apoio.js";

test("sem login, /pessoas redireciona para /entrar", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());

  const resposta = await fetch(`${url}/pessoas`, { redirect: "manual" });

  assert.equal(resposta.status, 303);
  assert.equal(resposta.headers.get("location"), "/entrar");
});

test("secretaria entra e acessa /pessoas", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { resposta, cookie } = await entrar(url, "secretaria@ipvf.org");

  assert.equal(resposta.status, 303);
  assert.equal((await fetch(`${url}/pessoas`, { headers: { cookie } })).status, 200);
});

test("membro não acessa /pessoas (403)", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "membro@ipvf.org");

  assert.equal((await fetch(`${url}/pessoas`, { headers: { cookie } })).status, 403);
});

test("senha errada devolve 401 com mensagem genérica", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { resposta } = await entrar(url, "secretaria@ipvf.org", "errada");

  assert.equal(resposta.status, 401);
  assert.match(await resposta.text(), /E-mail ou senha incorretos/);
});

test("sair encerra a sessão", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const saida = await fetch(`${url}/sair`, { method: "POST", headers: { cookie }, redirect: "manual" });
  const cookieDepois = saida.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");

  assert.equal((await fetch(`${url}/pessoas`, { headers: { cookie: cookieDepois }, redirect: "manual" })).status, 303);
});

test("após 5 senhas erradas, bloqueia até a senha certa com 429", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  for (let i = 0; i < 5; i++) await entrar(url, "secretaria@ipvf.org", "errada");

  const { resposta } = await entrar(url, "secretaria@ipvf.org");

  assert.equal(resposta.status, 429);
  assert.match(await resposta.text(), /Muitas tentativas/);
});

test("bloqueio de um e-mail não afeta outro", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  for (let i = 0; i < 5; i++) await entrar(url, "secretaria@ipvf.org", "errada");

  const { resposta } = await entrar(url, "membro@ipvf.org");

  assert.equal(resposta.status, 303);
});
