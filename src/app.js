import express from "express";
import cookieSession from "cookie-session";
import { fileURLToPath } from "node:url";
import { rotasPessoas } from "./rotas-pessoas.js";
import { rotasAgenda } from "./rotas-agenda.js";
import { rotasMissoes } from "./rotas-missoes.js";
import { listarContatos } from "./pessoas.js";
import { rotasUsuarios } from "./rotas-usuarios.js";
import { rotasPrimeiroAcesso } from "./rotas-primeiro-acesso.js";
import { rotasSessao, carregarUsuario, exigirPerfil } from "./rotas-sessao.js";

const raiz = (caminho) => fileURLToPath(new URL(`../${caminho}`, import.meta.url));
const DUAS_HORAS = 2 * 60 * 60 * 1000;

// Mensagens fixas: a URL só escolhe uma delas, nunca injeta texto na página.
const AVISOS = {
  pessoa: "Pessoa salva.",
  evento: "Evento salvo.",
  projeto: "Projeto salvo.",
  missionario: "Missionário adicionado.",
  usuario: "Acesso criado.",
  senha: "Senha alterada.",
  excluido: "Item excluído.",
  removido: "Missionário removido.",
};

export function criarApp(banco, { segredoSessao, codigoPrimeiroAcesso }) {
  if (!segredoSessao) throw new Error("segredoSessao é obrigatório");

  const app = express();
  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "same-origin",
    });
    next();
  });
  app.get("/saude", (_req, res) => {
    try {
      banco.prepare("SELECT 1").get();
      res.json({ status: "ok" });
    } catch {
      res.status(503).json({ status: "banco indisponível" });
    }
  });

  app.set("view engine", "ejs");
  app.set("views", raiz("views"));
  app.set("trust proxy", 1);
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(raiz("public")));
  app.use(
    cookieSession({
      name: "rebanho",
      keys: [segredoSessao],
      maxAge: DUAS_HORAS,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    }),
  );
  app.use(carregarUsuario(banco));
  app.use((req, res, next) => {
    res.locals.aviso = Object.hasOwn(AVISOS, req.query.ok) ? AVISOS[req.query.ok] : null;
    next();
  });

  app.get("/", (_req, res) => res.redirect("/agenda"));
  app.use(rotasSessao(banco));
  app.use(rotasPrimeiroAcesso(banco, codigoPrimeiroAcesso));
  app.use("/agenda", rotasAgenda(banco));
  app.use("/missoes", rotasMissoes(banco));
  app.use(rotasUsuarios(banco));
  app.use("/pessoas", exigirPerfil("secretaria"), rotasPessoas(banco));
  app.get("/contatos", exigirPerfil("secretaria", "membro"), (_req, res) => {
    res.render("contatos", { contatos: listarContatos(banco) });
  });

  app.use((_req, res) => {
    res.status(404).render("erro", { titulo: "Página não encontrada", mensagem: "O endereço pode ter mudado ou não existir mais." });
  });
  app.use((erro, _req, res, _next) => {
    console.error(erro);
    res.status(500).render("erro", { titulo: "Algo deu errado", mensagem: "Tente de novo em alguns minutos. Se continuar, avise a secretaria." });
  });
  return app;
}
