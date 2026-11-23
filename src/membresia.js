export const MESES_PARA_MEMBRESIA = 6;

export function dataAptidao(primeiraConversaPastoralEm) {
  const data = new Date(primeiraConversaPastoralEm);
  data.setUTCMonth(data.getUTCMonth() + MESES_PARA_MEMBRESIA);
  return data;
}

export function aptaAMembresia(pessoa, hoje = new Date()) {
  if (pessoa.situacao !== "visitante" || !pessoa.primeiraConversaPastoralEm) return false;
  return dataAptidao(pessoa.primeiraConversaPastoralEm) <= hoje;
}

export function mesesDesde(data, hoje = new Date()) {
  const inicio = new Date(data);
  const meses = (hoje.getUTCFullYear() - inicio.getUTCFullYear()) * 12 + hoje.getUTCMonth() - inicio.getUTCMonth();
  return hoje.getUTCDate() < inicio.getUTCDate() ? meses - 1 : meses;
}
