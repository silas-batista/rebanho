import { test } from "node:test";
import assert from "node:assert/strict";
import { gerarHash, conferirSenha } from "../src/senhas.js";

test("confere a senha correta contra o hash", () => {
  assert.equal(conferirSenha("ovelha123", gerarHash("ovelha123")), true);
});

test("rejeita senha errada", () => {
  assert.equal(conferirSenha("errada", gerarHash("ovelha123")), false);
});

test("hash não contém a senha e muda a cada geração (salt)", () => {
  const hash = gerarHash("ovelha123");
  assert.doesNotMatch(hash, /ovelha123/);
  assert.notEqual(hash, gerarHash("ovelha123"));
});
