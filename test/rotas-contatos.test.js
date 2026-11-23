import { test } from "node:test";
import assert from "node:assert/strict";
import { criarPessoa } from "../src/pessoas.js";
import { bancoComUsuarios, iniciarServidor, entrar } from "./apoio.js";

function bancoComPessoas() {
  const banco = bancoComUsuarios();
  criarPessoa(banco, { nome: "Ana Souza", situacao: "membro_ativo", telefone: "62 90000-0001", consentiuContato: true });
  criarPessoa(banco, { nome: "Bruno Lima", situacao: "membro_ativo", telefone: "62 90000-0002" });
  return banco;
}

test("sem login, /contatos redireciona para /entrar", async (t) => {
  const url = await iniciarServidor(t, bancoComPessoas());

  const resposta = await fetch(`${url}/contatos`, { redirect: "manual" });

  assert.equal(resposta.headers.get("location"), "/entrar");
});

test("membro vê o contato de quem consentiu e não vê o de quem não consentiu", async (t) => {
  const url = await iniciarServidor(t, bancoComPessoas());
  const { cookie } = await entrar(url, "membro@ipvf.org");

  const html = await (await fetch(`${url}/contatos`, { headers: { cookie } })).text();

  assert.match(html, /Ana Souza/);
  assert.match(html, /62 90000-0001/);
  assert.doesNotMatch(html, /Bruno Lima|62 90000-0002/);
});
