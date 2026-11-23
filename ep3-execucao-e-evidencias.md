# Experiência Prática III: Execução e Evidências do Projeto de Software

> Rascunho para colar no DreamShaper na reabertura (04 a 07/12/2026).
> Seções na mesma ordem do "Resultado do Projeto" da plataforma.
> Repositório: https://github.com/silas-batista/rebanho
> **[PREENCHER]** marca o que depende de você ou da igreja.

---

## 1. Identificação do aluno

- Nome: Silas Batista de Deus
- Curso: CST em Análise e Desenvolvimento de Sistemas (EAD)
- Disciplina: Projeto de Software (CVCS_EAD_2273346, Turma_001)
- Parceiro: Igreja Presbiteriana de Vila Formosa (Anápolis/GO), Rev. Fabrício Ribeiro

## 2. Configuração do repositório

- **Repositório público:** https://github.com/silas-batista/rebanho
- **Branch principal:** `main`, que só recebe código por pull request
- **Uma branch por funcionalidade:** `feat/pessoas`, `feat/login`, `feat/agenda`, `feat/missoes`, `feat/contatos`
- **Estrutura:**

```
rebanho/
├── .github/workflows/ci.yml   # pipeline de integração contínua
├── src/                       # código da aplicação (Express)
├── views/                     # páginas HTML (EJS)
├── public/estilo.css          # estilo responsivo e acessível
├── test/                      # testes automatizados (node:test)
├── docs/evidencias/           # capturas de tela do sistema
├── ep1-…md, ep2-…md, ep3-…md  # documentação das experiências práticas
└── README.md                  # como instalar, configurar e rodar
```

- **`.gitignore`** exclui `node_modules/`, bancos de dados (`*.db`) e `.env`. Dados reais e segredos nunca vão para o repositório.
- **README** com requisitos, comandos, variáveis de ambiente e perfis de acesso.

## 3. Registro de histórico de commits

Os commits seguem o padrão **Conventional Commits** (`feat:`, `docs:`, `ci:`): cada um faz uma única mudança lógica e descreve o que mudou.

| Commit | Tipo | Descrição |
|---|---|---|
| `b1d7b4f` | feat | Regra de aptidão à membresia após 6 meses de frequência |
| `eda75d9` | docs | Rascunhos das Experiências Práticas I e II |
| `75abcd9` | ci | Testes rodando em push e pull request |
| `e9f53b5` | feat | Repositório de pessoas com filtro por situação e lista de aptos |
| `0958b50` | feat | Páginas de listagem e cadastro de pessoas |
| `c12fdb5` | docs | README com instruções de instalação |
| `1b6c25e` | feat | Hash de senha com scrypt |
| `32e5c2a` | feat | Usuários com perfis e autenticação por e-mail e senha |
| `e880e40` | feat | Login e perfil Secretaria exigidos nas páginas de pessoas |
| `44d3505` | feat | Script de criação de usuário |
| `4090a02` | feat | Cálculo das ocorrências de cultos semanais e eventos únicos |
| `d3661ad` | feat | Repositório de eventos |
| `6f5b922` | feat | Agenda pública e cadastro de eventos pela secretaria |
| `d7713da` | feat | Eventos "só membros" fora da agenda pública (endereços dos PGs) |
| `c9d83c1` | docs | Agenda real, PGs, projeto social e missões nos documentos |
| `67ff94b` | docs | Tatame na Rocha às quartas, 19h |
| `bfca9f1` | feat | Repositório de projetos missionários e missionários |
| `ff86486` | feat | Página pública de missões e cadastro pela secretaria |
| `1fb466d` | docs | Simplificação da entidade Missionário no modelo de dados |
| `1e44854` | feat | Página de contatos só com membros ativos que consentiram |

> [PREENCHER: print da página de commits no GitHub e os commits feitos depois deste rascunho]

## 4. Revisão técnica e pull requests

Cada funcionalidade foi entregue em um pull request próprio, com descrição do que muda, histórias atendidas e como testar. O CI roda em todo PR antes do merge.

| PR | Branch | Funcionalidade | Histórias |
|---|---|---|---|
| [#1](https://github.com/silas-batista/rebanho/pull/1) | `feat/pessoas` | Cadastro e listagem de pessoas, alerta de aptos à membresia | US01, US02, US03, US10 |
| [#2](https://github.com/silas-batista/rebanho/pull/2) | `feat/login` | Login com perfis Secretaria e Membro | RF09 |
| [#3](https://github.com/silas-batista/rebanho/pull/3) | `feat/agenda` | Agenda de cultos e eventos, PGs só para membros | US05, US06, US07, US11 |
| [#4](https://github.com/silas-batista/rebanho/pull/4) | `feat/missoes` | Missões e missionários | US08, US09 |
| [#5](https://github.com/silas-batista/rebanho/pull/5) | `feat/contatos` | Contatos com consentimento | US04 |

**Pontos levantados na revisão técnica:**
- **PR #1:** as páginas ficaram sem proteção até o login existir. O problema foi registrado no PR, com o aviso de não ir para produção antes do #2.
- **PR #3:** ao receber a informação de que os PGs se reúnem nas casas dos membros, surgiu o risco de **expor endereços na agenda pública**. Isso virou a regra RN07 e um commit de correção no mesmo PR, com teste que procura o endereço no HTML público.
- **PR #4:** o campo "contato do missionário" saiu do modelo (minimização de dados, LGPD).

> [PREENCHER: prints dos PRs com seus comentários de revisão e aprovação. Revise cada PR no GitHub, deixe pelo menos um comentário técnico e faça o merge na ordem #1 → #5.]

## 5. Execução de testes automatizados

**Ferramenta:** `node:test`, o executor nativo do Node.js, sem framework extra. Comando: `npm test`.

**Resultado:** **50 testes, 50 passando, 0 falhando**, em menos de 1 segundo.

| Arquivo | O que testa | Testes |
|---|---|---|
| `membresia.test.js` | RN01: 6 meses de frequência (limite exato, um dia a menos, sem data, membro) | 4 |
| `pessoas.test.js` | Cadastro, filtro por situação, lista de aptos, nome obrigatório, contatos com consentimento | 5 |
| `senhas.test.js` | Hash scrypt: senha certa, senha errada, salt diferente a cada geração | 3 |
| `usuarios.test.js` | Autenticação, e-mail sem diferenciar maiúsculas, senha mínima de 8 caracteres | 5 |
| `agenda.test.js` | Ocorrências de cultos semanais e eventos únicos, ordenação | 4 |
| `eventos.test.js` | Validações e visibilidade "só membros" | 5 |
| `missoes.test.js` | Projetos com missionários e validações | 4 |
| `rotas-*.test.js` | Requisições HTTP reais: permissões por perfil (redireciona, 403), formulários (303, 422), conteúdo das páginas | 20 |

**Método (TDD):** cada regra começou por um teste que falhava (vermelho). Depois veio o código mínimo para passar (verde). Por fim, **a regra foi quebrada de propósito para confirmar que o teste detecta a regressão**. Exemplos:
- Trocar `<=` por `<` na regra dos 6 meses faz o teste do limite exato falhar.
- Remover a proteção de `/pessoas` faz 3 testes de segurança falharem.
- Mostrar eventos restritos na agenda pública faz o teste do PG falhar.
- Remover o filtro de consentimento faz os 2 testes de contatos falharem.

> [PREENCHER: print do terminal com `npm test`]

## 6. Pipeline de integração contínua

**Ferramenta:** GitHub Actions (`.github/workflows/ci.yml`).

```yaml
on:
  push:
    branches: [main]
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm ci --ignore-scripts || npm install --ignore-scripts
      - run: npm test
```

- Roda a cada **push em `main`** e em **todo pull request**.
- Instala as dependências com `--ignore-scripts`, para não executar scripts de terceiros na instalação.
- **Todos os 5 PRs passaram no CI** (cerca de 10 s cada).
- Um PR com teste falhando fica marcado em vermelho no GitHub, o que impede o merge de código quebrado.

> [PREENCHER: print da aba Actions com os runs verdes e de um PR mostrando o check "test" aprovado]

## 7. Evidências de funcionamento do software (1/2): visão pública e do membro

As imagens estão em `docs/evidencias/`. Os dados de pessoas são **fictícios**. A agenda e as missões são as reais da igreja.

| Imagem | O que comprova |
|---|---|
| `04-agenda-publica-sem-pg.jpg` | Agenda pública sem login: cultos de domingo (09h, 10h, 19h) e Tatame na Rocha (quarta, 19h). **Nenhum PG aparece.** |
| `05-missoes-publica.jpg` | Missões públicas: Plantação de igreja no Uruguai (Rev. Maurício e Sandra Rolim) e Asas de Socorro (Wilker Mariano) |
| `06-login-senha-incorreta.jpg` | Senha errada mostra a mensagem genérica "E-mail ou senha incorretos" |
| `01-agenda-membro.jpg` | Membro logado vê também o PG, marcado "só membros" |
| `02-contatos-membro.jpg` | Membro vê só os contatos de quem consentiu |
| `03-acesso-restrito-membro.jpg` | Membro tentando abrir Pessoas recebe "Acesso restrito" |

## 8. Evidências de funcionamento do software (2/2): visão da secretaria

| Imagem | O que comprova |
|---|---|
| `07-pessoas-secretaria.jpg` | Lista de pessoas com filtros, contagem de membros ativos e **alerta de visitante apto à membresia** (RN01) |
| `08-cadastro-pessoa.jpg` | Formulário com primeira frequência e **caixa de consentimento LGPD** |
| `09-missoes-secretaria.jpg` | Secretaria cadastra projetos e adiciona missionários |

**Requisitos da EP II atendidos:**

| Requisito | Status |
|---|---|
| RF01 a RF11 | ✅ Implementados |
| RN01 a RN07 | ✅ Implementadas e testadas |
| RNF01 Responsivo | ✅ Layout de coluna única, a partir de 360 px |
| RNF02 LGPD | ✅ Consentimento registrado com data e hora, dados mínimos |
| RNF03 Segurança | ✅ scrypt, cookie httpOnly/sameSite/secure. ⏳ Bloqueio após tentativas falhas: pendente |
| RNF04 Usabilidade | [PREENCHER após a validação] |

## 9. Primeira rodada de validação

**Objetivo:** verificar se a secretaria e o pastor conseguem usar o sistema nas tarefas principais.

**Participantes:** [PREENCHER: Rev. Fabrício Ribeiro, secretário(a), 1 ou 2 membros]
**Data e local:** [PREENCHER]
**Formato:** uso do sistema no celular ou computador, com o aluno observando sem ajudar.

**Tarefas:**

| # | Tarefa | Perfil | Concluiu sem ajuda? | Tempo | Observações |
|---|---|---|---|---|---|
| T1 | Cadastrar um visitante novo com a data da primeira frequência | Secretaria | [ ] | | |
| T2 | Descobrir quantos membros ativos a igreja tem | Secretaria | [ ] | | |
| T3 | Encontrar quem já está apto à membresia | Secretaria | [ ] | | |
| T4 | Cadastrar o PG de uma casa como "só membros" | Secretaria | [ ] | | |
| T5 | Adicionar um missionário a um projeto | Secretaria | [ ] | | |
| T6 | Ver a agenda da semana no celular sem fazer login | Visitante | [ ] | | |
| T7 | Encontrar o telefone de outro membro | Membro | [ ] | | |

**Perguntas finais:**
1. O que foi mais difícil?
2. O que falta para vocês usarem no dia a dia?
3. De 1 a 5, quanto o sistema ajudaria a secretaria?

**Resultados:** [PREENCHER]

## 10. Segunda rodada de validação

**Objetivo:** confirmar que os ajustes da primeira rodada resolveram os problemas encontrados.

**Participantes:** [PREENCHER: de preferência os mesmos da 1ª rodada]
**Data:** [PREENCHER]

| Problema da 1ª rodada | Ajuste feito (PR) | Resolvido? |
|---|---|---|
| [PREENCHER] | [PREENCHER] | [ ] |

**Critérios de aceitação da EP II:**

| Critério | Meta | Resultado |
|---|---|---|
| Tarefas concluídas sem ajuda | ≥ 4 de 5 | [PREENCHER] |
| Tempo para saber o nº de membros ativos | < 1 minuto | [PREENCHER] |
| Visitantes aptos identificados automaticamente | 100% | ✅ coberto por teste automatizado |
| Contatos exibidos sem consentimento | 0 | ✅ coberto por teste automatizado |
| Satisfação do parceiro (1 a 5) | ≥ 4 | [PREENCHER] |

## 11. Aprimoramento orientado por feedback

**Ajustes já feitos a partir de informações da igreja durante o desenvolvimento:**

| Feedback da igreja | Impacto | Mudança |
|---|---|---|
| "Membresia exige 6 meses de frequência" | Nova regra de negócio | RN01, campo de primeira frequência e alerta de aptos (PR #1) |
| "Os PGs acontecem nas casas dos membros" | Risco de expor endereços | Visibilidade "só membros" e regra segura por padrão (PR #3) |
| Horários reais: domingo 09h, 10h e 19h, Tatame quarta 19h | Agenda fiel à rotina | Dados de demonstração e documentação atualizados |
| Missões reais (Uruguai, Asas de Socorro) | Página de missões com conteúdo real | Modelo de missionário simplificado (PR #4) |

**Ajustes das rodadas de validação:** [PREENCHER com o que surgir. Cada ajuste vira um PR com teste.]

**Pendências conhecidas (próximas melhorias):**
- Bloqueio após tentativas de login falhas
- Tela para a secretaria criar usuários (hoje é por script)
- Editar e inativar pessoas, eventos e projetos
- Módulo de Pequenos Grupos (a definir com os líderes)

## 12. Revisão da experiência prática

[PREENCHER. Sugestão de pontos: o plano da EP II se manteve (monólito, SQLite, 5 tabelas). A stack mudou de Rails para Node/Express por escolha do aluno, sem impacto no modelo. Informações novas da igreja (PGs nas casas) geraram requisito de segurança que não estava previsto. Trabalhar com PRs pequenos e CI deu segurança para mudar o código.]

## 13. Autoavaliação e reflexão

[PREENCHER: o que aprendeu com TDD e com "quebrar o código de propósito" para validar os testes, como foi usar Git com branches e PRs, a importância de ouvir o parceiro (o risco dos endereços dos PGs só apareceu na conversa), e o que faria diferente.]
