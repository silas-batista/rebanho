import { Router } from "express";
import { criarPessoa, listarPessoas, listarAptasAMembresia, PessoaInvalidaError, SITUACOES } from "./pessoas.js";

export const ROTULOS_SITUACAO = {
  visitante: "Visitante",
  membro_ativo: "Membro ativo",
  membro_inativo: "Membro inativo",
};

export function rotasPessoas(banco) {
  const rotas = Router();

  rotas.get("/", (req, res) => {
    const situacao = SITUACOES.includes(req.query.situacao) ? req.query.situacao : undefined;
    res.render("pessoas/index", {
      pessoas: listarPessoas(banco, { situacao }),
      situacao,
      totalAtivos: listarPessoas(banco, { situacao: "membro_ativo" }).length,
      aptas: listarAptasAMembresia(banco),
      rotulos: ROTULOS_SITUACAO,
    });
  });

  rotas.get("/nova", (_req, res) => {
    res.render("pessoas/nova", { erro: null, dados: {}, rotulos: ROTULOS_SITUACAO });
  });

  rotas.post("/", (req, res) => {
    try {
      criarPessoa(banco, { ...req.body, consentiuContato: req.body.consentiuContato === "sim" });
      res.redirect(303, "/pessoas");
    } catch (erro) {
      if (!(erro instanceof PessoaInvalidaError)) throw erro;
      res.status(422).render("pessoas/nova", { erro: erro.message, dados: req.body, rotulos: ROTULOS_SITUACAO });
    }
  });

  return rotas;
}
