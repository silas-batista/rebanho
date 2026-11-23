# Rebanho

Sistema web de gestão para igrejas locais: membros, contatos, agenda de cultos e eventos, e projetos missionários.

Projeto da disciplina **Projeto de Software** (CST em Análise e Desenvolvimento de Sistemas, Cruzeiro do Sul Virtual), desenvolvido com a Igreja Presbiteriana de Vila Formosa (Anápolis/GO).

## Requisitos

- Node.js 24 ou superior

## Como rodar

```sh
npm install
npm test                                              # testes automatizados
npm run criar-usuario -- voce@igreja.org secretaria   # opcional: ou use /primeiro-acesso (abaixo)
SEGREDO_SESSAO=$(openssl rand -hex 32) npm start      # http://localhost:3000
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `SEGREDO_SESSAO` | sim | Texto longo e aleatório que assina o cookie de sessão |
| `BANCO` | não | Caminho do arquivo SQLite (padrão `rebanho.db`) |
| `PORT` | não | Porta HTTP (padrão 3000) |
| `NODE_ENV=production` | em produção | Exige HTTPS para o cookie de sessão |

## Publicação (gratuita, pelo túnel da Cloudflare)

O sistema roda neste computador e fica acessível na internet por HTTPS enquanto o comando estiver aberto.

```sh
brew install cloudflared
cp .env.example .env            # preencha SEGREDO_SESSAO com: openssl rand -hex 32
npm run criar-usuario -- secretaria@igreja.org secretaria
npm run publicar                # mostra o endereço https://....trycloudflare.com
```

- O endereço muda a cada `npm run publicar`.
- O computador precisa ficar ligado.
- `GET /saude` responde `{"status":"ok"}` e serve para monitoramento (ex.: UptimeRobot).
- Com `PASTA_BACKUP` definido, o banco é copiado ao iniciar e a cada 24 h. Ficam os 14 backups mais recentes.
- Em produção, o login só funciona por HTTPS (cookie `secure`).
- **Primeiro acesso:** com o banco sem usuários, o servidor mostra no terminal um código de uso único. Abra `/primeiro-acesso`, informe o código e crie a secretaria. A página some depois do primeiro cadastro.

## Perfis

- **Secretaria:** cadastra e gerencia pessoas, agenda e missões.
- **Membro:** consulta agenda, missões e contatos autorizados.

## Stack

Express, EJS, SQLite (`node:sqlite`), testes com `node:test`. CI no GitHub Actions.

## Documentação

- [EP I: Diagnóstico e planejamento](ep1-diagnostico-e-planejamento.md)
- [EP II: Fundamentação e desenho do MVP](ep2-fundamentacao-e-desenho-mvp.md)
- [EP III: Execução e evidências](ep3-execucao-e-evidencias.md) (capturas em [`docs/evidencias`](docs/evidencias))
- [EP IV: Avaliação de impacto e encerramento](ep4-avaliacao-de-impacto-e-encerramento.md)
- [Avaliação heurística](docs/avaliacao-heuristica.md)
