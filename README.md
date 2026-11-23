# Rebanho

Sistema web de gestão para igrejas locais: membros, contatos, agenda de cultos e eventos, e projetos missionários.

Projeto da disciplina **Projeto de Software** (CST em Análise e Desenvolvimento de Sistemas, Cruzeiro do Sul Virtual), desenvolvido com a Igreja Presbiteriana de Vila Formosa (Anápolis/GO).

## Requisitos

- Node.js 24 ou superior

## Como rodar

```sh
npm install
npm start          # http://localhost:3000
npm test           # testes automatizados
```

Variáveis opcionais: `PORT` (padrão 3000) e `BANCO` (caminho do arquivo SQLite, padrão `rebanho.db`).

## Stack

Express, EJS, SQLite (`node:sqlite`), testes com `node:test`. CI no GitHub Actions.

## Documentação

- [EP I: Diagnóstico e planejamento](ep1-diagnostico-e-planejamento.md)
- [EP II: Fundamentação e desenho do MVP](ep2-fundamentacao-e-desenho-mvp.md)
