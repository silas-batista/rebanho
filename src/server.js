import { abrirBanco } from "./banco.js";
import { criarApp } from "./app.js";

const porta = process.env.PORT || 3000;
const banco = abrirBanco(process.env.BANCO || "rebanho.db");
const segredoSessao = process.env.SEGREDO_SESSAO;

if (!segredoSessao) {
  console.error("Defina SEGREDO_SESSAO (texto longo e aleatório) para assinar os cookies de sessão.");
  process.exit(1);
}

criarApp(banco, { segredoSessao }).listen(porta, () => console.log(`Rebanho em http://localhost:${porta}`));
