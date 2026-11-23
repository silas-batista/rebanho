import express from "express";
import cookieSession from "cookie-session";
import { fileURLToPath } from "node:url";
import { rotasPessoas } from "./rotas-pessoas.js";
import { rotasSessao, carregarUsuario, exigirPerfil } from "./rotas-sessao.js";

const raiz = (caminho) => fileURLToPath(new URL(`../${caminho}`, import.meta.url));
const DUAS_HORAS = 2 * 60 * 60 * 1000;

export function criarApp(banco, { segredoSessao }) {
  if (!segredoSessao) throw new Error("segredoSessao é obrigatório");

  const app = express();
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

  app.get("/", (_req, res) => res.redirect("/pessoas"));
  app.use(rotasSessao(banco));
  app.use("/pessoas", exigirPerfil("secretaria"), rotasPessoas(banco));
  return app;
}
