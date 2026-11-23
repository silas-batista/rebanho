import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { criarUsuario, autenticar, listarUsuarios, alterarSenha } from "../src/usuarios.js";

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

test("rejeita e-mail já cadastrado", () => {
  const banco = abrirBanco();
  criarUsuario(banco, { email: "a@ipvf.org", senha: "ovelha123", perfil: "membro" });

  assert.throws(() => criarUsuario(banco, { email: "A@ipvf.org", senha: "ovelha123", perfil: "membro" }), /já cadastrado/);
});

test("lista usuários sem expor o hash da senha", () => {
  const banco = abrirBanco();
  criarUsuario(banco, { email: "b@ipvf.org", senha: "ovelha123", perfil: "membro" });
  criarUsuario(banco, { email: "a@ipvf.org", senha: "ovelha123", perfil: "secretaria" });

  assert.deepEqual(listarUsuarios(banco).map(({ email, perfil, senhaHash, senha_hash }) => ({ email, perfil, senhaHash, senha_hash })), [
    { email: "a@ipvf.org", perfil: "secretaria", senhaHash: undefined, senha_hash: undefined },
    { email: "b@ipvf.org", perfil: "membro", senhaHash: undefined, senha_hash: undefined },
  ]);
});

test("altera a própria senha conferindo a senha atual", () => {
  const banco = abrirBanco();
  criarUsuario(banco, { email: "a@ipvf.org", senha: "ovelha123", perfil: "membro" });
  const { id } = autenticar(banco, "a@ipvf.org", "ovelha123");

  alterarSenha(banco, id, { atual: "ovelha123", nova: "pastoreio456" });

  assert.equal(autenticar(banco, "a@ipvf.org", "ovelha123"), null);
  assert.ok(autenticar(banco, "a@ipvf.org", "pastoreio456"));
});

test("não altera a senha se a atual estiver errada", () => {
  const banco = abrirBanco();
  criarUsuario(banco, { email: "a@ipvf.org", senha: "ovelha123", perfil: "membro" });
  const { id } = autenticar(banco, "a@ipvf.org", "ovelha123");

  assert.throws(() => alterarSenha(banco, id, { atual: "errada", nova: "pastoreio456" }), /Senha atual incorreta/);
});
