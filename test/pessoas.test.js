import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { criarPessoa, listarPessoas, listarAptasAMembresia } from "../src/pessoas.js";

const hoje = new Date("2026-11-23");

test("cadastra pessoa e lista pelo nome", () => {
  const banco = abrirBanco();
  criarPessoa(banco, { nome: "Ana Souza", situacao: "membro_ativo" });

  assert.deepEqual(listarPessoas(banco).map((p) => p.nome), ["Ana Souza"]);
});

test("filtra pessoas por situação", () => {
  const banco = abrirBanco();
  criarPessoa(banco, { nome: "Ana Souza", situacao: "membro_ativo" });
  criarPessoa(banco, { nome: "Bruno Lima", situacao: "visitante" });

  assert.deepEqual(listarPessoas(banco, { situacao: "visitante" }).map((p) => p.nome), ["Bruno Lima"]);
});

test("lista apenas visitantes aptos à membresia", () => {
  const banco = abrirBanco();
  criarPessoa(banco, { nome: "Carla Dias", situacao: "visitante", primeiraFrequenciaEm: "2026-04-10" });
  criarPessoa(banco, { nome: "Bruno Lima", situacao: "visitante", primeiraFrequenciaEm: "2026-09-01" });

  assert.deepEqual(listarAptasAMembresia(banco, hoje).map((p) => p.nome), ["Carla Dias"]);
});

test("rejeita pessoa sem nome", () => {
  const banco = abrirBanco();
  assert.throws(() => criarPessoa(banco, { nome: "  ", situacao: "visitante" }), /nome/i);
});
