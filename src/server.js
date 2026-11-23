import { abrirBanco } from "./banco.js";
import { criarApp } from "./app.js";
import { criarBackup } from "./backup.js";

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

criarApp(banco, { segredoSessao }).listen(porta, () => console.log(`Rebanho em http://localhost:${porta}`));
