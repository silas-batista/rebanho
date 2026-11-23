import { Router } from "express";
import { criarUsuario, listarUsuarios, alterarSenha, UsuarioInvalidoError } from "./usuarios.js";
import { exigirPerfil } from "./rotas-sessao.js";

export function rotasUsuarios(banco) {
  const rotas = Router();
  const gestao = (res, { erro = null, dados = {} } = {}) =>
    res.render("usuarios/index", { usuarios: listarUsuarios(banco), erro, dados });
  const senha = (res, erro = null) => res.render("usuarios/minha-senha", { erro });

  rotas.get("/usuarios", exigirPerfil("secretaria"), (_req, res) => gestao(res));

  rotas.post("/usuarios", exigirPerfil("secretaria"), (req, res) => {
    try {
      criarUsuario(banco, req.body);
      res.redirect(303, "/usuarios?ok=usuario");
    } catch (erro) {
      if (!(erro instanceof UsuarioInvalidoError)) throw erro;
      gestao(res.status(422), { erro: erro.message, dados: { email: req.body.email, perfil: req.body.perfil } });
    }
  });

  rotas.get("/minha-senha", exigirPerfil("secretaria", "membro"), (_req, res) => senha(res));

  rotas.post("/minha-senha", exigirPerfil("secretaria", "membro"), (req, res) => {
    try {
      alterarSenha(banco, req.usuario.id, req.body);
      res.redirect(303, "/minha-senha?ok=senha");
    } catch (erro) {
      if (!(erro instanceof UsuarioInvalidoError)) throw erro;
      senha(res.status(422), erro.message);
    }
  });

  return rotas;
}
