import { test } from "node:test";
import assert from "node:assert/strict";
import { bancoComUsuarios, iniciarServidor, entrar, SENHA } from "./apoio.js";

const post = (url, caminho, cookie, campos) =>
  fetch(`${url}${caminho}`, { method: "POST", headers: { cookie }, body: new URLSearchParams(campos), redirect: "manual" });

test("secretaria cria usuário e ele consegue entrar", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const resposta = await post(url, "/usuarios", cookie, { email: "novo@ipvf.org", senha: "bemvindo1", perfil: "membro" });

  assert.equal(resposta.status, 303);
  assert.equal((await entrar(url, "novo@ipvf.org", "bemvindo1")).resposta.status, 303);
});

test("e-mail duplicado devolve 422 com a mensagem", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const resposta = await post(url, "/usuarios", cookie, { email: "membro@ipvf.org", senha: "bemvindo1", perfil: "membro" });

  assert.equal(resposta.status, 422);
  assert.match(await resposta.text(), /E-mail já cadastrado/);
});

test("membro não acessa a gestão de usuários (403)", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "membro@ipvf.org");

  assert.equal((await fetch(`${url}/usuarios`, { headers: { cookie } })).status, 403);
});

test("membro troca a própria senha", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "membro@ipvf.org");

  const resposta = await post(url, "/minha-senha", cookie, { atual: SENHA, nova: "pastoreio456" });

  assert.equal(resposta.status, 303);
  assert.equal((await entrar(url, "membro@ipvf.org", "pastoreio456")).resposta.status, 303);
});

test("troca de senha com a atual errada devolve 422", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "membro@ipvf.org");

  const resposta = await post(url, "/minha-senha", cookie, { atual: "errada", nova: "pastoreio456" });

  assert.equal(resposta.status, 422);
  assert.match(await resposta.text(), /Senha atual incorreta/);
});
