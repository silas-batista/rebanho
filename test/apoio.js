import { abrirBanco } from "../src/banco.js";
import { criarApp } from "../src/app.js";
import { criarUsuario } from "../src/usuarios.js";

export const SENHA = "ovelha123";

export function bancoComUsuarios() {
  const banco = abrirBanco();
  criarUsuario(banco, { email: "secretaria@ipvf.org", senha: SENHA, perfil: "secretaria" });
  criarUsuario(banco, { email: "membro@ipvf.org", senha: SENHA, perfil: "membro" });
  return banco;
}

export async function iniciarServidor(t, banco) {
  const http = criarApp(banco, { segredoSessao: "segredo-de-teste" }).listen(0);
  await new Promise((resolve) => http.once("listening", resolve));
  t.after(() => http.close());
  return `http://localhost:${http.address().port}`;
}

export async function entrar(url, email, senha = SENHA) {
  const resposta = await fetch(`${url}/entrar`, {
    method: "POST",
    body: new URLSearchParams({ email, senha }),
    redirect: "manual",
  });
  return { resposta, cookie: resposta.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ") };
}
