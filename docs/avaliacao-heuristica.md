# Avaliação heurística do Rebanho

> **O que é:** inspeção de usabilidade pelas 10 heurísticas de Nielsen, feita sem usuários.
> **Quem fez:** o aluno, com apoio de assistente de IA, em 23/11/2026, sobre uma cópia local do sistema com dados fictícios.
> **O que não é:** não substitui a validação com a secretaria e o pastor (EP III, seções 9 e 10), que foi feita só de forma reduzida: o pastor avaliou o sistema publicado com nota 5, mas a secretária ainda não executou as tarefas. Uma avaliação heurística encontra problemas prováveis. Só o uso real confirma quais atrapalham de fato.

## Método

- Perfis inspecionados: visitante (sem login), membro e secretaria.
- Telas: agenda, missões, contatos, pessoas, cadastro e edição de pessoa, novo evento, usuários, minha senha, login, páginas de erro.
- Celular simulado com 360 px de largura, medindo a largura real das páginas.
- Gravidade na escala de Nielsen: 0 (não é problema) a 4 (catástrofe).

## Problemas encontrados

| # | Heurística | Problema | Gravidade | Situação |
|---|---|---|---|---|
| 1 | Flexibilidade e eficiência / responsividade | No celular de 360 px, o cabeçalho da secretaria ocupava **634 px** e a página inteira rolava para o lado. Contradizia o requisito RNF01 da EP II | **3** | ✅ Corrigido: o menu quebra em linhas. Medido depois: 360 px em todas as páginas |
| 2 | Prevenção de erros | O formulário de evento mostrava ao mesmo tempo os campos de culto semanal e de evento único. Era possível escolher "toda semana" e preencher só a data | **3** | ✅ Corrigido: só aparece o grupo do tipo escolhido |
| 3 | Ajudar a reconhecer e corrigir erros / consistência | Endereço inexistente mostrava "Not Found" ou "Cannot GET" em inglês. Um erro interno mostraria a mensagem técnica padrão | **2** | ✅ Corrigido: páginas em português, sem detalhes técnicos, com link de volta |
| 4 | Visibilidade do status do sistema | Depois de salvar pessoa, evento, projeto, missionário ou acesso, a tela voltava para a lista sem confirmar nada | **2** | ✅ Corrigido: aviso "Pessoa salva.", "Evento salvo." etc. As mensagens são fixas, e a URL não consegue injetar texto na página |
| 5 | Controle e liberdade do usuário | Eventos e projetos missionários podem ser cadastrados, mas não editados nem excluídos. Um erro de digitação fica para sempre | **3** | ✅ Corrigido: editar e excluir, com confirmação obrigatória antes de excluir, e remover missionário |
| 6 | Reconhecer em vez de lembrar | A lista de pessoas não mostra há quanto tempo cada visitante frequenta. A secretaria precisa abrir o cadastro para saber | **1** | ✅ Corrigido: "Visitante · 7 meses" na lista |
| 7 | Ajuda e documentação | A regra dos 6 meses não aparece explicada na tela. Quem não conhece a regra não entende o alerta de aptos | **1** | ✅ Corrigido: o alerta explica a regra |
| 8 | Estética e design minimalista | No celular, o cabeçalho da secretaria ocupa 162 px de altura, por causa dos 7 itens de menu | **1** | ⏳ Pendente (menu recolhível) |

## O que já atende bem

| Heurística | Evidência |
|---|---|
| Correspondência com o mundo real | Termos da igreja: membro, visitante, PG, culto, missões. Datas no formato brasileiro (DOM 29/11 · 19h00) |
| Prevenção de erros | Senha mínima de 8 caracteres, e-mail duplicado recusado, PG "só membros" por padrão seguro |
| Mensagens de erro | "E-mail ou senha incorretos", "Nome é obrigatório", "Muitas tentativas. Tente novamente em 15 minutos" |
| Acessibilidade | Rótulo em todo campo, foco visível, `lang="pt-BR"`, contraste alto no cabeçalho |

## Resultado

Foram encontrados **8 problemas**: 3 de gravidade 3, 2 de gravidade 2 e 3 de gravidade 1. **7 foram corrigidos** no mesmo dia, em dois pull requests (#14 e #15), com testes automatizados (106 testes no total, contando as correções posteriores). Fica pendente só o menu alto no celular (gravidade 1). A validação com a igreja vai dizer quais problemas realmente atrapalham e quais faltaram.
