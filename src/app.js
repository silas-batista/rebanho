import express from "express";
import { fileURLToPath } from "node:url";
import { rotasPessoas } from "./rotas-pessoas.js";

const raiz = (caminho) => fileURLToPath(new URL(`../${caminho}`, import.meta.url));

export function criarApp(banco) {
  const app = express();
  app.set("view engine", "ejs");
  app.set("views", raiz("views"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(raiz("public")));

  app.get("/", (_req, res) => res.redirect("/pessoas"));
  app.use("/pessoas", rotasPessoas(banco));
  return app;
}
