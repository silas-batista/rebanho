# Rebanho

Sistema web de gestão para igrejas locais: membros, contatos, agenda de cultos e eventos, e projetos missionários.

Projeto da disciplina **Projeto de Software** (CST em Análise e Desenvolvimento de Sistemas, Cruzeiro do Sul Virtual), desenvolvido com a Igreja Presbiteriana de Vila Formosa (Anápolis/GO).

## Requisitos

- Node.js 24 ou superior

## Como rodar

```sh
npm install
npm test                                              # testes automatizados
npm run criar-usuario -- voce@igreja.org secretaria   # primeiro acesso (pede a senha)
SEGREDO_SESSAO=$(openssl rand -hex 32) npm start      # http://localhost:3000
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `SEGREDO_SESSAO` | sim | Texto longo e aleatório que assina o cookie de sessão |
| `BANCO` | não | Caminho do arquivo SQLite (padrão `rebanho.db`) |
| `PORT` | não | Porta HTTP (padrão 3000) |
| `NODE_ENV=production` | em produção | Exige HTTPS para o cookie de sessão |

## Perfis

- **Secretaria:** cadastra e gerencia pessoas, agenda e missões.
- **Membro:** consulta agenda, missões e contatos autorizados.

## Stack

Express, EJS, SQLite (`node:sqlite`), testes com `node:test`. CI no GitHub Actions.

## Documentação

- [EP I: Diagnóstico e planejamento](ep1-diagnostico-e-planejamento.md)
- [EP II: Fundamentação e desenho do MVP](ep2-fundamentacao-e-desenho-mvp.md)
- [EP III: Execução e evidências](ep3-execucao-e-evidencias.md) (capturas em [`docs/evidencias`](docs/evidencias))
