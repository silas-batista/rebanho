// Conta falhas de login por e-mail em memória. Basta para um único processo, que é o caso do Rebanho.
export class LimitadorDeTentativas {
  #falhas = new Map();

  constructor({ maximo = 5, janelaMs = 15 * 60 * 1000, agora = Date.now } = {}) {
    this.maximo = maximo;
    this.janelaMs = janelaMs;
    this.agora = agora;
  }

  bloqueado(chave) {
    return this.#recentes(chave).length >= this.maximo;
  }

  registrarFalha(chave) {
    this.#falhas.set(this.#normalizar(chave), [...this.#recentes(chave), this.agora()]);
  }

  limpar(chave) {
    this.#falhas.delete(this.#normalizar(chave));
  }

  #recentes(chave) {
    const limite = this.agora() - this.janelaMs;
    return (this.#falhas.get(this.#normalizar(chave)) ?? []).filter((momento) => momento > limite);
  }

  #normalizar(chave) {
    return String(chave ?? "").trim().toLowerCase();
  }
}
