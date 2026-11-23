# Experiência Prática IV: Avaliação de Impacto e Encerramento

> Rascunho para colar no DreamShaper na reabertura (04 a 07/12/2026).
> Seções na mesma ordem do "Resultado do Projeto" da plataforma.
> Repositório: https://github.com/silas-batista/rebanho
> **[PREENCHER]** marca o que depende das validações com a igreja ou da sua reflexão.

---

## 1. Identificação do aluno

- Nome: Silas Batista de Deus
- Curso: CST em Análise e Desenvolvimento de Sistemas (EAD)
- Disciplina: Projeto de Software (CVCS_EAD_2273346, Turma_001)
- Parceiro: Igreja Presbiteriana de Vila Formosa (Anápolis/GO), Rev. Fabrício Ribeiro

## 2. Síntese do projeto

**Problema:** a igreja controlava membros, contatos, agenda e missões em planilhas, cadernos e grupos de WhatsApp. Ninguém sabia com segurança quem era membro ativo, quem já cumpria os 6 meses para a membresia, nem tinha um lugar único para a agenda e as missões. Dados pessoais, inclusive filiação religiosa (dado sensível pela LGPD), circulavam sem controle.

**Solução:** o **Rebanho**, um sistema web responsivo com dois perfis (Secretaria e Membro), entregue em quatro etapas:

| EP | Etapa | Resultado |
|---|---|---|
| I | Diagnóstico e planejamento | Problema, personas, ODS 16 e 17, MVP, 11 histórias de usuário, cronograma e indicadores |
| II | Fundamentação e desenho | Requisitos, 7 regras de negócio, modelo de dados de 5 tabelas, arquitetura, protótipos, plano de validação |
| III | Execução e evidências | MVP completo, 10 pull requests, testes automatizados, CI, capturas de tela, rodadas de validação |
| IV | Impacto e encerramento | Sistema publicado, indicadores medidos, análise ética e de ODS, entrega à igreja |

**O que o sistema faz hoje:**
- Cadastro e edição de pessoas, com **alerta automático de visitantes que completaram 6 meses** de frequência
- **Contatos** visíveis só para membros logados e só de quem **autorizou** o compartilhamento
- **Agenda pública** (cultos de domingo 09h, 10h e 19h, Tatame na Rocha às quartas 19h), com os **Pequenos Grupos visíveis só para membros**, para não expor endereços de casas
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
| Código da aplicação | ~740 linhas (18 módulos em `src/`) |
| Páginas e estilo | ~330 linhas |
| Testes automatizados | 80 testes, ~850 linhas |
| Commits | 31 [PREENCHER: atualizar no fim] |
| Pull requests | 10 [PREENCHER: atualizar no fim] |

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

**Endereço usado nas validações:** [PREENCHER]
**Período em que ficou no ar:** [PREENCHER]

**Limitações, declaradas com transparência:**
- O sistema só fica no ar enquanto o computador do aluno estiver ligado.
- O endereço muda a cada publicação.
- Serve para validação e uso inicial, não como hospedagem definitiva (ver seção 14, continuidade).

## 6. Publicação final e monitoramento (2/2): monitoramento e backup

| Mecanismo | Como funciona | Evidência |
|---|---|---|
| Saúde do sistema | `GET /saude` responde `{"status":"ok"}` ou 503 se o banco falhar. Coberto por teste automatizado | [PREENCHER: print] |
| Monitor externo | UptimeRobot (plano gratuito) consulta `/saude` a cada 5 minutos e avisa por e-mail se cair | [PREENCHER: print do painel] |
| Backup | Cópia consistente do banco (`VACUUM INTO`) ao iniciar e a cada 24 h, mantendo as 14 mais recentes | [PREENCHER: print da pasta] |
| Segurança | Cabeçalhos `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`. Bloqueio de login após 5 tentativas | Testes automatizados |
| Qualidade | CI roda os 80 testes em todo pull request | Aba Actions do GitHub |

**Ocorrências no período:** [PREENCHER: quedas, erros relatados, como foram resolvidos]

## 7. Interação com a comunidade

| Data | Atividade | Participantes | Resultado |
|---|---|---|---|
| [PREENCHER] | Entrevista de diagnóstico (EP I) | Rev. Fabrício Ribeiro | Regra dos 6 meses, rotina de cultos, PGs, Tatame na Rocha, missões |
| [PREENCHER] | Validação do protótipo (EP II) | [PREENCHER] | [PREENCHER] |
| [PREENCHER] | 1ª rodada de validação (EP III) | [PREENCHER] | [PREENCHER: tarefas concluídas sem ajuda, notas] |
| [PREENCHER] | 2ª rodada de validação (EP III) | [PREENCHER] | [PREENCHER] |
| [PREENCHER] | Entrega e treinamento da secretaria | [PREENCHER] | [PREENCHER] |

**Como a comunidade mudou o sistema:** a informação sobre os PGs nas casas gerou a regra de privacidade RN07. A regra dos 6 meses virou o alerta de aptos à membresia. Os horários reais e as missões reais deram forma à agenda e à página de missões. [PREENCHER: o que surgiu nas validações]

## 8. Responsabilidade ética e dilemas

| Dilema | Decisão tomada | Por quê |
|---|---|---|
| **Filiação religiosa é dado sensível** (LGPD, art. 5º, II) | Cadastro só com dados mínimos (nome, telefone, e-mail, datas), sem CPF ou endereço. Lista de pessoas só para a Secretaria | Minimização: o que não é coletado não vaza |
| **Compartilhar contatos entre membros** | Só com consentimento registrado com data e hora, revogável a qualquer momento | Base legal do art. 11, I. O membro decide |
| **Endereços dos PGs nas casas** | Eventos "só membros", com regra segura por padrão: se o código não pedir o contrário, eventos restritos ficam ocultos | Evitar expor a localização de famílias na internet |
| **Crianças do Tatame na Rocha** | O sistema não cadastra as crianças, só divulga o projeto | Dados de menores exigem cuidado extra (LGPD, art. 14) e não eram necessários |
| **Nomes de missionários em página pública** | Publicados com confirmação da igreja de que eles divulgam o trabalho | Consentimento antes de expor pessoas |
| **Dados da igreja no computador do aluno** | Hospedagem temporária, com backup. Ao fim do projeto, os dados são entregues à igreja e apagados do computador do aluno | O aluno não deve ficar como guardião permanente de dados de terceiros |
| **Evidências no trabalho acadêmico** | Capturas de tela com pessoas fictícias. Termo de feedback com autorização de uso | Não expor membros reais num repositório público |
| **Dependência do desenvolvedor** | Código aberto, README, testes e gestão de usuários pela tela | A igreja pode seguir com outro desenvolvedor |

[PREENCHER, se aplicável: uso de ferramentas de IA no desenvolvimento, conforme a política da instituição]

## 9. Medição de indicadores e impacto

Indicadores definidos na EP I, medidos ao fim do projeto:

| Indicador | Antes | Meta | Depois | Como foi medido |
|---|---|---|---|---|
| Tempo para saber o nº de membros ativos | [PREENCHER] | < 1 min | [PREENCHER] | Tarefa T2 cronometrada na validação |
| Visitantes aptos à membresia identificados automaticamente | 0% (manual) | 100% | 100% | Regra RN01 coberta por teste. [PREENCHER: quantos aptos o sistema apontou] |
| Contatos exibidos sem consentimento | Sem controle | 0 | 0 | Garantido por regra e teste automatizado |
| Projetos missionários visíveis à congregação | [PREENCHER] | 100% | [PREENCHER] | Projetos cadastrados ÷ projetos apoiados |
| % de membros com cadastro completo | [PREENCHER] | ≥ 90% em 2 meses | [PREENCHER] | Consulta ao banco. Meta de longo prazo |
| Membros que acessam a agenda pelo sistema | 0 | ≥ 50% em 2 meses | [PREENCHER] | Relato da secretaria. Meta de longo prazo |
| Satisfação do parceiro (1 a 5) | — | ≥ 4 | [PREENCHER] | Termo de Feedback |

**Análise:** [PREENCHER. Separar o que já foi atingido (regras garantidas pelo sistema) do que depende de tempo de uso (adesão dos membros, cadastro completo). Dizer com honestidade o que não deu tempo de medir no período da disciplina.]

## 10. Análise de avanço do Objetivo de Desenvolvimento Sustentável

| ODS e meta | Contribuição do Rebanho | Evidência |
|---|---|---|
| **16.6** Instituições eficazes, responsáveis e transparentes | Quadro de membros confiável, regra de membresia aplicada igualmente a todos, missões apoiadas visíveis à congregação | Alerta de aptos, página de missões |
| **16.10** Acesso à informação e proteção de liberdades | Agenda pública para qualquer pessoa. Dados pessoais protegidos por login, consentimento e privacidade dos PGs | RN04, RN07, testes |
| **17.17** Parcerias da sociedade civil | Dá visibilidade às parcerias missionárias (Uruguai, Asas de Socorro) | Página de missões |
| **3 e 10** Saúde, bem-estar e redução das desigualdades | A agenda pública divulga o Tatame na Rocha, esporte gratuito para crianças do bairro | Agenda pública |

**Limites da contribuição:** o sistema é um meio, não um fim. O avanço real nos ODS depende de a igreja adotar a ferramenta e de a comunidade usar a informação divulgada. [PREENCHER: o que o parceiro relatou]

## 11. Elo entre teoria e prática

| Conceito estudado | Como apareceu no projeto |
|---|---|
| Engenharia de requisitos | Entrevista com o parceiro gerou regras que não estavam no escopo inicial (6 meses, PGs) |
| MVP e priorização MoSCoW | Finanças, escalas e células ficaram de fora, e o MVP ficou pronto a tempo |
| Modelagem de dados | Uma única entidade Pessoa para membros, visitantes e contatos evitou dados duplicados, que eram o problema original |
| TDD e testes automatizados | 80 testes. Regras quebradas de propósito para provar que os testes detectam falhas |
| Controle de versão | Uma branch e um pull request por funcionalidade, commits pequenos e descritivos |
| Integração contínua | GitHub Actions bloqueia código quebrado antes do merge |
| Segurança da informação | Hash de senha, cookies seguros, bloqueio de força bruta, cabeçalhos HTTP |
| LGPD e privacy by design | Consentimento e minimização desde o modelo de dados |
| Interação humano-computador | Acessibilidade (WCAG), uso no celular, validação com usuários reais |

## 12. Autoavaliação discursiva

[PREENCHER com suas palavras. Pontos sugeridos:
- O que funcionou melhor: ouvir o parceiro mudou o sistema para melhor (PGs, 6 meses).
- Maior dificuldade técnica e como foi superada.
- O que faria diferente: por exemplo, validar com a igreja mais cedo, ou publicar antes.
- Que competência do perfil do egresso mais se desenvolveu.]

## 13. Termo de feedback

O Termo de Feedback foi preenchido e assinado pelo Rev. Fabrício Ribeiro em [PREENCHER: data].

**Resumo das notas (1 a 5):**

| Afirmação | Nota |
|---|---|
| O aluno entendeu as necessidades da igreja | [PREENCHER] |
| O sistema resolve um problema real da secretaria | [PREENCHER] |
| O sistema é fácil de usar | [PREENCHER] |
| Os dados dos membros ficam protegidos | [PREENCHER] |
| A agenda e as missões ajudam a comunidade a participar | [PREENCHER] |
| O aluno se comunicou com respeito e clareza | [PREENCHER] |
| A igreja recomendaria continuar usando o sistema | [PREENCHER] |

**Comentários do parceiro:** [PREENCHER: transcrever]

> Anexar a imagem do termo assinado.

## 14. Revisão da experiência prática

**Continuidade depois da disciplina** (próximos passos recomendados à igreja):

1. **Hospedagem definitiva:** uma VPS de baixo custo (alguns dólares por mês) com o mesmo `npm start`, ou o computador da secretaria da igreja com o túnel.
2. **Entrega dos dados:** exportar o banco e os backups para a igreja e apagá-los do computador do aluno.
3. **Módulo de Pequenos Grupos:** líderes, participantes e frequência, a definir com os líderes.
4. **Melhorias apontadas nas validações:** [PREENCHER]

[PREENCHER: balanço da EP IV, o que foi entregue, o que ficou pendente e por quê]

## 15. Autoavaliação e reflexão

[PREENCHER: reflexão final sobre as quatro experiências práticas: do diagnóstico ao sistema publicado, o que aprendeu sobre trabalhar com um cliente real, sobre responsabilidade com dados de pessoas e sobre a própria evolução como desenvolvedor.]
