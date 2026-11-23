import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { listarUsuarios } from "../src/usuarios.js";
import { bancoComUsuarios, iniciarServidor } from "./apoio.js";

const CODIGO = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
const enviar = (url, campos) =>
  fetch(`${url}/primeiro-acesso`, { method: "POST", body: new URLSearchParams(campos), redirect: "manual" });

test("com o código certo, cria a secretaria e já entra no sistema", async (t) => {
  const banco = abrirBanco();
  const url = await iniciarServidor(t, banco, { codigoPrimeiroAcesso: CODIGO });

  const resposta = await enviar(url, { codigo: CODIGO, email: "pastor@ipvf.org", senha: "ovelha123" });
  const cookie = resposta.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");

  assert.equal(resposta.status, 303);
  assert.deepEqual(listarUsuarios(banco).map((u) => [u.email, u.perfil]), [["pastor@ipvf.org", "secretaria"]]);
  assert.equal((await fetch(`${url}/pessoas`, { headers: { cookie } })).status, 200);
});

test("código errado é recusado e nenhum usuário é criado", async (t) => {
  const banco = abrirBanco();
  const url = await iniciarServidor(t, banco, { codigoPrimeiroAcesso: CODIGO });

  const resposta = await enviar(url, { codigo: "errado", email: "intruso@x.org", senha: "ovelha123" });

  assert.equal(resposta.status, 403);
  assert.equal(listarUsuarios(banco).length, 0);
});

test("depois que existe usuário, a página some mesmo com o código certo", async (t) => {
  const banco = bancoComUsuarios();
  const url = await iniciarServidor(t, banco, { codigoPrimeiroAcesso: CODIGO });

  assert.equal((await fetch(`${url}/primeiro-acesso`)).status, 404);
  assert.equal((await enviar(url, { codigo: CODIGO, email: "intruso@x.org", senha: "ovelha123" })).status, 404);
  assert.equal(listarUsuarios(banco).length, 2);
});

test("sem código configurado, a página não existe", async (t) => {
  const url = await iniciarServidor(t, abrirBanco());

  assert.equal((await fetch(`${url}/primeiro-acesso`)).status, 404);
});

test("senha curta devolve 422 e não cria usuário", async (t) => {
  const banco = abrirBanco();
  const url = await iniciarServidor(t, banco, { codigoPrimeiroAcesso: CODIGO });

  const resposta = await enviar(url, { codigo: CODIGO, email: "pastor@ipvf.org", senha: "curta" });

  assert.equal(resposta.status, 422);
  assert.equal(listarUsuarios(banco).length, 0);
});
