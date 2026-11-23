import { test } from "node:test";
import assert from "node:assert/strict";
import { criarEvento } from "../src/eventos.js";
import { bancoComUsuarios, iniciarServidor, entrar } from "./apoio.js";

test("agenda é pública e mostra o culto semanal", async (t) => {
  const banco = bancoComUsuarios();
  criarEvento(banco, { titulo: "Culto de Celebração", recorrencia: "semanal", diaSemana: "0", horario: "19:00", local: "Templo" });
  const url = await iniciarServidor(t, banco);

  const resposta = await fetch(`${url}/agenda`);

  assert.equal(resposta.status, 200);
  assert.match(await resposta.text(), /Culto de Celebração/);
});

test("página inicial leva à agenda", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());

  const resposta = await fetch(`${url}/`, { redirect: "manual" });

  assert.equal(resposta.headers.get("location"), "/agenda");
});

test("secretaria cadastra evento", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const resposta = await fetch(`${url}/agenda`, {
    method: "POST",
    headers: { cookie },
    body: new URLSearchParams({ titulo: "Estudo Bíblico", recorrencia: "semanal", diaSemana: "3", horario: "20:00" }),
    redirect: "manual",
  });

  assert.equal(resposta.status, 303);
  assert.match(await (await fetch(`${url}/agenda`)).text(), /Estudo Bíblico/);
});

test("membro não cadastra evento (403)", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "membro@ipvf.org");

  const resposta = await fetch(`${url}/agenda`, {
    method: "POST",
    headers: { cookie },
    body: new URLSearchParams({ titulo: "Invasor", recorrencia: "semanal", diaSemana: "3", horario: "20:00" }),
  });

  assert.equal(resposta.status, 403);
});

test("evento inválido devolve 422 com a mensagem", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());
  const { cookie } = await entrar(url, "secretaria@ipvf.org");

  const resposta = await fetch(`${url}/agenda`, {
    method: "POST",
    headers: { cookie },
    body: new URLSearchParams({ titulo: "Culto", recorrencia: "semanal", diaSemana: "0" }),
  });

  assert.equal(resposta.status, 422);
  assert.match(await resposta.text(), /horário do culto/);
});

test("pequeno grupo restrito não aparece para visitante sem login, mas aparece para membro", async (t) => {
  const banco = bancoComUsuarios();
  criarEvento(banco, {
    titulo: "PG Família Silva",
    recorrencia: "semanal",
    diaSemana: "3",
    horario: "20:00",
    local: "Rua das Flores, 123",
    visibilidade: "membros",
  });
  const url = await iniciarServidor(t, banco);
  const { cookie } = await entrar(url, "membro@ipvf.org");

  const publica = await (await fetch(`${url}/agenda`)).text();
  const deMembro = await (await fetch(`${url}/agenda`, { headers: { cookie } })).text();

  assert.doesNotMatch(publica, /PG Família Silva|Rua das Flores/);
  assert.match(deMembro, /PG Família Silva/);
});
