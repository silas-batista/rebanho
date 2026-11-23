import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { hojeNaIgreja } from "./agenda.js";

const PADRAO = /^rebanho-\d{4}-\d{2}-\d{2}\.db$/;

// VACUUM INTO gera uma cópia consistente mesmo com o sistema em uso.
export function criarBackup(banco, pasta, { hoje = hojeNaIgreja(), manter = 14 } = {}) {
  mkdirSync(pasta, { recursive: true });
  const arquivo = join(pasta, `rebanho-${hoje}.db`);
  rmSync(arquivo, { force: true });
  banco.prepare("VACUUM INTO ?").run(arquivo);

  const antigos = readdirSync(pasta).filter((nome) => PADRAO.test(nome)).sort().slice(0, -manter);
  for (const nome of antigos) rmSync(join(pasta, nome));
  return arquivo;
}
