import { test } from "node:test";
import assert from "node:assert/strict";
import { aptaAMembresia, mesesDeFrequencia } from "../src/membresia.js";

const hoje = new Date("2026-11-23");

test("visitante com 6 meses de frequência está apto à membresia", () => {
  const visitante = { situacao: "visitante", primeiraFrequenciaEm: new Date("2026-05-23") };
  assert.equal(aptaAMembresia(visitante, hoje), true);
});

test("visitante com menos de 6 meses não está apto", () => {
  const visitante = { situacao: "visitante", primeiraFrequenciaEm: new Date("2026-05-24") };
  assert.equal(aptaAMembresia(visitante, hoje), false);
});

test("visitante sem data de primeira frequência não está apto", () => {
  const visitante = { situacao: "visitante", primeiraFrequenciaEm: null };
  assert.equal(aptaAMembresia(visitante, hoje), false);
});

test("membro ativo não aparece como apto à membresia", () => {
  const membro = { situacao: "membro_ativo", primeiraFrequenciaEm: new Date("2020-01-01") };
  assert.equal(aptaAMembresia(membro, hoje), false);
});

test("conta os meses completos de frequência", () => {
  assert.equal(mesesDeFrequencia(new Date("2026-05-23"), hoje), 6);
  assert.equal(mesesDeFrequencia(new Date("2026-05-24"), hoje), 5);
  assert.equal(mesesDeFrequencia(new Date("2026-11-01"), hoje), 0);
});
