import { test } from "node:test";
import assert from "node:assert/strict";
import { bancoComUsuarios, iniciarServidor } from "./apoio.js";

test("/saude responde ok quando o banco está acessível", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());

  const resposta = await fetch(`${url}/saude`);

  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), { status: "ok" });
});

test("/saude responde 503 quando o banco falha", async (t) => {
  const banco = bancoComUsuarios();
  const url = await iniciarServidor(t, banco);
  banco.close();

  assert.equal((await fetch(`${url}/saude`)).status, 503);
});

test("respostas trazem cabeçalhos de segurança e não revelam o framework", async (t) => {
  const url = await iniciarServidor(t, bancoComUsuarios());

  const { headers } = await fetch(`${url}/agenda`);

  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(headers.get("referrer-policy"), "same-origin");
  assert.equal(headers.get("x-powered-by"), null);
});
