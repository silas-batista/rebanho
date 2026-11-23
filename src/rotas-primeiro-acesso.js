import { Router } from "express";
import { timingSafeEqual } from "node:crypto";
import { criarUsuario, listarUsuarios, autenticar, UsuarioInvalidoError } from "./usuarios.js";

// Cria a primeira secretaria pelo navegador. Só funciona enquanto não houver nenhum usuário
// e exige o código de uso único que o servidor mostra ao iniciar.
export function rotasPrimeiroAcesso(banco, codigoPrimeiroAcesso) {
  const rotas = Router();
  const disponivel = () => Boolean(codigoPrimeiroAcesso) && listarUsuarios(banco).length === 0;
  const formulario = (res, erro = null, email = "") => res.render("primeiro-acesso", { erro, email });

  rotas.use("/primeiro-acesso", (_req, _res, next) => (disponivel() ? next() : next("router")));

  rotas.get("/primeiro-acesso", (_req, res) => formulario(res));

  rotas.post("/primeiro-acesso", (req, res) => {
    const { codigo = "", email, senha } = req.body;
    if (!codigoConfere(codigo, codigoPrimeiroAcesso)) {
      return formulario(res.status(403), "Código de primeiro acesso incorreto", email);
    }
    try {
      criarUsuario(banco, { email, senha, perfil: "secretaria" });
    } catch (erro) {
      if (!(erro instanceof UsuarioInvalidoError)) throw erro;
      return formulario(res.status(422), erro.message, email);
    }
    req.session = { usuarioId: autenticar(banco, email, senha).id };
    res.redirect(303, "/pessoas");
  });

  return rotas;
}

function codigoConfere(recebido, esperado) {
  const a = Buffer.from(String(recebido));
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}
