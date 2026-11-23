import { createInterface } from "node:readline/promises";
import { abrirBanco } from "./banco.js";
import { criarUsuario, PERFIS } from "./usuarios.js";

const [email, perfil] = process.argv.slice(2);
if (!email || !PERFIS.includes(perfil)) {
  console.error(`Uso: npm run criar-usuario -- <email> <${PERFIS.join("|")}>`);
  process.exit(1);
}

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const senha = await terminal.question("Senha (mínimo 8 caracteres): ");
terminal.close();

criarUsuario(abrirBanco(process.env.BANCO || "rebanho.db"), { email, senha, perfil });
console.log(`Usuário ${email} (${perfil}) criado.`);
