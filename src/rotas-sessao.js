import { Router } from "express";
import { autenticar, buscarUsuario } from "./usuarios.js";
import { LimitadorDeTentativas } from "./limitador.js";

export function carregarUsuario(banco) {
  return (req, res, next) => {
    const usuarioId = req.session?.usuarioId;
    req.usuario = usuarioId ? buscarUsuario(banco, usuarioId) : null;
    res.locals.usuario = req.usuario;
    if (req.usuario) req.session.ultimoAcesso = Math.floor(Date.now() / 60_000); // renova a expiração a cada minuto de uso
    next();
  };
}

export function exigirPerfil(...perfis) {
  return (req, res, next) => {
    if (!req.usuario) return res.redirect(303, "/entrar");
    if (!perfis.includes(req.usuario.perfil)) return res.status(403).render("proibido");
    next();
  };
}

export function rotasSessao(banco, limitador = new LimitadorDeTentativas()) {
  const rotas = Router();

  rotas.get("/entrar", (_req, res) => res.render("entrar", { erro: null, email: "" }));

  rotas.post("/entrar", (req, res) => {
    const email = req.body.email ?? "";
    if (limitador.bloqueado(email)) {
      return res.status(429).render("entrar", { erro: "Muitas tentativas. Tente novamente em 15 minutos.", email });
    }
    const usuario = autenticar(banco, email, req.body.senha);
    if (!usuario) {
      limitador.registrarFalha(email);
      return res.status(401).render("entrar", { erro: "E-mail ou senha incorretos", email });
    }
    limitador.limpar(email);
    req.session = { usuarioId: usuario.id };
    res.redirect(303, "/");
  });

  rotas.post("/sair", (req, res) => {
    req.session = null;
    res.redirect(303, "/entrar");
  });

  return rotas;
}
