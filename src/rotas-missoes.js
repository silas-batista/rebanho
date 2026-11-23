import { Router } from "express";
import { criarProjeto, adicionarMissionario, listarProjetos, MissaoInvalidaError } from "./missoes.js";
import { exigirPerfil } from "./rotas-sessao.js";

export function rotasMissoes(banco) {
  const rotas = Router();
  const mostrarLista = (res, erro = null) => res.render("missoes/index", { projetos: listarProjetos(banco), erro });

  rotas.get("/", (_req, res) => mostrarLista(res));

  rotas.get("/novo", exigirPerfil("secretaria"), (_req, res) => {
    res.render("missoes/novo", { erro: null, dados: {} });
  });

  rotas.post("/", exigirPerfil("secretaria"), (req, res) => {
    try {
      criarProjeto(banco, req.body);
      res.redirect(303, "/missoes?ok=projeto");
    } catch (erro) {
      if (!(erro instanceof MissaoInvalidaError)) throw erro;
      res.status(422).render("missoes/novo", { erro: erro.message, dados: req.body });
    }
  });

  rotas.post("/:id/missionarios", exigirPerfil("secretaria"), (req, res) => {
    try {
      adicionarMissionario(banco, Number(req.params.id), req.body);
      res.redirect(303, "/missoes?ok=missionario");
    } catch (erro) {
      if (!(erro instanceof MissaoInvalidaError)) throw erro;
      mostrarLista(res.status(422), erro.message);
    }
  });

  return rotas;
}
