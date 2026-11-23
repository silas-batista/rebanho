import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { abrirBanco } from "../src/banco.js";
import { criarPessoa, listarPessoas } from "../src/pessoas.js";
import { criarBackup } from "../src/backup.js";

function pastaTemporaria(t) {
  const pasta = mkdtempSync(join(tmpdir(), "rebanho-backup-"));
  t.after(() => rmSync(pasta, { recursive: true, force: true }));
  return pasta;
}

test("gera cópia do banco com os dados, nomeada pela data", (t) => {
  const pasta = pastaTemporaria(t);
  const banco = abrirBanco();
  criarPessoa(banco, { nome: "Ana Souza", situacao: "membro_ativo" });

  const arquivo = criarBackup(banco, pasta, { hoje: "2026-11-23" });

  assert.equal(arquivo, join(pasta, "rebanho-2026-11-23.db"));
  assert.deepEqual(listarPessoas(abrirBanco(arquivo)).map((p) => p.nome), ["Ana Souza"]);
});

test("mantém só os backups mais recentes", (t) => {
  const pasta = pastaTemporaria(t);
  for (const dia of ["01", "02", "03"]) writeFileSync(join(pasta, `rebanho-2026-11-${dia}.db`), "");

  criarBackup(abrirBanco(), pasta, { hoje: "2026-11-04", manter: 2 });

  assert.deepEqual(readdirSync(pasta).sort(), ["rebanho-2026-11-03.db", "rebanho-2026-11-04.db"]);
});

test("refazer o backup no mesmo dia substitui o arquivo do dia", (t) => {
  const pasta = pastaTemporaria(t);
  const banco = abrirBanco();
  criarBackup(banco, pasta, { hoje: "2026-11-23" });
  criarPessoa(banco, { nome: "Bruno Lima", situacao: "visitante" });

  const arquivo = criarBackup(banco, pasta, { hoje: "2026-11-23" });

  assert.deepEqual(listarPessoas(abrirBanco(arquivo)).map((p) => p.nome), ["Bruno Lima"]);
});
