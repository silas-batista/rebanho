// Datas como texto "AAAA-MM-DD" e horários como "HH:MM", no fuso da igreja, para evitar erros de fuso horário.
export const FUSO_IGREJA = "America/Sao_Paulo";

export function hojeNaIgreja(agora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO_IGREJA }).format(agora);
}

export function ocorrenciasNoPeriodo(eventos, inicio, dias) {
  const datas = Array.from({ length: dias }, (_, i) => somarDias(inicio, i));
  const ocorrencias = eventos.flatMap((evento) =>
    evento.recorrencia === "semanal"
      ? datas.filter((data) => diaDaSemana(data) === evento.diaSemana).map((data) => ({ ...evento, data, horario: evento.horario }))
      : datas.includes(evento.inicioEm.slice(0, 10))
        ? [{ ...evento, data: evento.inicioEm.slice(0, 10), horario: evento.inicioEm.slice(11, 16) }]
        : [],
  );
  return ocorrencias.sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`));
}

function somarDias(data, quantidade) {
  const dia = new Date(`${data}T00:00:00Z`);
  dia.setUTCDate(dia.getUTCDate() + quantidade);
  return dia.toISOString().slice(0, 10);
}

function diaDaSemana(data) {
  return new Date(`${data}T00:00:00Z`).getUTCDay();
}
