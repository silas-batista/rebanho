import { test } from "node:test";
import assert from "node:assert/strict";
import { ocorrenciasNoPeriodo } from "../src/agenda.js";

const culto = { titulo: "Culto", recorrencia: "semanal", diaSemana: 0, horario: "19:00" };
const cantata = { titulo: "Cantata de Natal", recorrencia: "unica", inicioEm: "2026-12-05T18:00" };

const resumo = (ocorrencias) => ocorrencias.map((o) => `${o.data} ${o.horario} ${o.titulo}`);

test("culto semanal aparece em todos os domingos do período", () => {
  // 23/11/2026 é segunda-feira
  assert.deepEqual(resumo(ocorrenciasNoPeriodo([culto], "2026-11-23", 14)), [
    "2026-11-29 19:00 Culto",
    "2026-12-06 19:00 Culto",
  ]);
});

test("evento único aparece só na sua data", () => {
  assert.deepEqual(resumo(ocorrenciasNoPeriodo([cantata], "2026-11-23", 30)), ["2026-12-05 18:00 Cantata de Natal"]);
});

test("evento único fora do período não aparece", () => {
  assert.deepEqual(ocorrenciasNoPeriodo([cantata], "2026-11-23", 7), []);
});

test("ocorrências vêm em ordem de data e horário", () => {
  const escolaDominical = { titulo: "Escola Dominical", recorrencia: "semanal", diaSemana: 0, horario: "09:00" };
  assert.deepEqual(resumo(ocorrenciasNoPeriodo([culto, cantata, escolaDominical], "2026-11-23", 7)), [
    "2026-11-29 09:00 Escola Dominical",
    "2026-11-29 19:00 Culto",
  ]);
});
