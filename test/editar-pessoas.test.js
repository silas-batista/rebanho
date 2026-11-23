import { test } from "node:test";
import assert from "node:assert/strict";
import { abrirBanco } from "../src/banco.js";
import { criarPessoa, buscarPessoa, atualizarPessoa, listarPessoas } from "../src/pessoas.js";

function comVisitante(dados = {}) {
  const banco = abrirBanco();
  criarPessoa(banco, { nome: "Carla Dias", situacao: "visitante", primeiraFrequenciaEm: "2026-04-10", ...dados });
  return { banco, id: listarPessoas(banco)[0].id };
}

test("edita nome e telefone", () => {
  const { banco, id } = comVisitante();

  atualizarPessoa(banco, id, { nome: "Carla Dias Souza", situacao: "visitante", telefone: "62 90000-0003" });

  const pessoa = buscarPessoa(banco, id);
  assert.equal(pessoa.nome, "Carla Dias Souza");
  assert.equal(pessoa.telefone, "62 90000-0003");
});

test("receber visitante como membro registra a data de recebimento (RN02)", () => {
  const { banco, id } = comVisitante();

  atualizarPessoa(banco, id, { nome: "Carla Dias", situacao: "membro_ativo" }, { hoje: "2026-11-29" });

  assert.equal(buscarPessoa(banco, id).recebidoComoMembroEm, "2026-11-29");
});

test("editar membro já recebido mantém a data original de recebimento", () => {
  const { banco, id } = comVisitante();
  atualizarPessoa(banco, id, { nome: "Carla Dias", situacao: "membro_ativo" }, { hoje: "2026-11-29" });

  atualizarPessoa(banco, id, { nome: "Carla Dias", situacao: "membro_ativo", telefone: "1" }, { hoje: "2027-01-10" });

  assert.equal(buscarPessoa(banco, id).recebidoComoMembroEm, "2026-11-29");
});

test("desmarcar o consentimento revoga o compartilhamento do contato", () => {
  const { banco, id } = comVisitante({ consentiuContato: true });

  atualizarPessoa(banco, id, { nome: "Carla Dias", situacao: "visitante", consentiuContato: false });

  assert.equal(buscarPessoa(banco, id).consentiuContatoEm, null);
});

test("manter o consentimento marcado preserva a data original", () => {
  const { banco, id } = comVisitante({ consentiuContato: true });
  const original = buscarPessoa(banco, id).consentiuContatoEm;

  atualizarPessoa(banco, id, { nome: "Carla Dias", situacao: "visitante", consentiuContato: true });

  assert.deepEqual(buscarPessoa(banco, id).consentiuContatoEm, original);
});

test("rejeita edição sem nome", () => {
  const { banco, id } = comVisitante();
  assert.throws(() => atualizarPessoa(banco, id, { nome: "", situacao: "visitante" }), /Nome é obrigatório/);
});
