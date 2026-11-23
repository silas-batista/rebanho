export const VISIBILIDADES = ["publico", "membros"];

export class EventoInvalidoError extends Error {}

const HORARIO = /^\d{2}:\d{2}$/;
const DATA_HORA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

// Devolve os valores das colunas, na ordem de COLUNAS.
function validar(dados) {
  const titulo = dados.titulo?.trim();
  if (!titulo) throw new EventoInvalidoError("Título é obrigatório");

  let inicioEm = null;
  let diaSemana = null;
  let horario = null;

  if (dados.recorrencia === "semanal") {
    diaSemana = Number.parseInt(dados.diaSemana, 10);
    if (!(diaSemana >= 0 && diaSemana <= 6)) throw new EventoInvalidoError("Informe o dia da semana do culto");
    if (!HORARIO.test(dados.horario ?? "")) throw new EventoInvalidoError("Informe o horário do culto");
    horario = dados.horario;
  } else if (dados.recorrencia === "unica") {
    if (!DATA_HORA.test(dados.inicioEm ?? "")) throw new EventoInvalidoError("Informe a data e hora do evento");
    inicioEm = dados.inicioEm;
  } else {
    throw new EventoInvalidoError("Recorrência inválida");
  }

  const visibilidade = dados.visibilidade || "publico";
  if (!VISIBILIDADES.includes(visibilidade)) throw new EventoInvalidoError("Visibilidade inválida");

  return [titulo, dados.descricao || null, dados.local || null, dados.recorrencia, inicioEm, diaSemana, horario, visibilidade];
}

const COLUNAS = "titulo, descricao, local, recorrencia, inicio_em, dia_semana, horario, visibilidade";

export function criarEvento(banco, dados) {
  banco.prepare(`INSERT INTO eventos (${COLUNAS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(...validar(dados));
}

export function atualizarEvento(banco, id, dados) {
  const atribuicoes = COLUNAS.split(", ").map((coluna) => `${coluna} = ?`).join(", ");
  banco.prepare(`UPDATE eventos SET ${atribuicoes} WHERE id = ?`).run(...validar(dados), id);
}

export function excluirEvento(banco, id) {
  banco.prepare("DELETE FROM eventos WHERE id = ?").run(id);
}

export function buscarEvento(banco, id) {
  const linha = banco.prepare("SELECT * FROM eventos WHERE id = ?").get(id);
  return linha ? paraEvento(linha) : null;
}

// Por padrão só eventos públicos: endereços de pequenos grupos nas casas dos membros não podem vazar.
export function listarEventos(banco, { incluirRestritos = false } = {}) {
  const sql = incluirRestritos
    ? "SELECT * FROM eventos ORDER BY titulo"
    : "SELECT * FROM eventos WHERE visibilidade = 'publico' ORDER BY titulo";
  return banco.prepare(sql).all().map(paraEvento);
}

function paraEvento(linha) {
  return {
    id: linha.id,
    titulo: linha.titulo,
    descricao: linha.descricao,
    local: linha.local,
    recorrencia: linha.recorrencia,
    inicioEm: linha.inicio_em,
    diaSemana: linha.dia_semana,
    horario: linha.horario,
    visibilidade: linha.visibilidade,
  };
}
