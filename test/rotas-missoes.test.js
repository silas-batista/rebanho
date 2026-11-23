import { test } from "node:test";
import assert from "node:assert/strict";
import { criarProjeto, adicionarMissionario } from "../src/missoes.js";
import { bancoComUsuarios, iniciarServidor, entrar } from "./apoio.js";

const post = (url, caminho, cookie, campos) =>
  fetch(`${url}${caminho}`, {
    method: "POST",
    headers: { cookie },
    body: new URLSearchParams(campos),
    redirect: "manual",
  });

test("missões são públicas e mostram projetos com missionários", async (t) => {
  const banco = bancoComUsuarios();
  const projeto = criarProjeto(banco, { nome: "Plantação de igreja", local: "Uruguai" });
  adicionarMissionario(banco, projeto, { nome: "Rev. Maurício Rolim" });
  const url = await iniciarServidor(t, banco);

  const html = await (await fetch(`${url}/missoes`)).text();

  assert.match(html, /Plantação de igreja/);
  assert.match(html, /Uruguai/);
  assert.match(html, /Rev\. Maurício Rolim/);
});

test("secretaria cadastra projeto e adiciona missionário", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const criacao = await post(url, "/missoes", cookie, { nome: "Asas de Socorro" });
  const adicao = await post(url, "/missoes/1/missionarios", cookie, { nome: "Wilker Mariano" });

  assert.equal(criacao.status, 303);
  assert.equal(adicao.status, 303);
  assert.match(await (await fetch(`${url}/missoes`)).text(), /Wilker Mariano/);
});

test("membro não cadastra projeto nem missionário (403)", async (t) => {
  const banco = bancoComUsuarios();
  criarProjeto(banco, { nome: "Asas de Socorro" });
  const url = await iniciarServidor(t, banco);
  const { cookie } = await entrar(url, "membro@ipvf.org");

  assert.equal((await post(url, "/missoes", cookie, { nome: "Invasor" })).status, 403);
  assert.equal((await post(url, "/missoes/1/missionarios", cookie, { nome: "Invasor" })).status, 403);
});

test("projeto sem nome devolve 422 com a mensagem", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const resposta = await post(url, "/missoes", cookie, { nome: "" });

  assert.equal(resposta.status, 422);
  assert.match(await resposta.text(), /Nome do projeto é obrigatório/);
});
