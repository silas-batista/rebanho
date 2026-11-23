import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const TAMANHO_CHAVE = 64;

export function gerarHash(senha) {
  const salt = randomBytes(16).toString("hex");
  const chave = scryptSync(senha, salt, TAMANHO_CHAVE).toString("hex");
  return `${salt}:${chave}`;
}

export function conferirSenha(senha, hash) {
  const [salt, chave] = hash.split(":");
  const esperada = Buffer.from(chave, "hex");
  return timingSafeEqual(scryptSync(senha, salt, TAMANHO_CHAVE), esperada);
}
