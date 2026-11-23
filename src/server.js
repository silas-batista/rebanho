import { abrirBanco } from "./banco.js";
import { criarApp } from "./app.js";
import { criarBackup } from "./backup.js";
import { listarUsuarios } from "./usuarios.js";
import { randomBytes } from "node:crypto";

const porta = process.env.PORT || 3000;
const banco = abrirBanco(process.env.BANCO || "rebanho.db");
const segredoSessao = process.env.SEGREDO_SESSAO;
const pastaBackup = process.env.PASTA_BACKUP;
const UM_DIA = 24 * 60 * 60 * 1000;

if (!segredoSessao) {
  console.error("Defina SEGREDO_SESSAO (texto longo e aleatório) para assinar os cookies de sessão.");
  process.exit(1);
}

if (pastaBackup) {
  const fazerBackup = () => console.log(`Backup salvo em ${criarBackup(banco, pastaBackup)}`);
  fazerBackup();
  setInterval(fazerBackup, UM_DIA);
}

// Sem nenhum usuário, gera um código de uso único para criar a primeira secretaria pelo navegador.
const codigoPrimeiroAcesso = listarUsuarios(banco).length === 0 ? randomBytes(16).toString("hex") : undefined;

criarApp(banco, { segredoSessao, codigoPrimeiroAcesso }).listen(porta, () => {
  console.log(`Rebanho em http://localhost:${porta}`);
  if (codigoPrimeiroAcesso) console.log(`Primeiro acesso: abra /primeiro-acesso e use o código ${codigoPrimeiroAcesso}`);
});
