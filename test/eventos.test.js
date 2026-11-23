import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { criarEvento, listarEventos } from "../src/eventos.js";

test("cadastra culto semanal e evento único", () => {
  const banco = abrirBanco();
  criarEvento(banco, { titulo: "Culto", recorrencia: "semanal", diaSemana: "0", horario: "19:00", local: "Templo" });
  criarEvento(banco, { titulo: "Cantata", recorrencia: "unica", inicioEm: "2026-12-05T18:00" });

  assert.deepEqual(
    listarEventos(banco).map(({ titulo, diaSemana, inicioEm }) => ({ titulo, diaSemana, inicioEm })),
    [
      { titulo: "Cantata", diaSemana: null, inicioEm: "2026-12-05T18:00" },
      { titulo: "Culto", diaSemana: 0, inicioEm: null },
    ],
  );
});

test("rejeita evento sem título", () => {
  assert.throws(() => criarEvento(abrirBanco(), { titulo: "", recorrencia: "unica", inicioEm: "2026-12-05T18:00" }), /Título/);
});

test("rejeita culto semanal sem dia da semana ou horário", () => {
  assert.throws(() => criarEvento(abrirBanco(), { titulo: "Culto", recorrencia: "semanal", horario: "19:00" }), /dia da semana/);
  assert.throws(() => criarEvento(abrirBanco(), { titulo: "Culto", recorrencia: "semanal", diaSemana: "0" }), /horário/);
});

test("rejeita evento único sem data e hora", () => {
  assert.throws(() => criarEvento(abrirBanco(), { titulo: "Cantata", recorrencia: "unica" }), /data e hora/);
});
