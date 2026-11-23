# Experiência Prática III: Execução e Evidências do Projeto de Software

> Versão final para o DreamShaper (reabertura de 04 a 07/12/2026).
> Seções na mesma ordem do "Resultado do Projeto" da plataforma.
> Repositório: https://github.com/silas-batista/rebanho
> Onde uma atividade planejada não foi realizada no período, o documento diz isso explicitamente.

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
| `aaf343f` | feat | Regra de aptidão à membresia após 6 meses de frequência |
| `a085dfa` | docs | Rascunhos das Experiências Práticas I e II |
| `318a4f1` | ci | Testes rodando em push e pull request |
| `b009eed` | feat | Repositório de pessoas com filtro por situação e lista de aptos |
| `cecf65b` | feat | Páginas de listagem e cadastro de pessoas |
| `8ca3ed2` | docs | README com instruções de instalação |
| `e87bdc5` | feat | Hash de senha com scrypt |
| `12a198b` | feat | Usuários com perfis e autenticação por e-mail e senha |
| `5e8431a` | feat | Login e perfil Secretaria exigidos nas páginas de pessoas |
| `df322c7` | feat | Script de criação de usuário |
| `c009fd8` | feat | Cálculo das ocorrências de cultos semanais e eventos únicos |
| `724359a` | feat | Repositório de eventos |
| `a94f1fb` | feat | Agenda pública e cadastro de eventos pela secretaria |
| `32a34fb` | feat | Eventos "só membros" fora da agenda pública (endereços dos PGs) |
| `47819d5` | docs | Agenda real, PGs, projeto social e missões nos documentos |
| `f67cd11` | docs | Tatame na Rocha às quartas, 19h |
| `de4930b` | feat | Repositório de projetos missionários e missionários |
| `ed2db17` | feat | Página pública de missões e cadastro pela secretaria |
| `885821d` | docs | Simplificação da entidade Missionário no modelo de dados |
| `2744197` | feat | Página de contatos só com membros ativos que consentiram |

> Evidência: `docs/evidencias/13-historico-commits.jpg`. Ao final, o `main` tem 34 commits de trabalho e 12 commits de merge, um por pull request.

## 4. Revisão técnica e pull requests

Cada funcionalidade foi entregue em um pull request próprio, com descrição do que muda, histórias atendidas e como testar. O CI roda em todo PR antes do merge.

| PR | Branch | Funcionalidade | Histórias |
|---|---|---|---|
| [#1](https://github.com/silas-batista/rebanho/pull/1) | `feat/pessoas` | Cadastro e listagem de pessoas, alerta de aptos à membresia | US01, US02, US03, US10 |
| [#2](https://github.com/silas-batista/rebanho/pull/2) | `feat/login` | Login com perfis Secretaria e Membro | RF09 |
| [#3](https://github.com/silas-batista/rebanho/pull/3) | `feat/agenda` | Agenda de cultos e eventos, PGs só para membros | US05, US06, US07, US11 |
| [#4](https://github.com/silas-batista/rebanho/pull/4) | `feat/missoes` | Missões e missionários | US08, US09 |
| [#5](https://github.com/silas-batista/rebanho/pull/5) | `feat/contatos` | Contatos com consentimento | US04 |
| [#6](https://github.com/silas-batista/rebanho/pull/6) | `docs/ep3` | Rascunho da EP III, capturas e correção da contagem de testes | — |
| [#7](https://github.com/silas-batista/rebanho/pull/7) | `feat/bloqueio-login` | Bloqueio após 5 tentativas de login em 15 min | RNF03 |
| [#8](https://github.com/silas-batista/rebanho/pull/8) | `feat/editar-pessoas` | Editar, receber como membro, revogar consentimento | RF01, RF04, RN02 |
| [#9](https://github.com/silas-batista/rebanho/pull/9) | `feat/usuarios` | Gestão de usuários e troca de senha | RF09 |
| [#10](https://github.com/silas-batista/rebanho/pull/10) | `feat/publicacao` | Publicação, `/saude`, backup, cabeçalhos de segurança | RNF03, RNF07 |
| [#11](https://github.com/silas-batista/rebanho/pull/11) | `docs/ep4` | Rascunho da EP IV | — |
| [#12](https://github.com/silas-batista/rebanho/pull/12) | `feat/primeiro-acesso` | Primeiro acesso pelo navegador com código de uso único | RF09 |

**Pontos levantados na revisão técnica:**
- **PR #1:** as páginas ficaram sem proteção até o login existir. O problema foi registrado no PR, com o aviso de não ir para produção antes do #2.
- **PR #3:** ao receber a informação de que os PGs se reúnem nas casas dos membros, surgiu o risco de **expor endereços na agenda pública**. Isso virou a regra RN07 e um commit de correção no mesmo PR, com teste que procura o endereço no HTML público.
- **PR #4:** o campo "contato do missionário" saiu do modelo (minimização de dados, LGPD).
- **PR #6:** ao conferir os números para este documento, descobriu-se que o `npm test` contava um arquivo auxiliar como teste (51 em vez de 50). O script foi corrigido.
- **PR #7:** trade-off registrado: bloquear por e-mail impede força bruta, mas permite que alguém bloqueie a conta da secretaria por 15 minutos. Aceito para o contexto.
- **PR #12:** nasceu de um problema real da publicação (ver seção 11).

**Como a revisão foi feita:** cada PR registra na descrição o que muda, as decisões e os riscos, e só foi integrado com o CI verde. Não houve revisor além do próprio aluno, e os 12 PRs foram integrados em sequência ao final, com merge commit para preservar o histórico. Evidência: `docs/evidencias/11-pull-requests.jpg`.

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

> Evidência: `docs/evidencias/10-saida-npm-test.txt`. Na versão final são **85 testes, todos passando** (os 35 novos cobrem bloqueio de login, edição de pessoas, usuários, saúde, backup e primeiro acesso).

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
- **Todos os 12 PRs passaram no CI** (10 a 16 s cada), e o `main` também.
- Um PR com teste falhando fica marcado em vermelho no GitHub, o que impede o merge de código quebrado.

> Evidência: `docs/evidencias/12-github-actions.jpg`.

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
| RNF03 Segurança | ✅ scrypt, cookie httpOnly/sameSite/secure, bloqueio após 5 tentativas falhas, cabeçalhos HTTP de segurança |
| RNF04 Usabilidade | ⚠️ Não medido com usuários (as rodadas de validação não foram realizadas) |

## 9. Primeira rodada de validação

**Situação: não realizada no período.** A sessão com a igreja não aconteceu até a data de entrega. O sistema foi publicado (EP IV, seção 5) e o roteiro completo está pronto para uso:

- **Roteiro da 1ª rodada:** objetivo, preparação, condução, 7 tarefas (T1 a T7) com tabela de observação, perguntas finais e escala de satisfação.
- **Tarefas planejadas:** cadastrar visitante (T1), saber o nº de membros ativos (T2), achar aptos à membresia (T3), cadastrar PG "só membros" (T4), adicionar missionário (T5), ver a agenda sem login no celular (T6), achar o telefone de outro membro (T7).

**O que foi verificado no sistema publicado**, pelo endereço público com HTTPS: agenda e missões reais acessíveis sem login, `/pessoas` redirecionando para o login, cabeçalhos de segurança presentes, `/saude` respondendo e o primeiro acesso da secretaria pelo navegador. Isso confirma que o sistema funciona publicado, não que é fácil de usar para a secretaria.

## 10. Segunda rodada de validação

**Situação: não realizada**, porque depende da primeira.

**Critérios de aceitação da EP II:**

| Critério | Meta | Resultado |
|---|---|---|
| Tarefas concluídas sem ajuda | ≥ 5 de 7 | Não medido |
| Tempo para saber o nº de membros ativos | < 1 minuto | Não medido com usuários. No sistema, é um clique no filtro "Membro ativo" |
| Visitantes aptos identificados automaticamente | 100% | ✅ Garantido pela regra RN01 e por teste automatizado |
| Contatos exibidos sem consentimento | 0 | ✅ Garantido pelas regras RN03/RN04 e por teste automatizado |
| Satisfação do parceiro (1 a 5) | ≥ 4 | Não medido |

## 11. Aprimoramento orientado por feedback

**Ajustes feitos a partir de informações da igreja:**

| Feedback da igreja | Impacto | Mudança |
|---|---|---|
| "Membresia exige 6 meses de frequência" | Nova regra de negócio | RN01, campo de primeira frequência e alerta de aptos (PR #1) |
| "Os PGs acontecem nas casas dos membros" | Risco de expor endereços | Visibilidade "só membros" e regra segura por padrão (PR #3) |
| Horários reais: domingo 09h, 10h e 19h, Tatame quarta 19h | Agenda fiel à rotina | Agenda real cadastrada no sistema publicado |
| Missões reais (Uruguai, Asas de Socorro) | Página de missões com conteúdo real | Modelo de missionário simplificado (PR #4) |

**Ajustes a partir do uso real na publicação:**

| Problema observado | Causa | Mudança |
|---|---|---|
| A criação do primeiro usuário pelo terminal falhou três vezes, e o banco publicado continuou sem nenhum usuário | Comando de terminal frágil para quem não é desenvolvedor, sem mostrar em qual banco gravava | O script passou a mostrar o caminho do banco e erros curtos. Depois, criou-se o **primeiro acesso pelo navegador** com código de uso único, que se desativa após o primeiro cadastro (PR #12). Funcionou na primeira tentativa |
| A igreja dependeria do desenvolvedor para cada novo acesso | Usuários só eram criados por script | Gestão de usuários pela tela e troca de senha (PR #9) |

**Ajustes a partir da avaliação heurística** ([`docs/avaliacao-heuristica.md`](docs/avaliacao-heuristica.md)), feita pelo aluno com apoio de assistente de IA, sem usuários: 8 problemas encontrados pelas heurísticas de Nielsen, 4 corrigidos no PR #14:

| Problema | Gravidade (0 a 4) | Correção |
|---|---|---|
| Cabeçalho com 634 px num celular de 360 px, com rolagem lateral | 3 | Menu quebra em linhas. Medido: 360 px |
| Formulário de evento mostrava campos de culto e de evento juntos | 3 | Só aparece o grupo do tipo escolhido |
| Páginas de erro em inglês ("Not Found") | 2 | Páginas em português, sem detalhes técnicos |
| Nenhuma confirmação depois de salvar | 2 | Avisos fixos como "Pessoa salva." |

**Pendências resolvidas nesta etapa:** bloqueio de login (PR #7), editar e inativar pessoas (PR #8), criar usuários pela tela (PR #9).

**Pendências que continuam:** editar e excluir eventos e projetos missionários (hoje só é possível cadastrar), módulo de Pequenos Grupos (a definir com os líderes) e as duas rodadas de validação.

## 12. Revisão da experiência prática

O plano da EP II se manteve: monólito, SQLite e 5 tabelas. A stack mudou de Rails para Node/Express por escolha do aluno, sem impacto no modelo de dados. As informações da igreja geraram um requisito de segurança não previsto (endereços dos PGs). Trabalhar com PRs pequenos e CI permitiu mudar o código com segurança: 12 PRs, todos com o CI verde. O ponto fraco desta etapa é a ausência das rodadas de validação com a igreja, o que deixa a usabilidade sem medição.

## 13. Autoavaliação e reflexão

> Rascunho baseado no que aconteceu no projeto. Leia e ajuste com as suas palavras.

O TDD mudou a forma como vejo testes: escrever o teste antes e depois quebrar o código de propósito mostrou quais testes realmente protegem o sistema. Branches e PRs deixaram cada mudança pequena e explicável. O episódio do primeiro usuário mostrou que algo simples para um desenvolvedor (rodar um comando) pode ser a maior barreira para o usuário real. Faria diferente: faria a primeira rodada de validação assim que o sistema foi publicado, em vez de deixar para o fim.
