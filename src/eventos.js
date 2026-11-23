export class EventoInvalidoError extends Error {}

const HORARIO = /^\d{2}:\d{2}$/;
const DATA_HORA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export function criarEvento(banco, dados) {
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

  banco
    .prepare(
      `INSERT INTO eventos (titulo, descricao, local, recorrencia, inicio_em, dia_semana, horario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(titulo, dados.descricao || null, dados.local || null, dados.recorrencia, inicioEm, diaSemana, horario);
}

export function listarEventos(banco) {
  return banco
    .prepare("SELECT * FROM eventos ORDER BY titulo")
    .all()
    .map((linha) => ({
      id: linha.id,
      titulo: linha.titulo,
      descricao: linha.descricao,
      local: linha.local,
      recorrencia: linha.recorrencia,
      inicioEm: linha.inicio_em,
      diaSemana: linha.dia_semana,
      horario: linha.horario,
    }));
}
