export const MESES_PARA_MEMBRESIA = 6;

export function dataAptidao(primeiraFrequenciaEm) {
  const data = new Date(primeiraFrequenciaEm);
  data.setUTCMonth(data.getUTCMonth() + MESES_PARA_MEMBRESIA);
  return data;
}

export function aptaAMembresia(pessoa, hoje = new Date()) {
  if (pessoa.situacao !== "visitante" || !pessoa.primeiraFrequenciaEm) return false;
  return dataAptidao(pessoa.primeiraFrequenciaEm) <= hoje;
}
