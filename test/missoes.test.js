import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { criarProjeto, adicionarMissionario, listarProjetos, buscarProjeto, atualizarProjeto, excluirProjeto, removerMissionario } from "../src/missoes.js";

test("lista projetos com seus missionários", () => {
  const banco = abrirBanco();
  const uruguai = criarProjeto(banco, { nome: "Plantação de igreja", local: "Uruguai" });
  adicionarMissionario(banco, uruguai, { nome: "Rev. Maurício Rolim" });
  adicionarMissionario(banco, uruguai, { nome: "Sandra Rolim" });
  const asas = criarProjeto(banco, { nome: "Asas de Socorro", local: "Brasil" });
  adicionarMissionario(banco, asas, { nome: "Wilker Mariano" });

  assert.deepEqual(
    listarProjetos(banco).map((p) => [p.nome, p.missionarios.map((m) => m.nome)]),
    [
      ["Asas de Socorro", ["Wilker Mariano"]],
      ["Plantação de igreja", ["Rev. Maurício Rolim", "Sandra Rolim"]],
    ],
  );
});

test("projeto sem missionários aparece com lista vazia", () => {
  const banco = abrirBanco();
  criarProjeto(banco, { nome: "Missão Urbana" });

  assert.deepEqual(listarProjetos(banco)[0].missionarios, []);
});

test("rejeita projeto sem nome", () => {
  assert.throws(() => criarProjeto(abrirBanco(), { nome: " " }), /Nome do projeto/);
});

test("rejeita missionário sem nome ou em projeto inexistente", () => {
  const banco = abrirBanco();
  const projeto = criarProjeto(banco, { nome: "Asas de Socorro" });

  assert.throws(() => adicionarMissionario(banco, projeto, { nome: "" }), /Nome do missionário/);
  assert.throws(() => adicionarMissionario(banco, 999, { nome: "Fulano" }), /Projeto não encontrado/);
});

test("edita nome, local e descrição do projeto", () => {
  const banco = abrirBanco();
  const id = criarProjeto(banco, { nome: "Plantação de igreja", local: "Uruguai" });

  atualizarProjeto(banco, id, { nome: "Plantação de igreja em Montevidéu", local: "Uruguai", descricao: "Nova igreja" });

  assert.deepEqual(
    listarProjetos(banco).map(({ nome, descricao }) => [nome, descricao]),
    [["Plantação de igreja em Montevidéu", "Nova igreja"]],
  );
});

test("excluir projeto remove também seus missionários", () => {
  const banco = abrirBanco();
  const id = criarProjeto(banco, { nome: "Asas de Socorro" });
  adicionarMissionario(banco, id, { nome: "Wilker Mariano" });

  excluirProjeto(banco, id);

  assert.deepEqual(listarProjetos(banco), []);
  assert.equal(banco.prepare("SELECT COUNT(*) AS total FROM missionarios").get().total, 0);
});

test("remove um missionário do projeto", () => {
  const banco = abrirBanco();
  const id = criarProjeto(banco, { nome: "Plantação de igreja" });
  adicionarMissionario(banco, id, { nome: "Rev. Maurício Rolim" });
  adicionarMissionario(banco, id, { nome: "Fulano por engano" });
  const engano = listarProjetos(banco)[0].missionarios[1];

  removerMissionario(banco, engano.id);

  assert.deepEqual(listarProjetos(banco)[0].missionarios.map((m) => m.nome), ["Rev. Maurício Rolim"]);
});
