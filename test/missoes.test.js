import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { criarProjeto, adicionarMissionario, listarProjetos } from "../src/missoes.js";

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
