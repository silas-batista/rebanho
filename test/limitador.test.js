import { test } from "node:test";
import assert from "node:assert/strict";
import { LimitadorDeTentativas } from "../src/limitador.js";

function relogio() {
  let agora = 0;
  return { agora: () => agora, avancar: (ms) => (agora += ms) };
}

test("bloqueia após o máximo de falhas", () => {
  const limitador = new LimitadorDeTentativas({ maximo: 3, janelaMs: 1000, agora: relogio().agora });
  for (let i = 0; i < 3; i++) limitador.registrarFalha("a@b.c");

  assert.equal(limitador.bloqueado("a@b.c"), true);
});

test("não bloqueia antes do máximo", () => {
  const limitador = new LimitadorDeTentativas({ maximo: 3, janelaMs: 1000, agora: relogio().agora });
  limitador.registrarFalha("a@b.c");
  limitador.registrarFalha("a@b.c");

  assert.equal(limitador.bloqueado("a@b.c"), false);
});

test("desbloqueia depois que a janela passa", () => {
  const tempo = relogio();
  const limitador = new LimitadorDeTentativas({ maximo: 3, janelaMs: 1000, agora: tempo.agora });
  for (let i = 0; i < 3; i++) limitador.registrarFalha("a@b.c");

  tempo.avancar(1001);

  assert.equal(limitador.bloqueado("a@b.c"), false);
});

test("login certo zera as falhas", () => {
  const limitador = new LimitadorDeTentativas({ maximo: 3, janelaMs: 1000, agora: relogio().agora });
  limitador.registrarFalha("a@b.c");
  limitador.registrarFalha("a@b.c");
  limitador.limpar("a@b.c");
  limitador.registrarFalha("a@b.c");

  assert.equal(limitador.bloqueado("a@b.c"), false);
});

test("e-mail é comparado sem diferenciar maiúsculas", () => {
  const limitador = new LimitadorDeTentativas({ maximo: 2, janelaMs: 1000, agora: relogio().agora });
  limitador.registrarFalha("A@B.c");
  limitador.registrarFalha("a@b.C");

  assert.equal(limitador.bloqueado("a@b.c"), true);
});
