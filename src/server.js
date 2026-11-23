import { abrirBanco } from "./banco.js";
import { criarApp } from "./app.js";

const porta = process.env.PORT || 3000;
const banco = abrirBanco(process.env.BANCO || "rebanho.db");

criarApp(banco).listen(porta, () => console.log(`Rebanho em http://localhost:${porta}`));
