import { Router } from "express";
import {
  criarProjeto,
  buscarProjeto,
  atualizarProjeto,
  excluirProjeto,
  adicionarMissionario,
  removerMissionario,
  listarProjetos,
  MissaoInvalidaError,
} from "./missoes.js";
import { exigirPerfil } from "./rotas-sessao.js";

export function rotasMissoes(banco) {
  const rotas = Router();
  const secretaria = exigirPerfil("secretaria");
  const mostrarLista = (res, erro = null) => res.render("missoes/index", { projetos: listarProjetos(banco), erro });
  const formulario = (res, { id = null, dados, erro = null }) =>
    res.render("missoes/formulario", {
      titulo: id ? "Editar projeto missionário" : "Novo projeto missionário",
      acao: id ? `/missoes/${id}` : "/missoes",
      id,
      dados,
      erro,
    });

  rotas.get("/", (_req, res) => mostrarLista(res));

  rotas.get("/novo", secretaria, (_req, res) => formulario(res, { dados: {} }));

  rotas.post("/", secretaria, (req, res) => {
    try {
      criarProjeto(banco, req.body);
      res.redirect(303, "/missoes?ok=projeto");
    } catch (erro) {
      if (!(erro instanceof MissaoInvalidaError)) throw erro;
      formulario(res.status(422), { dados: req.body, erro: erro.message });
    }
  });

  rotas.post("/missionarios/:id/excluir", secretaria, (req, res) => {
    removerMissionario(banco, Number(req.params.id));
    res.redirect(303, "/missoes?ok=removido");
  });

  rotas.get("/:id/editar", secretaria, (req, res, next) => {
    const projeto = buscarProjeto(banco, Number(req.params.id));
    if (!projeto) return next();
    formulario(res, { id: projeto.id, dados: projeto });
  });

  rotas.post("/:id", secretaria, (req, res) => {
    const id = Number(req.params.id);
    try {
      atualizarProjeto(banco, id, req.body);
      res.redirect(303, "/missoes?ok=projeto");
    } catch (erro) {
      if (!(erro instanceof MissaoInvalidaError)) throw erro;
      formulario(res.status(422), { id, dados: req.body, erro: erro.message });
    }
  });

  rotas.post("/:id/excluir", secretaria, (req, res, next) => {
    const projeto = buscarProjeto(banco, Number(req.params.id));
    if (!projeto) return next();
    if (req.body.confirmar !== "sim") {
      return formulario(res.status(422), { id: projeto.id, dados: projeto, erro: "Marque a confirmação para excluir." });
    }
    excluirProjeto(banco, projeto.id);
    res.redirect(303, "/missoes?ok=excluido");
  });

  rotas.post("/:id/missionarios", secretaria, (req, res) => {
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
