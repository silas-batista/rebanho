# Experiência Prática I: Diagnóstico e Planejamento

> Rascunho para colar no DreamShaper na reabertura (04 a 07/12/2026).
> Versão final. Onde uma atividade planejada não foi realizada no período, o documento diz isso explicitamente.

---

## 1. Identificação do aluno

- Nome: Silas Batista de Deus
- Curso: CST em Análise e Desenvolvimento de Sistemas (EAD)
- Disciplina: Projeto de Software (CVCS_EAD_2273346, Turma_001)

## 2. Parceiro e problema local

**Parceiro:** Igreja Presbiteriana de Vila Formosa (Anápolis, GO)
**Contato responsável:** Rev. Fabrício Ribeiro, pastor da igreja

**Regra de negócio levantada:** o processo de membresia leva **6 meses, contados a partir da primeira conversa pastoral**. Depois, a pessoa faz a classe de catecúmenos e é recebida por profissão de fé pública ou batismo. O processo é o mesmo para crianças (seção 3.1).

**Rotina e atividades da igreja:**
- **Domingo:** Culto Público às 09h, Escola Dominical às 10h e Culto Público às 19h.
- **Pequenos Grupos (PGs):** 8 grupos, com encontros no meio da semana nas casas dos membros, conduzidos por líderes de PG. O endereço é passado pessoalmente aos novos membros.
- **Projeto Tatame na Rocha:** projeto social que ensina jiu-jítsu às crianças do bairro, às quartas-feiras às 19h.
- **Missões apoiadas (exemplos):** plantação de igreja no Uruguai com o Rev. Maurício Rolim e Sandra Rolim, a missão Asas de Socorro com Wilker Mariano e outros projetos na África. A igreja divulga o trabalho dos missionários e os pedidos de oração deles.

**Problema:**
Segundo o pastor, o rol de cerca de **320 pessoas** é controlado em **planilhas** mantidas pela secretária, e a maior dificuldade é **saber quem são os membros ativos e quem não é** (seção 3.1). Agenda e missões são divulgadas na própria igreja. Consequências:

- Ninguém sabe com segurança quem é membro ativo hoje.
- Contatos ficam espalhados em celulares pessoais e se perdem quando um líder sai.
- Cultos e eventos são divulgados só por WhatsApp. Avisos se perdem no meio das mensagens.
- A congregação não tem visibilidade dos projetos missionários que apoia nem de quem são os missionários, o que enfraquece o engajamento e a transparência.
- Não há um alerta de quando cada pessoa completa os **6 meses desde a primeira conversa pastoral**. Pessoas que já podem ir para a classe de catecúmenos podem passar despercebidas.
- Os PGs se reúnem em casas de membros. A igreja já protege essas famílias passando o endereço só pessoalmente. Um sistema não pode quebrar esse cuidado.
- O projeto Tatame na Rocha atende crianças do bairro, mas a comunidade em volta tem pouca visibilidade das atividades e de como participar.
- Dados pessoais (inclusive filiação religiosa, que é **dado sensível pela LGPD, art. 5º, II**) circulam sem controle de acesso.

## 3. Métodos de investigação e coleta de evidências

| Método | Com quem | Situação |
|---|---|---|
| Levantamento de informações junto à igreja | Liderança da igreja | **Realizado.** Trouxe a regra dos 6 meses para membresia, a rotina de cultos, os Pequenos Grupos nas casas, o projeto Tatame na Rocha e as missões apoiadas, todos usados no sistema |
| Questionário escrito, enviado por WhatsApp | Rev. Fabrício Ribeiro | **Realizado em 23/11/2026.** Respostas na seção 3.1 |
| Entrevista semiestruturada com a secretária | Secretária | **Não realizada no período** |
| Questionário (Google Forms) | Membros e líderes de ministério | **Não realizado no período** |
| Observação documental e de campo | Planilhas, grupos de WhatsApp, um culto | **Não realizada no período** |

> Limitação: o questionário foi respondido pelo pastor por escrito, de forma curta, e não houve conversa com a secretária, que é quem usa as planilhas. Por isso, o tempo gasto hoje (linha de base da seção 9) não foi medido.

### 3.1 Respostas do pastor (WhatsApp, 23/11/2026)

O aluno enviou as perguntas em seis blocos, e o pastor respondeu numa única mensagem às 14h31. As respostas estão transcritas como ele escreveu.

> Evidência: `docs/evidencias/17-respostas-pastor-whatsapp-1.jpg` e `docs/evidencias/18-respostas-pastor-whatsapp-2.jpg` (prints da conversa).

| Bloco | Pergunta | Resposta do Rev. Fabrício |
|---|---|---|
| Como é hoje | Onde fica o rol de membros? | "Planilhas" |
| | Quantos membros e visitantes? | "320" (um número só, sem separar membros e visitantes) |
| | Quem cuida do cadastro? | "Secretária" |
| | O que mais dá trabalho? | "Saber quem são os membros ativos ou não" |
| Regras | De quando contam os 6 meses? | "Contam a partir da primeira conversa pastoral" |
| | O que acontece depois? | "Classe de catecúmenos, depois profissão de fé pública ou batizado" |
| | E as crianças? | "Mesmo processo para crianças" |
| PGs e contatos | Quantos PGs? | "8 pgs" |
| | O endereço pode aparecer no sistema? | "O endereço dos pgs são passados pessoalmente para novos membros" |
| | Membros veriam o telefone uns dos outros? | "Com autorização" |
| Missões | Há outros projetos? | "Temos outros projetos, na Africa" |
| | Pode aparecer algo além do nome? | "É divulgado na igreja o trabalho que estão desenvolvendo e também os pedidos de oração dos missionários" |

As respostas sobre o teste do sistema e o impacto estão na EP III (seção 9) e na EP IV.

**O que mudou no projeto por causa das respostas:**
- A contagem dos 6 meses passou a partir da **primeira conversa pastoral**, e não da primeira visita. O alerta agora diz que a pessoa pode entrar na **classe de catecúmenos**.
- O sistema passou a orientar a **não cadastrar endereço de casa**. Os PGs aparecem para membros só com dia e horário.
- O consentimento para mostrar contatos, que já existia, foi confirmado.
- Pedidos de oração e os projetos da África entraram nas próximas versões, porque ainda faltam os detalhes.

Perguntas-chave do roteiro original de entrevista, mantidas para a conversa com a secretária:
1. Como vocês sabem hoje quantos membros ativos têm?
2. Onde ficam os contatos? Quem tem acesso?
3. Como a agenda é divulgada? Já houve evento esvaziado por falha de aviso?
4. Quais missões e missionários a igreja apoia? Como a congregação acompanha?
5. Como os PGs são organizados hoje? Quem são os líderes e como os endereços são divulgados?
6. Quantas crianças participam do Tatame na Rocha? Como elas chegam até o projeto?
7. Como vocês acompanham hoje os 6 meses de frequência para a membresia?
8. Quanto tempo por semana a secretaria gasta com isso?

## 4. Público e persona

**Públicos:** secretaria/liderança (administra), membros (consultam), visitantes (veem agenda e missões públicas).

**Persona principal: Márcia, 48 anos, secretária voluntária**
- Trabalha fora durante a semana e cuida da secretaria à noite.
- Usa celular com fluência, computador o básico.
- Dor: "Toda vez que o pastor pede a lista de membros ativos, eu passo uma noite conferindo planilha e WhatsApp."
- Objetivo: ter uma lista confiável e atualizada em poucos cliques.

**Persona secundária: Lucas, 22 anos, membro e jovem do ministério de louvor**
- Dor: "Fico sabendo dos eventos em cima da hora."
- Objetivo: ver a agenda no celular e saber como apoiar as missões.

> As personas são hipóteses construídas a partir das informações levantadas. O pastor confirmou que existe uma secretária e que a maior dor é saber quem são os membros ativos. Nome, idade e falas são ilustrativos.

## 5. Conexão com ODS

**ODS 16: Paz, Justiça e Instituições Eficazes**, meta **16.6** (instituições eficazes, responsáveis e transparentes) e **16.10** (acesso à informação e proteção de liberdades fundamentais). O sistema dá organização e transparência à gestão de uma instituição comunitária e trata dados pessoais conforme a LGPD.

**ODS 3: Saúde e Bem-Estar** e **ODS 10: Redução das Desigualdades**. A agenda pública divulga o projeto Tatame na Rocha, que oferece esporte gratuito às crianças do bairro. Isso amplia o alcance de uma ação social que já existe.

**ODS 17: Parcerias e Meios de Implementação**, meta **17.17** (parcerias da sociedade civil). O módulo de missões dá visibilidade às parcerias da igreja com projetos missionários e sociais, o que estimula o engajamento e o apoio.

## 6. Proposta do MVP

**Nome provisório:** Rebanho (sistema web de gestão para igrejas locais)

Aplicação web responsiva (funciona no celular), com login e dois perfis:
- **Secretaria** (admin): cadastra e edita tudo.
- **Membro**: consulta agenda, missões e a lista de contatos (só dos membros que consentiram).

Módulos do MVP:
1. **Membros:** cadastro, situação (visitante/membro ativo/membro inativo), **data da primeira conversa pastoral**, data de recebimento como membro, filtro por situação e **alerta de visitantes que já completaram 6 meses** e podem entrar na classe de catecúmenos.
2. **Contatos:** lista de telefone/e-mail derivada do cadastro de membros, exibida apenas com **consentimento registrado (LGPD)**.
3. **Agenda:** cultos recorrentes (domingo 09h, 10h e 19h), projetos como o Tatame na Rocha (quarta 19h) e eventos avulsos. Cada evento pode ser **público** ou **só para membros**, para que os PGs apareçam só para membros. O endereço das casas não é cadastrado: continua sendo passado pessoalmente.
4. **Missões:** projetos missionários apoiados, com local e descrição, e os missionários vinculados a cada projeto.

**Fora do MVP (próximas versões):** pedidos de oração dos missionários, módulo de Pequenos Grupos (líderes, participantes e frequência por PG, a definir com os líderes), finanças e dízimos, escalas de ministério, células e pequenos grupos, notificações por WhatsApp/e-mail, aniversariantes do mês, app nativo, check-in em eventos.

## 7. Escopo e histórias de usuário

### Parte 1: Membros e Contatos

| ID | História | Critério de aceite |
|---|---|---|
| US01 | Como **secretária**, quero cadastrar um membro com nome, telefone, e-mail e situação, para manter o quadro atualizado. | Membro salvo aparece na lista. Nome é obrigatório. |
| US10 | Como **secretária**, quero ver os visitantes que já completaram 6 meses desde a primeira conversa pastoral, para convidá-los à classe de catecúmenos. | Lista mostra visitantes com a primeira conversa pastoral há 6 meses ou mais. |
| US02 | Como **secretária**, quero filtrar membros por situação (ativo/inativo/visitante), para responder rapidamente quantos membros ativos existem. | Filtro mostra a contagem total. |
| US03 | Como **secretária**, quero registrar se o membro consentiu em compartilhar seu contato, para cumprir a LGPD. | Sem consentimento, o contato não aparece para outros membros. |
| US04 | Como **membro**, quero consultar a lista de contatos dos irmãos que autorizaram, para me comunicar sem depender de grupos de WhatsApp. | A lista mostra só membros ativos com consentimento. |

### Parte 2: Agenda e Missões

| ID | História | Critério de aceite |
|---|---|---|
| US05 | Como **secretária**, quero cadastrar cultos recorrentes, para não recadastrar toda semana. | O culto aparece em todas as semanas futuras. |
| US06 | Como **secretária**, quero cadastrar eventos avulsos com data, hora, local e descrição. | O evento aparece na agenda na data correta. |
| US07 | Como **membro ou visitante**, quero ver a agenda dos próximos 30 dias no celular. | A agenda abre sem login e é legível no celular. |
| US11 | Como **secretária**, quero marcar um evento como "só membros", para que os PGs não apareçam na agenda pública. | Evento restrito não aparece sem login e aparece para membros logados. |
| US08 | Como **secretária**, quero cadastrar projetos missionários e vincular missionários a eles. | O projeto lista seus missionários. |
| US09 | Como **membro**, quero ver as missões que a igreja apoia e quem está em campo, para orar e contribuir. | Página de missões com projetos e missionários. |

**Priorização (MoSCoW):** Must: US01, US10, US02, US03, US05, US06, US07, US11, US08 · Should: US04, US09.

## 8. Cronograma de trabalho

Alinhado às 4 Experiências Práticas:

| Fase | EP | Entregas |
|---|---|---|
| 1 | EP I: Diagnóstico e planejamento | Levantamento junto à igreja, escopo, histórias, este documento |
| 2 | EP II: Fundamentação e desenho do MVP | Requisitos, modelo de dados, protótipo de telas, arquitetura |
| 3 | EP III: Execução e evidências | Implementação de todos os módulos, testes, CI, pull requests |
| 4 | EP IV: Impacto e encerramento | Segurança, publicação, monitoramento, documentação final |

O desenvolvimento foi concentrado em novembro de 2026, e a entrega ocorre na reabertura de 04 a 07/12/2026.

## 9. Indicadores de resultado

| Indicador | Linha de base (hoje) | Meta com o MVP |
|---|---|---|
| Tempo para gerar a lista de membros ativos | Não medido | < 1 minuto |
| % de membros com cadastro completo | 0 de cerca de 320 no sistema (hoje em planilhas) | ≥ 90% em 2 meses |
| % de contatos com consentimento LGPD registrado | 0% | 100% dos exibidos |
| Membros que acessam a agenda pelo sistema | 0 | ≥ 50% dos ativos em 2 meses |
| Visitantes aptos à membresia identificados automaticamente | 0 (controle manual) | 100% |
| Projetos missionários visíveis à congregação | Nenhum canal único | 100% dos apoiados |
| Satisfação da secretaria (escala 1 a 5) | — | ≥ 4 |

## 10. Revisão da experiência prática

A hipótese inicial era um cadastro simples de membros e contatos. As informações da igreja acrescentaram três requisitos que não estavam no plano: a regra de 6 meses para a membresia, a necessidade de esconder os endereços dos Pequenos Grupos e a divulgação do projeto social Tatame na Rocha. O questionário ao pastor, respondido depois do planejamento, corrigiu uma suposição: os 6 meses contam da primeira conversa pastoral, e não da primeira visita. O ponto fraco desta etapa foi ter feito essa pergunta tarde e não ter medido o tempo que a secretária gasta hoje, o que limita a comparação de impacto na EP IV.

## 11. Autoavaliação e reflexão

Escolhi a Igreja Presbiteriana de Vila Formosa porque sou membro dela e quis ajudar. No começo, eu achava que o sistema seria só uma lista de membros e contatos. Não imaginava que a igreja tivesse regras que mudariam o projeto, como o processo de membresia e o cuidado com o endereço dos Pequenos Grupos.

A parte mais difícil desta etapa foi escrever a documentação: personas, histórias de usuário e indicadores. Eu prefiro ver o sistema funcionando, mas entendi que, sem esse planejamento, eu teria construído a coisa errada. Se fosse começar de novo, envolveria a secretária desde o início, porque é ela quem vai usar o sistema todos os dias e quem conhece as planilhas de hoje.
