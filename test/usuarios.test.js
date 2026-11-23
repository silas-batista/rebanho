import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { criarUsuario, autenticar } from "../src/usuarios.js";

test("autentica com e-mail e senha corretos e devolve o perfil", () => {
  const banco = abrirBanco();
  criarUsuario(banco, { email: "secretaria@ipvf.org", senha: "ovelha123", perfil: "secretaria" });

  assert.equal(autenticar(banco, "secretaria@ipvf.org", "ovelha123")?.perfil, "secretaria");
});

test("e-mail é comparado sem diferenciar maiúsculas", () => {
  const banco = abrirBanco();
  criarUsuario(banco, { email: "Secretaria@IPVF.org", senha: "ovelha123", perfil: "secretaria" });

  assert.ok(autenticar(banco, "secretaria@ipvf.org", "ovelha123"));
});

test("senha errada não autentica", () => {
  const banco = abrirBanco();
  criarUsuario(banco, { email: "secretaria@ipvf.org", senha: "ovelha123", perfil: "secretaria" });

  assert.equal(autenticar(banco, "secretaria@ipvf.org", "errada"), null);
});

test("e-mail inexistente não autentica", () => {
  assert.equal(autenticar(abrirBanco(), "ninguem@ipvf.org", "x"), null);
});

test("rejeita senha com menos de 8 caracteres", () => {
  assert.throws(
    () => criarUsuario(abrirBanco(), { email: "a@b.c", senha: "curta", perfil: "membro" }),
    /8 caracteres/,
  );
});
