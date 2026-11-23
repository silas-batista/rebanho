import { DatabaseSync } from "node:sqlite";

const ESQUEMA = `
  CREATE TABLE IF NOT EXISTS pessoas (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    situacao TEXT NOT NULL CHECK (situacao IN ('visitante', 'membro_ativo', 'membro_inativo')),
    primeira_conversa_pastoral_em TEXT,
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

  CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    local TEXT,
    recorrencia TEXT NOT NULL CHECK (recorrencia IN ('unica', 'semanal')),
    inicio_em TEXT,
    dia_semana INTEGER CHECK (dia_semana BETWEEN 0 AND 6),
    horario TEXT,
    visibilidade TEXT NOT NULL DEFAULT 'publico' CHECK (visibilidade IN ('publico', 'membros'))
  );

  CREATE TABLE IF NOT EXISTS projetos_missionarios (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    local TEXT,
    descricao TEXT,
    ativo INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS missionarios (
    id INTEGER PRIMARY KEY,
    projeto_missionario_id INTEGER NOT NULL REFERENCES projetos_missionarios(id),
    nome TEXT NOT NULL
  );
`;

export function abrirBanco(caminho = ":memory:") {
  const banco = new DatabaseSync(caminho);
  banco.exec("PRAGMA foreign_keys = ON");
  banco.exec(ESQUEMA);
  return banco;
}
