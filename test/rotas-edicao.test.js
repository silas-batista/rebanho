import { test } from "node:test";
import assert from "node:assert/strict";
import { criarEvento, buscarEvento } from "../src/eventos.js";
import { criarProjeto, adicionarMissionario, listarProjetos } from "../src/missoes.js";
import { bancoComUsuarios, iniciarServidor, entrar } from "./apoio.js";

async function comoSecretaria(t) {
  const banco = bancoComUsuarios();
  criarEvento(banco, { titulo: "Culto", recorrencia: "semanal", diaSemana: "0", horario: "19:00" });
  const projeto = criarProjeto(banco, { nome: "Asas de Socorro" });
  adicionarMissionario(banco, projeto, { nome: "Wilker Mariano" });
  const url = await iniciarServidor(t, banco);
  const { cookie } = await entrar(url, "secretaria@ipvf.org");
  const post = (caminho, campos) =>
    fetch(`${url}${caminho}`, { method: "POST", headers: { cookie }, body: new URLSearchParams(campos), redirect: "manual" });
  return { banco, url, cookie, post, projeto };
}

test("secretaria edita evento a partir do formulário preenchido", async (t) => {
  const { banco, url, cookie, post } = await comoSecretaria(t);

  const formulario = await (await fetch(`${url}/agenda/1/editar`, { headers: { cookie } })).text();
  const resposta = await post("/agenda/1", { titulo: "Culto Público", recorrencia: "semanal", diaSemana: "0", horario: "19:00" });

  assert.match(formulario, /value="Culto"/);
  assert.equal(resposta.headers.get("location"), "/agenda?ok=evento");
  assert.equal(buscarEvento(banco, 1).titulo, "Culto Público");
});

test("excluir evento sem marcar a confirmação é recusado", async (t) => {
  const { banco, post } = await comoSecretaria(t);

  const resposta = await post("/agenda/1/excluir", {});

  assert.equal(resposta.status, 422);
  assert.match(await resposta.text(), /Marque a confirmação/);
  assert.ok(buscarEvento(banco, 1));
});

test("excluir evento com confirmação remove da agenda", async (t) => {
  const { banco, post } = await comoSecretaria(t);

  const resposta = await post("/agenda/1/excluir", { confirmar: "sim" });

  assert.equal(resposta.headers.get("location"), "/agenda?ok=excluido");
  assert.equal(buscarEvento(banco, 1), null);
});

test("membro não edita nem exclui evento (403)", async (t) => {
  const banco = bancoComUsuarios();
  criarEvento(banco, { titulo: "Culto", recorrencia: "semanal", diaSemana: "0", horario: "19:00" });
  const url = await iniciarServidor(t, banco);
  const { cookie } = await entrar(url, "membro@ipvf.org");
  const post = (caminho, campos) => fetch(`${url}${caminho}`, { method: "POST", headers: { cookie }, body: new URLSearchParams(campos) });

  assert.equal((await post("/agenda/1", { titulo: "Invasor", recorrencia: "semanal", diaSemana: "0", horario: "19:00" })).status, 403);
  assert.equal((await post("/agenda/1/excluir", { confirmar: "sim" })).status, 403);
  assert.equal(buscarEvento(banco, 1).titulo, "Culto");
});

test("editar evento inexistente devolve 404", async (t) => {
  const { url, cookie } = await comoSecretaria(t);

  assert.equal((await fetch(`${url}/agenda/999/editar`, { headers: { cookie } })).status, 404);
});

test("secretaria edita e exclui projeto missionário com confirmação", async (t) => {
  const { banco, post, projeto } = await comoSecretaria(t);

  const edicao = await post(`/missoes/${projeto}`, { nome: "Asas de Socorro", local: "Amazônia" });
  const semConfirmar = await post(`/missoes/${projeto}/excluir`, {});
  const local = listarProjetos(banco)[0].local;
  const exclusao = await post(`/missoes/${projeto}/excluir`, { confirmar: "sim" });

  assert.equal(edicao.headers.get("location"), "/missoes?ok=projeto");
  assert.equal(local, "Amazônia");
  assert.equal(semConfirmar.status, 422);
  assert.equal(exclusao.headers.get("location"), "/missoes?ok=excluido");
  assert.deepEqual(listarProjetos(banco), []);
});

test("secretaria remove missionário", async (t) => {
  const { banco, post } = await comoSecretaria(t);
  const missionario = listarProjetos(banco)[0].missionarios[0];

  const resposta = await post(`/missoes/missionarios/${missionario.id}/excluir`, {});

  assert.equal(resposta.headers.get("location"), "/missoes?ok=removido");
  assert.deepEqual(listarProjetos(banco)[0].missionarios, []);
});
