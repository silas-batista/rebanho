import { Router } from "express";
import { mesesDeFrequencia, MESES_PARA_MEMBRESIA } from "./membresia.js";
import {
  criarPessoa,
  buscarPessoa,
  atualizarPessoa,
  listarPessoas,
  listarAptasAMembresia,
  PessoaInvalidaError,
  SITUACOES,
} from "./pessoas.js";

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
      mesesDeFrequencia,
      mesesParaMembresia: MESES_PARA_MEMBRESIA,
    });
  });

  const formulario = (res, { titulo, acao, dados, erro = null }) =>
    res.render("pessoas/formulario", { titulo, acao, dados, erro, rotulos: ROTULOS_SITUACAO });
  const doFormulario = (corpo) => ({ ...corpo, consentiuContato: corpo.consentiuContato === "sim" });

  rotas.get("/nova", (_req, res) => formulario(res, { titulo: "Nova pessoa", acao: "/pessoas", dados: {} }));

  rotas.post("/", (req, res) => {
    try {
      criarPessoa(banco, doFormulario(req.body));
      res.redirect(303, "/pessoas?ok=pessoa");
    } catch (erro) {
      if (!(erro instanceof PessoaInvalidaError)) throw erro;
      formulario(res.status(422), { titulo: "Nova pessoa", acao: "/pessoas", dados: doFormulario(req.body), erro: erro.message });
    }
  });

  rotas.get("/:id/editar", (req, res, next) => {
    const pessoa = buscarPessoa(banco, Number(req.params.id));
    if (!pessoa) return next();
    formulario(res, {
      titulo: "Editar pessoa",
      acao: `/pessoas/${pessoa.id}`,
      dados: {
        ...pessoa,
        primeiraFrequenciaEm: pessoa.primeiraFrequenciaEm?.toISOString().slice(0, 10),
        consentiuContato: Boolean(pessoa.consentiuContatoEm),
      },
    });
  });

  rotas.post("/:id", (req, res) => {
    const id = Number(req.params.id);
    try {
      atualizarPessoa(banco, id, doFormulario(req.body));
      res.redirect(303, "/pessoas?ok=pessoa");
    } catch (erro) {
      if (!(erro instanceof PessoaInvalidaError)) throw erro;
      formulario(res.status(422), { titulo: "Editar pessoa", acao: `/pessoas/${id}`, dados: doFormulario(req.body), erro: erro.message });
    }
  });

  return rotas;
}
