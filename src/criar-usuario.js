import { createInterface } from "node:readline/promises";
import { resolve } from "node:path";
import { abrirBanco } from "./banco.js";
import { criarUsuario, PERFIS, UsuarioInvalidoError } from "./usuarios.js";

const [email, perfil] = process.argv.slice(2);
if (!email || !PERFIS.includes(perfil)) {
  console.error(`Uso: npm run criar-usuario -- <email> <${PERFIS.join("|")}>`);
  process.exit(1);
}

const caminhoBanco = resolve(process.env.BANCO || "rebanho.db");
console.log(`Banco: ${caminhoBanco}`);

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const senha = await terminal.question("Senha (mínimo 8 caracteres): ");
terminal.close();

try {
  criarUsuario(abrirBanco(caminhoBanco), { email, senha, perfil });
  console.log(`Usuário ${email} (${perfil}) criado.`);
} catch (erro) {
  if (!(erro instanceof UsuarioInvalidoError)) throw erro;
  console.error(`Não criado: ${erro.message}.`);
  process.exit(1);
}
