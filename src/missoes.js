export class MissaoInvalidaError extends Error {}

function validarProjeto({ nome, local, descricao }) {
  if (!nome?.trim()) throw new MissaoInvalidaError("Nome do projeto é obrigatório");
  return [nome.trim(), local || null, descricao || null];
}

export function criarProjeto(banco, dados) {
  const { lastInsertRowid } = banco
    .prepare("INSERT INTO projetos_missionarios (nome, local, descricao) VALUES (?, ?, ?)")
    .run(...validarProjeto(dados));
  return Number(lastInsertRowid);
}

export function atualizarProjeto(banco, id, dados) {
  banco.prepare("UPDATE projetos_missionarios SET nome = ?, local = ?, descricao = ? WHERE id = ?").run(...validarProjeto(dados), id);
}

export function excluirProjeto(banco, id) {
  banco.exec("BEGIN");
  banco.prepare("DELETE FROM missionarios WHERE projeto_missionario_id = ?").run(id);
  banco.prepare("DELETE FROM projetos_missionarios WHERE id = ?").run(id);
  banco.exec("COMMIT");
}

export function buscarProjeto(banco, id) {
  return listarProjetos(banco).find((projeto) => projeto.id === id) ?? null;
}

export function removerMissionario(banco, id) {
  banco.prepare("DELETE FROM missionarios WHERE id = ?").run(id);
}

export function adicionarMissionario(banco, projetoId, { nome }) {
  if (!nome?.trim()) throw new MissaoInvalidaError("Nome do missionário é obrigatório");
  if (!banco.prepare("SELECT 1 FROM projetos_missionarios WHERE id = ?").get(projetoId)) {
    throw new MissaoInvalidaError("Projeto não encontrado");
  }
  banco.prepare("INSERT INTO missionarios (projeto_missionario_id, nome) VALUES (?, ?)").run(projetoId, nome.trim());
}

export function listarProjetos(banco) {
  const missionarios = banco.prepare("SELECT * FROM missionarios ORDER BY id").all();
  return banco
    .prepare("SELECT * FROM projetos_missionarios WHERE ativo = 1 ORDER BY nome")
    .all()
    .map((projeto) => ({
      id: projeto.id,
      nome: projeto.nome,
      local: projeto.local,
      descricao: projeto.descricao,
      missionarios: missionarios
        .filter((m) => m.projeto_missionario_id === projeto.id)
        .map((m) => ({ id: m.id, nome: m.nome })),
    }));
}
