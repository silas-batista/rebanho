import { aptaAMembresia } from "./membresia.js";

export const SITUACOES = ["visitante", "membro_ativo", "membro_inativo"];

export class PessoaInvalidaError extends Error {}

export function criarPessoa(banco, dados) {
  const nome = dados.nome?.trim();
  if (!nome) throw new PessoaInvalidaError("Nome é obrigatório");
  if (!SITUACOES.includes(dados.situacao)) throw new PessoaInvalidaError("Situação inválida");

  banco
    .prepare(
      `INSERT INTO pessoas (nome, telefone, email, situacao, primeira_frequencia_em, consentiu_contato_em)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      nome,
      dados.telefone || null,
      dados.email || null,
      dados.situacao,
      dados.primeiraFrequenciaEm || null,
      dados.consentiuContato ? new Date().toISOString() : null,
    );
}

export function listarPessoas(banco, { situacao } = {}) {
  const linhas = situacao
    ? banco.prepare("SELECT * FROM pessoas WHERE situacao = ? ORDER BY nome").all(situacao)
    : banco.prepare("SELECT * FROM pessoas ORDER BY nome").all();
  return linhas.map(paraPessoa);
}

export function listarAptasAMembresia(banco, hoje = new Date()) {
  return listarPessoas(banco, { situacao: "visitante" }).filter((pessoa) => aptaAMembresia(pessoa, hoje));
}

function paraPessoa(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    telefone: linha.telefone,
    email: linha.email,
    situacao: linha.situacao,
    primeiraFrequenciaEm: linha.primeira_frequencia_em && new Date(linha.primeira_frequencia_em),
    consentiuContatoEm: linha.consentiu_contato_em && new Date(linha.consentiu_contato_em),
  };
}
