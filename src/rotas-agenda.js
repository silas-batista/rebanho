import { Router } from "express";
import { hojeNaIgreja, ocorrenciasNoPeriodo } from "./agenda.js";
import { criarEvento, listarEventos, EventoInvalidoError } from "./eventos.js";
import { exigirPerfil } from "./rotas-sessao.js";

const DIAS_NA_AGENDA = 30;
export const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function rotasAgenda(banco) {
  const rotas = Router();

  rotas.get("/", (req, res) => {
    const eventos = listarEventos(banco, { incluirRestritos: Boolean(req.usuario) });
    res.render("agenda/index", {
      ocorrencias: ocorrenciasNoPeriodo(eventos, hojeNaIgreja(), DIAS_NA_AGENDA),
      dias: DIAS_NA_AGENDA,
      formatarData,
    });
  });

  rotas.get("/novo", exigirPerfil("secretaria"), (_req, res) => {
    res.render("agenda/novo", { erro: null, dados: { recorrencia: "semanal" }, diasSemana: DIAS_SEMANA });
  });

  rotas.post("/", exigirPerfil("secretaria"), (req, res) => {
    try {
      criarEvento(banco, req.body);
      res.redirect(303, "/agenda");
    } catch (erro) {
      if (!(erro instanceof EventoInvalidoError)) throw erro;
      res.status(422).render("agenda/novo", { erro: erro.message, dados: req.body, diasSemana: DIAS_SEMANA });
    }
  });

  return rotas;
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  const semana = DIAS_SEMANA[new Date(`${data}T00:00:00Z`).getUTCDay()].slice(0, 3).toUpperCase();
  return `${semana} ${dia}/${mes}`;
}
