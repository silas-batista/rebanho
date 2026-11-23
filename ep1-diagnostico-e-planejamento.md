# Experiência Prática I: Diagnóstico e Planejamento

> Rascunho para colar no DreamShaper na reabertura (04 a 07/12/2026).
> Tudo marcado com **[PREENCHER]** depende de dados reais do parceiro. Não invente: a tutoria avalia evidência de contato real.

---

## 1. Identificação do aluno

- Nome: Silas Batista de Deus
- Curso: CST em Análise e Desenvolvimento de Sistemas (EAD)
- Disciplina: Projeto de Software (CVCS_EAD_2273346, Turma_001)

## 2. Parceiro e problema local

**Parceiro:** Igreja Presbiteriana de Vila Formosa (Anápolis, GO) [PREENCHER: nº aproximado de membros]
**Contato responsável:** Rev. Fabrício Ribeiro, pastor da igreja

**Regra de negócio levantada:** para se tornar membro, a pessoa precisa frequentar a igreja por **6 meses**.

**Rotina e atividades da igreja:**
- **Domingo:** Culto Público às 09h, Escola Dominical às 10h e Culto Público às 19h.
- **Pequenos Grupos (PGs):** encontros no meio da semana nas casas dos membros, conduzidos por líderes de PG.
- **Projeto Tatame na Rocha:** projeto social que ensina jiu-jítsu às crianças do bairro, às quartas-feiras às 19h.
- **Missões apoiadas (exemplos):** plantação de igreja no Uruguai com o Rev. Maurício Rolim e Sandra Rolim, e a missão Asas de Socorro com Wilker Mariano, entre outras.

**Problema:**
A igreja controla membros, contatos, agenda e missões de forma descentralizada: planilhas, cadernos, grupos de WhatsApp e a memória de poucas pessoas. Consequências:

- Ninguém sabe com segurança quem é membro ativo hoje.
- Contatos ficam espalhados em celulares pessoais e se perdem quando um líder sai.
- Cultos e eventos são divulgados só por WhatsApp. Avisos se perdem no meio das mensagens.
- A congregação não tem visibilidade dos projetos missionários que apoia nem de quem são os missionários, o que enfraquece o engajamento e a transparência.
- Não há registro de quando cada visitante começou a frequentar. Por isso fica difícil saber quem já cumpriu os **6 meses exigidos para a membresia**, e pessoas aptas podem passar despercebidas.
- Os PGs se reúnem em casas de membros. Divulgar endereços em grupos abertos ou em uma agenda pública expõe essas famílias.
- O projeto Tatame na Rocha atende crianças do bairro, mas a comunidade em volta tem pouca visibilidade das atividades e de como participar.
- Dados pessoais (inclusive filiação religiosa, que é **dado sensível pela LGPD, art. 5º, II**) circulam sem controle de acesso.

## 3. Métodos de investigação e coleta de evidências

| Método | Com quem | Evidência gerada |
|---|---|---|
| Entrevista semiestruturada | Pastor e secretário(a) | Anotações/áudio autorizado [PREENCHER data] |
| Questionário curto (Google Forms) | Membros e líderes de ministério | Nº de respostas e gráficos [PREENCHER] |
| Observação documental | Planilhas, cadernos, grupos de WhatsApp atuais | Prints anonimizados, contagem de registros duplicados/desatualizados |
| Observação de campo | Um culto e um evento | Como os avisos são feitos hoje |

Perguntas-chave da entrevista:
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

> [PREENCHER: ajustar as personas com base nas entrevistas reais]

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
1. **Membros:** cadastro, situação (visitante/membro ativo/membro inativo), **data da primeira frequência**, data de recebimento como membro, filtro por situação e **alerta de visitantes que já completaram 6 meses** e estão aptos à membresia.
2. **Contatos:** lista de telefone/e-mail derivada do cadastro de membros, exibida apenas com **consentimento registrado (LGPD)**.
3. **Agenda:** cultos recorrentes (domingo 09h, 10h e 19h), projetos como o Tatame na Rocha (quarta 19h) e eventos avulsos. Cada evento pode ser **público** ou **só para membros**, para que os endereços dos PGs nas casas não fiquem expostos.
4. **Missões:** projetos missionários apoiados, com local e descrição, e os missionários vinculados a cada projeto.

**Fora do MVP (próximas versões):** módulo de Pequenos Grupos (líderes, participantes e frequência por PG, a definir com os líderes), finanças e dízimos, escalas de ministério, células e pequenos grupos, notificações por WhatsApp/e-mail, aniversariantes do mês, app nativo, check-in em eventos.

## 7. Escopo e histórias de usuário

### Parte 1: Membros e Contatos

| ID | História | Critério de aceite |
|---|---|---|
| US01 | Como **secretária**, quero cadastrar um membro com nome, telefone, e-mail e situação, para manter o quadro atualizado. | Membro salvo aparece na lista. Nome é obrigatório. |
| US10 | Como **secretária**, quero ver os visitantes que já completaram 6 meses de frequência, para encaminhá-los ao processo de membresia. | Lista mostra visitantes com primeira frequência há 6 meses ou mais, com a data em que completaram o prazo. |
| US02 | Como **secretária**, quero filtrar membros por situação (ativo/inativo/visitante), para responder rapidamente quantos membros ativos existem. | Filtro mostra a contagem total. |
| US03 | Como **secretária**, quero registrar se o membro consentiu em compartilhar seu contato, para cumprir a LGPD. | Sem consentimento, o contato não aparece para outros membros. |
| US04 | Como **membro**, quero consultar a lista de contatos dos irmãos que autorizaram, para me comunicar sem depender de grupos de WhatsApp. | A lista mostra só membros ativos com consentimento. |

### Parte 2: Agenda e Missões

| ID | História | Critério de aceite |
|---|---|---|
| US05 | Como **secretária**, quero cadastrar cultos recorrentes, para não recadastrar toda semana. | O culto aparece em todas as semanas futuras. |
| US06 | Como **secretária**, quero cadastrar eventos avulsos com data, hora, local e descrição. | O evento aparece na agenda na data correta. |
| US07 | Como **membro ou visitante**, quero ver a agenda dos próximos 30 dias no celular. | A agenda abre sem login e é legível no celular. |
| US11 | Como **secretária**, quero marcar um evento como "só membros", para que o endereço de um PG não apareça na agenda pública. | Evento restrito não aparece sem login e aparece para membros logados. |
| US08 | Como **secretária**, quero cadastrar projetos missionários e vincular missionários a eles. | O projeto lista seus missionários. |
| US09 | Como **membro**, quero ver as missões que a igreja apoia e quem está em campo, para orar e contribuir. | Página de missões com projetos e missionários. |

**Priorização (MoSCoW):** Must: US01, US10, US02, US03, US05, US06, US07, US11, US08 · Should: US04, US09.

## 8. Cronograma de trabalho

Alinhado às 4 Experiências Práticas:

| Fase | EP | Entregas |
|---|---|---|
| 1 | EP I: Diagnóstico e planejamento | Entrevistas, questionário, escopo, histórias, este documento |
| 2 | EP II: Fundamentação e desenho do MVP | Requisitos, modelo de dados, protótipo de telas, arquitetura |
| 3 | EP III | Implementação: Membros, Contatos, Agenda |
| 4 | EP IV | Implementação: Missões, testes com a secretaria, implantação e apresentação |

[PREENCHER: datas reais conforme o calendário da reabertura e do próximo período]

## 9. Indicadores de resultado

| Indicador | Linha de base (hoje) | Meta com o MVP |
|---|---|---|
| Tempo para gerar a lista de membros ativos | [PREENCHER, ex.: ~2h] | < 1 minuto |
| % de membros com cadastro completo | [PREENCHER] | ≥ 90% em 2 meses |
| % de contatos com consentimento LGPD registrado | 0% | 100% dos exibidos |
| Membros que acessam a agenda pelo sistema | 0 | ≥ 50% dos ativos em 2 meses |
| Visitantes aptos à membresia identificados automaticamente | 0 (controle manual) | 100% |
| Projetos missionários visíveis à congregação | [PREENCHER] | 100% dos apoiados |
| Satisfação da secretaria (escala 1 a 5) | — | ≥ 4 |

## 10. Revisão da experiência prática

[PREENCHER após as entrevistas: o que mudou entre a hipótese inicial e o que o parceiro relatou]

## 11. Autoavaliação e reflexão

[PREENCHER: o que aprendeu sobre levantar requisitos com um cliente real, dificuldades e o que faria diferente]
