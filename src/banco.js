import { DatabaseSync } from "node:sqlite";

const ESQUEMA = `
  CREATE TABLE IF NOT EXISTS pessoas (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    situacao TEXT NOT NULL CHECK (situacao IN ('visitante', 'membro_ativo', 'membro_inativo')),
    primeira_frequencia_em TEXT,
    recebido_como_membro_em TEXT,
    consentiu_contato_em TEXT
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY,
    pessoa_id INTEGER REFERENCES pessoas(id),
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    senha_hash TEXT NOT NULL,
    perfil TEXT NOT NULL CHECK (perfil IN ('secretaria', 'membro'))
  );
`;

export function abrirBanco(caminho = ":memory:") {
  const banco = new DatabaseSync(caminho);
  banco.exec(ESQUEMA);
  return banco;
}
