# Experiência Prática IV: Avaliação de Impacto e Encerramento

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

## 2. Síntese do projeto

**Problema:** a igreja controlava o rol de cerca de 320 pessoas em planilhas mantidas pela secretária. Segundo o pastor, a maior dificuldade era saber quem são os membros ativos e quem não é. Também não havia alerta de quem já cumpria os 6 meses desde a primeira conversa pastoral, nem tinha um lugar único para a agenda e as missões. Dados pessoais, inclusive filiação religiosa (dado sensível pela LGPD), circulavam sem controle.

**Solução:** o **Rebanho**, um sistema web responsivo com dois perfis (Secretaria e Membro), entregue em quatro etapas:

| EP | Etapa | Resultado |
|---|---|---|
| I | Diagnóstico e planejamento | Problema, personas, ODS 16 e 17, MVP, 11 histórias de usuário, cronograma e indicadores |
| II | Fundamentação e desenho | Requisitos, 8 regras de negócio, modelo de dados de 5 tabelas, arquitetura, protótipos, plano de validação |
| III | Execução e evidências | MVP completo, pull requests, testes automatizados, CI, capturas de tela. Validação reduzida com o pastor (nota 5). Tarefas com a secretária não realizadas |
| IV | Impacto e encerramento | Segurança, sistema publicado com monitoramento e backup, análise ética e de ODS, plano de continuidade |

**O que o sistema faz hoje:**
- Cadastro e edição de pessoas, com **alerta automático de visitantes que completaram 6 meses desde a primeira conversa pastoral** e podem entrar na classe de catecúmenos
- **Contatos** visíveis só para membros logados e só de quem **autorizou** o compartilhamento
- **Agenda pública** (cultos de domingo 09h, 10h e 19h, Tatame na Rocha às quartas 19h), com os **Pequenos Grupos visíveis só para membros**. O endereço das casas não é cadastrado: a igreja o passa pessoalmente
- **Missões** apoiadas e seus missionários
- Gestão de acessos pela secretaria e troca de senha pelo próprio usuário

## 3. Implementação e código-fonte (1/2): arquitetura e números

**Arquitetura:** monólito web MVC com HTML renderizado no servidor, como planejado na EP II.

| Camada | Tecnologia |
|---|---|
| Servidor | Node.js 24+ e Express 5 |
| Páginas | EJS (HTML no servidor) e CSS próprio, responsivo |
| Banco | SQLite pelo módulo nativo `node:sqlite` |
| Senhas | scrypt com salt (`node:crypto`) |
| Sessão | Cookie assinado (`cookie-session`): httpOnly, sameSite, secure em produção |
| Testes | `node:test` (nativo) |
| CI | GitHub Actions |

**Apenas 3 dependências externas** (express, ejs, cookie-session). O resto usa recursos nativos do Node, o que reduz atualizações de segurança e o risco de pacotes de terceiros.

| Métrica | Valor |
|---|---|
| Código da aplicação | ~800 linhas (19 módulos em `src/`) |
| Páginas e estilo | ~380 linhas |
| Testes automatizados | 106 testes |
| Commits | ~45 de trabalho, mais um merge por PR |
| Pull requests | 16, todos com CI verde |

> A quantidade de código de teste é maior que a da aplicação. As regras críticas (membresia, consentimento, visibilidade dos PGs, permissões) foram testadas e depois quebradas de propósito para provar que o teste detecta a falha.

## 4. Implementação e código-fonte (2/2): módulos e evolução

| Módulo | Arquivos principais | Regras | PR |
|---|---|---|---|
| Pessoas e membresia | `pessoas.js`, `membresia.js` | RN01 (6 meses), RN02 (data de recebimento) | #1, #8 |
| Login e perfis | `usuarios.js`, `senhas.js`, `rotas-sessao.js` | RN05, RN06 | #2 |
| Agenda | `agenda.js`, `eventos.js` | RN07 (PGs só para membros) | #3 |
| Missões | `missoes.js` | — | #4 |
| Contatos | `pessoas.js` (consulta) | RN03, RN04 (consentimento) | #5 |
| Segurança | `limitador.js` | Bloqueio após 5 tentativas em 15 min | #7 |
| Usuários | `rotas-usuarios.js` | E-mail único, troca de senha | #9 |
| Publicação | `backup.js`, `scripts/publicar.sh` | Backup diário, `/saude` | #10 |
| Primeiro acesso | `rotas-primeiro-acesso.js` | Código de uso único, página some após o 1º usuário | #12 |

**Mudanças em relação ao planejado:**
- A stack mudou de Rails para Node/Express por escolha do aluno, sem alterar o modelo de dados.
- Surgiu um requisito não previsto: a **visibilidade "só membros"** para os PGs, depois que a igreja contou que eles acontecem nas casas dos membros.
- O missionário passou a guardar só o nome (sem contato pessoal), por minimização de dados.

## 5. Publicação final e monitoramento (1/2): como o sistema foi publicado

**Solução adotada (custo zero):** o sistema roda no computador do aluno e fica acessível pela internet por um **túnel gratuito da Cloudflare** (`cloudflared`), com HTTPS.

```
[Celular do membro] ──HTTPS──> [Cloudflare] ──túnel──> [Computador do aluno: Rebanho + SQLite]
                                                              └── backup diário (14 cópias)
```

- Comando único: `npm run publicar`. Ele sobe o sistema em modo produção e mostra o endereço `https://…trycloudflare.com`.
- Em produção, o cookie de login só trafega por HTTPS. Pelo HTTP direto não é possível entrar.
- Configuração sensível (segredo da sessão) fica num arquivo `.env`, fora do repositório.

**Publicação realizada em 23/11/2026**, com a agenda real (cultos de domingo e Tatame na Rocha) e as missões reais cadastradas no banco de produção. Pessoas e usuários ficam a cargo da igreja.

| Verificação pelo endereço público | Resultado |
|---|---|
| `/saude` | `{"status":"ok"}` por HTTPS (`docs/evidencias/15-producao-saude.png`) |
| Agenda e missões sem login | Acessíveis, com os dados reais |
| `/pessoas` sem login | Redireciona para `/entrar` |
| Cabeçalhos de segurança | `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` presentes |
| Primeiro acesso da secretaria | Criado pelo navegador. Em seguida, a página passou a responder 404 |
| Visão da secretaria em produção | `docs/evidencias/14-producao-missoes-secretaria.jpg` |

**Limitações, declaradas com transparência:**
- O sistema só fica no ar enquanto o computador do aluno estiver ligado.
- O endereço muda a cada publicação.
- Serve para validação e uso inicial, não como hospedagem definitiva (ver seção 14, continuidade).

## 6. Publicação final e monitoramento (2/2): monitoramento e backup

| Mecanismo | Como funciona | Evidência |
|---|---|---|
| Saúde do sistema | `GET /saude` responde `{"status":"ok"}` ou 503 se o banco falhar. Coberto por teste automatizado | `15-producao-saude.png` |
| Monitor externo | Planejado: UptimeRobot (plano gratuito) consultando `/saude` a cada 5 minutos. **Não configurado no período**, porque o endereço do túnel muda a cada publicação | — |
| Backup | Cópia consistente do banco (`VACUUM INTO`) ao iniciar e a cada 24 h, mantendo as 14 mais recentes | `16-backups.txt` |
| Segurança | Cabeçalhos `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`. Bloqueio de login após 5 tentativas | Testes automatizados |
| Qualidade | CI roda os 106 testes em todo pull request e no `main` | `12-github-actions.jpg` |

**Ocorrências no período:**

| Ocorrência | Causa | Solução |
|---|---|---|
| Banco de produção sem nenhum usuário após três tentativas de criar a secretaria pelo terminal | O comando não gravava no banco do servidor, e o script não dizia qual banco usava | Script passou a mostrar o caminho do banco. Criado o primeiro acesso pelo navegador com código de uso único (PR #12), que funcionou na primeira tentativa |
| Endereço público mudou ao reiniciar | Comportamento do túnel gratuito | Limitação registrada. Endereço fixo exige domínio próprio |

## 7. Interação com a comunidade

| Data | Atividade | Participantes | Resultado |
|---|---|---|---|
| Nov/2026 | Levantamento de informações junto à igreja (EP I) | Liderança da igreja | Regra dos 6 meses, rotina de cultos, PGs nas casas, Tatame na Rocha, missões. Confirmação de que os missionários podem ser divulgados |
| 23/11/2026 | Publicação e primeiro acesso | Aluno, com acesso de secretaria | Sistema no ar com a agenda e as missões reais |
| 23/11/2026 | Avaliação heurística (sem usuários) | Aluno, com apoio de assistente de IA | 8 problemas de usabilidade, 7 corrigidos (PRs #14 e #15). Não substitui a validação com a igreja |
| 23/11/2026 | Questionário por WhatsApp e avaliação do sistema publicado | Rev. Fabrício Ribeiro | Respostas de diagnóstico (EP I, seção 3.1), nota **5** ao sistema, autorização para citar a igreja e o nome dele, e concordância em assinar o Termo de Feedback. Prints: `docs/evidencias/17-` e `18-respostas-pastor-whatsapp` |
| 23/11/2026 | Correções a partir das respostas (PR #16) | Aluno | Regra dos 6 meses contada da conversa pastoral, caminho da classe de catecúmenos e orientação para não cadastrar endereço de PG |
| — | Validação do protótipo (EP II) | — | **Não realizada** |
| — | Tarefas com a secretária e 2ª rodada (EP III) | — | **Não realizadas.** Roteiro pronto |
| — | Entrega e treinamento da secretaria | — | **Não realizada** |

**Como a comunidade mudou o sistema:** a informação sobre os PGs nas casas gerou a regra de privacidade RN07. A regra dos 6 meses virou o alerta de membresia. Os horários reais e as missões reais deram forma à agenda e à página de missões. As respostas do pastor corrigiram o sistema em dois pontos: os 6 meses contam da **primeira conversa pastoral**, e o endereço dos PGs **não entra no sistema**, porque a igreja o passa pessoalmente.

## 8. Responsabilidade ética e dilemas

| Dilema | Decisão tomada | Por quê |
|---|---|---|
| **Filiação religiosa é dado sensível** (LGPD, art. 5º, II) | Cadastro só com dados mínimos (nome, telefone, e-mail, datas), sem CPF ou endereço. Lista de pessoas só para a Secretaria | Minimização: o que não é coletado não vaza |
| **Compartilhar contatos entre membros** | Só com consentimento registrado com data e hora, revogável a qualquer momento | Base legal do art. 11, I. O membro decide |
| **Endereços dos PGs nas casas** | Eventos "só membros", com regra segura por padrão. Depois da resposta do pastor, o endereço deixou de ser cadastrado: o formulário orienta a não preenchê-lo | Evitar expor a localização de famílias na internet. A igreja já passava o endereço só pessoalmente, e o sistema respeita esse costume |
| **Crianças do Tatame na Rocha** | O sistema não cadastra as crianças, só divulga o projeto | Dados de menores exigem cuidado extra (LGPD, art. 14) e não eram necessários |
| **Nomes de missionários em página pública** | Publicados com confirmação da igreja de que eles divulgam o trabalho | Consentimento antes de expor pessoas |
| **Dados da igreja no computador do aluno** | Hospedagem temporária, com backup. Proposta: ao fim do projeto, entregar os dados à igreja e apagá-los do computador do aluno | O aluno não deve ficar como guardião permanente de dados de terceiros |
| **Evidências no trabalho acadêmico** | Capturas de tela com pessoas fictícias. Termo de feedback com autorização de uso | Não expor membros reais num repositório público |
| **Dependência do desenvolvedor** | Código aberto, README, testes e gestão de usuários pela tela | A igreja pode seguir com outro desenvolvedor |

**Uso de inteligência artificial:** o desenvolvimento contou com um assistente de IA (Claude Code) para escrever código, testes e rascunhos destes documentos, sob a direção do aluno, que definiu o projeto, tomou as decisões e validou os resultados. Registrar isso é parte da honestidade acadêmica.

## 9. Medição de indicadores e impacto

Indicadores definidos na EP I. A satisfação do parceiro foi medida pelo questionário de 23/11/2026. Os que dependem de uso diário pela igreja **não foram medidos**, porque o uso real não começou no período.

| Indicador | Antes | Meta | Resultado | Como |
|---|---|---|---|---|
| Visitantes que completaram os 6 meses identificados automaticamente | 0% (controle manual em planilha) | 100% | **100%** | Garantido pela regra RN01 e por teste automatizado |
| Contatos exibidos sem consentimento | Sem controle | 0 | **0** | Garantido pelas regras RN03/RN04 e por teste automatizado |
| Projetos missionários visíveis à congregação | Nenhum canal único | 100% | **2 projetos publicados** | A igreja apoia outros projetos na África, ainda não cadastrados por falta de detalhes |
| Tempo para saber o nº de membros ativos | Não medido | < 1 min | Não medido com usuários | No sistema, é um clique no filtro "Membro ativo" |
| % de membros com cadastro completo | 0 de cerca de 320 (em planilhas) | ≥ 90% em 2 meses | Não medido | Depende de a secretária passar a planilha para o sistema |
| Membros que acessam a agenda pelo sistema | 0 | ≥ 50% em 2 meses | Não medido | Depende de divulgação e de endereço fixo |
| Satisfação do parceiro (1 a 5) | — | ≥ 4 | **5** | Resposta do Rev. Fabrício ao questionário e nota 5 em 6 das 7 afirmações do Termo de Feedback, 23/11/2026 |

**Análise:** o projeto atingiu os indicadores que dependem do próprio sistema: as regras de membresia e de consentimento funcionam e são verificadas automaticamente a cada mudança no código. A satisfação do parceiro superou a meta (nota 5).

Sobre o impacto, o pastor escreveu que o sistema "muda a forma de interagir com os membros e também na praticidade de informar os membros e novos membros". Para ele, o próximo passo é "divulgar para os membros". Os indicadores de adoção ainda não foram medidos, porque a secretária não passou a planilha para o sistema no período. Por isso, o impacto é **reconhecido pelo parceiro, mas ainda não medido no uso**.

## 10. Análise de avanço do Objetivo de Desenvolvimento Sustentável

| ODS e meta | Contribuição do Rebanho | Evidência |
|---|---|---|
| **16.6** Instituições eficazes, responsáveis e transparentes | Quadro de membros confiável, regra de membresia aplicada igualmente a todos, missões apoiadas visíveis à congregação | Alerta de aptos, página de missões |
| **16.10** Acesso à informação e proteção de liberdades | Agenda pública para qualquer pessoa. Dados pessoais protegidos por login, consentimento e privacidade dos PGs | RN04, RN07, testes |
| **17.17** Parcerias da sociedade civil | Dá visibilidade às parcerias missionárias (Uruguai, Asas de Socorro) | Página de missões |
| **3 e 10** Saúde, bem-estar e redução das desigualdades | A agenda pública divulga o Tatame na Rocha, esporte gratuito para crianças do bairro | Agenda pública |

**Limites da contribuição:** o sistema é um meio, não um fim. O avanço real nos ODS depende de a igreja adotar a ferramenta e de a comunidade usar a informação divulgada. Como o sistema não chegou a ser usado pela igreja no período, essa contribuição é potencial.

## 11. Elo entre teoria e prática

| Conceito estudado | Como apareceu no projeto |
|---|---|
| Engenharia de requisitos | As informações do parceiro geraram regras que não estavam no escopo inicial (6 meses, PGs). O questionário corrigiu uma suposição do aluno sobre de quando contam os 6 meses |
| MVP e priorização MoSCoW | Finanças, escalas e células ficaram de fora, e o MVP ficou pronto a tempo |
| Modelagem de dados | Uma única entidade Pessoa para membros, visitantes e contatos evitou dados duplicados, que eram o problema original |
| TDD e testes automatizados | 106 testes. Regras quebradas de propósito para provar que os testes detectam falhas |
| Controle de versão | Uma branch e um pull request por funcionalidade, commits pequenos e descritivos |
| Integração contínua | GitHub Actions bloqueia código quebrado antes do merge |
| Segurança da informação | Hash de senha, cookies seguros, bloqueio de força bruta, cabeçalhos HTTP |
| LGPD e privacy by design | Consentimento e minimização desde o modelo de dados |
| Interação humano-computador | Acessibilidade (WCAG), uso no celular, avaliação heurística e avaliação do pastor |

## 12. Autoavaliação discursiva

> Rascunho baseado no que aconteceu no projeto. Leia e ajuste com as suas palavras.

O que funcionou melhor foi deixar as informações da igreja mudarem o sistema: a regra dos 6 meses e a privacidade dos Pequenos Grupos não estavam na ideia inicial e hoje são as partes mais importantes. Na parte técnica, a maior dificuldade não foi o código, mas colocar o sistema no ar para pessoas reais: o primeiro acesso pelo terminal falhou várias vezes, e a solução foi trazer esse passo para o navegador. O que faria diferente: perguntar as regras ao pastor logo no início. Só no fim descobri que os 6 meses contam da primeira conversa pastoral, e não da primeira visita, e que o endereço dos PGs nem deveria entrar no sistema. A competência que mais se desenvolveu foi a responsabilidade com dados de terceiros: cada decisão de LGPD foi pensada antes do código.

## 13. Termo de feedback

**Preenchido pelo Rev. Fabrício em 23/11/2026, no documento online. Sem assinatura manuscrita ou digital.**

> Evidência: `docs/evidencias/19-termo-de-feedback-preenchido.pdf`, exportado do documento online. Na exportação, os itens marcados da lista aparecem riscados, que é como o editor mostra itens concluídos.

| Afirmação | Nota (1 a 5) |
|---|---|
| O aluno entendeu as necessidades da igreja | 5 |
| O sistema resolve um problema real da secretaria | Sem resposta |
| O sistema é fácil de usar | 5 |
| Os dados dos membros ficam protegidos | 5 |
| A agenda e as missões ajudam a comunidade a participar | 5 |
| O aluno se comunicou com respeito e clareza | 5 |
| A igreja recomendaria continuar usando o sistema | 5 |

- **Funcionalidades marcadas como demonstradas ou usadas:** as cinco (cadastro de pessoas, contatos, agenda, missões e login).
- **O que o sistema trouxe de mais útil:** "Praticidade e velocidade de comunicação".
- **O que deveria melhorar:** "por enquanto, atende bem".
- **A igreja pretende continuar usando?** Sim.
- **Autorização de uso:** concedida. O pastor já tinha autorizado também pelo WhatsApp ("Sim").

**Limites:** o nome do pastor foi digitado, e não assinado, e ficou no espaço acima da linha do aluno. Uma das sete afirmações ficou sem nota, e o endereço e o período não foram preenchidos. O termo foi aceito assim porque não havia como imprimir no período. Se ele for assinado depois, o arquivo substitui esta evidência.

## 14. Revisão da experiência prática

**Balanço:** foi entregue um sistema completo, testado (106 testes), publicado com HTTPS, backup e verificação de saúde, com a agenda e as missões reais da igreja. O pastor avaliou o sistema com nota 5, e as respostas dele corrigiram duas regras. O pastor também preencheu o Termo de Feedback, com nota 5 em 6 das 7 afirmações. Ficaram pendentes as tarefas com a secretária, a medição de uso e a assinatura do termo.

**Continuidade depois da disciplina** (próximos passos recomendados à igreja):

1. **Divulgação e validação:** como o pastor sugeriu, divulgar o sistema para os membros. Antes, aplicar o roteiro de tarefas com a secretária e passar a planilha de cerca de 320 pessoas para o sistema.
2. **Hospedagem definitiva:** uma VPS de baixo custo com o mesmo `npm start`, ou o computador da secretaria da igreja com o túnel. Com um domínio próprio, o endereço fica fixo e o monitor externo passa a funcionar.
3. **Entrega dos dados:** exportar o banco e os backups para a igreja e apagá-los do computador do aluno.
4. **Funcionalidades:** pedidos de oração dos missionários, projetos da África, módulo dos 8 Pequenos Grupos (a definir com os líderes, sem endereços) e menu recolhível no celular.

## 15. Autoavaliação e reflexão

> Rascunho baseado no que aconteceu no projeto. Leia e ajuste com as suas palavras.

As quatro experiências práticas mostraram o caminho inteiro de um software: entender um problema real, desenhar uma solução do tamanho certo, construir com testes e controle de versão, e colocar no ar com segurança. Aprendi que trabalhar com um cliente real exige mais do que código: exige agenda, conversa e paciência para validar. Também aprendi que, num sistema de igreja, quase todo dado é sensível, e que proteger as pessoas precisa estar no modelo de dados desde o começo. A conversa com o pastor, mesmo curta, corrigiu a regra mais importante do sistema. Num próximo projeto, eu faria essa conversa no primeiro dia.
