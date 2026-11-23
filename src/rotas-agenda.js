import { Router } from "express";
import { hojeNaIgreja, ocorrenciasNoPeriodo } from "./agenda.js";
import { criarEvento, buscarEvento, atualizarEvento, excluirEvento, listarEventos, EventoInvalidoError } from "./eventos.js";
import { exigirPerfil } from "./rotas-sessao.js";

const DIAS_NA_AGENDA = 30;
export const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function rotasAgenda(banco) {
  const rotas = Router();
  const secretaria = exigirPerfil("secretaria");
  const formulario = (res, { id = null, dados, erro = null }) =>
    res.render("agenda/formulario", {
      titulo: id ? "Editar evento" : "Novo evento",
      acao: id ? `/agenda/${id}` : "/agenda",
      id,
      dados,
      erro,
      diasSemana: DIAS_SEMANA,
    });
  const tentar = (acao, emErro) => {
    try {
      acao();
    } catch (erro) {
      if (!(erro instanceof EventoInvalidoError)) throw erro;
      emErro(erro.message);
    }
  };

  rotas.get("/", (req, res) => {
    const eventos = listarEventos(banco, { incluirRestritos: Boolean(req.usuario) });
    res.render("agenda/index", {
      ocorrencias: ocorrenciasNoPeriodo(eventos, hojeNaIgreja(), DIAS_NA_AGENDA),
      dias: DIAS_NA_AGENDA,
      formatarData,
    });
  });

  rotas.get("/novo", secretaria, (_req, res) => formulario(res, { dados: { recorrencia: "semanal" } }));

  rotas.post("/", secretaria, (req, res) =>
    tentar(
      () => {
        criarEvento(banco, req.body);
        res.redirect(303, "/agenda?ok=evento");
      },
      (erro) => formulario(res.status(422), { dados: req.body, erro }),
    ),
  );

  rotas.get("/:id/editar", secretaria, (req, res, next) => {
    const evento = buscarEvento(banco, Number(req.params.id));
    if (!evento) return next();
    formulario(res, { id: evento.id, dados: evento });
  });

  rotas.post("/:id", secretaria, (req, res) => {
    const id = Number(req.params.id);
    tentar(
      () => {
        atualizarEvento(banco, id, req.body);
        res.redirect(303, "/agenda?ok=evento");
      },
      (erro) => formulario(res.status(422), { id, dados: req.body, erro }),
    );
  });

  rotas.post("/:id/excluir", secretaria, (req, res, next) => {
    const evento = buscarEvento(banco, Number(req.params.id));
    if (!evento) return next();
    if (req.body.confirmar !== "sim") {
      return formulario(res.status(422), { id: evento.id, dados: evento, erro: "Marque a confirmação para excluir." });
    }
    excluirEvento(banco, evento.id);
    res.redirect(303, "/agenda?ok=excluido");
  });

  return rotas;
}

function formatarData(data) {
  const [, mes, dia] = data.split("-");
  const semana = DIAS_SEMANA[new Date(`${data}T00:00:00Z`).getUTCDay()].slice(0, 3).toUpperCase();
  return `${semana} ${dia}/${mes}`;
}
