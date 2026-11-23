import { Router } from "express";
import { criarUsuario, listarUsuarios, alterarSenha, UsuarioInvalidoError } from "./usuarios.js";
import { exigirPerfil } from "./rotas-sessao.js";

export function rotasUsuarios(banco) {
  const rotas = Router();
  const gestao = (res, { erro = null, dados = {} } = {}) =>
    res.render("usuarios/index", { usuarios: listarUsuarios(banco), erro, dados });
  const senha = (res, { erro = null, sucesso = false } = {}) => res.render("usuarios/minha-senha", { erro, sucesso });

  rotas.get("/usuarios", exigirPerfil("secretaria"), (_req, res) => gestao(res));

  rotas.post("/usuarios", exigirPerfil("secretaria"), (req, res) => {
    try {
      criarUsuario(banco, req.body);
      res.redirect(303, "/usuarios");
    } catch (erro) {
      if (!(erro instanceof UsuarioInvalidoError)) throw erro;
      gestao(res.status(422), { erro: erro.message, dados: { email: req.body.email, perfil: req.body.perfil } });
    }
  });

  rotas.get("/minha-senha", exigirPerfil("secretaria", "membro"), (req, res) => senha(res, { sucesso: "ok" in req.query }));

  rotas.post("/minha-senha", exigirPerfil("secretaria", "membro"), (req, res) => {
    try {
      alterarSenha(banco, req.usuario.id, req.body);
      res.redirect(303, "/minha-senha?ok");
    } catch (erro) {
      if (!(erro instanceof UsuarioInvalidoError)) throw erro;
      senha(res.status(422), { erro: erro.message });
    }
  });

  return rotas;
}
