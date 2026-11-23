import { gerarHash, conferirSenha } from "./senhas.js";

export const PERFIS = ["secretaria", "membro"];
const TAMANHO_MINIMO_SENHA = 8;

// Conferido quando o e-mail não existe, para o tempo de resposta não revelar quais e-mails estão cadastrados.
const HASH_FICTICIO = gerarHash("senha-ficticia");

export class UsuarioInvalidoError extends Error {}

function validarSenha(senha) {
  if (!senha || senha.length < TAMANHO_MINIMO_SENHA) {
    throw new UsuarioInvalidoError(`A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres`);
  }
}

export function criarUsuario(banco, { email, senha, perfil, pessoaId = null }) {
  if (!email?.includes("@")) throw new UsuarioInvalidoError("E-mail inválido");
  validarSenha(senha);
  if (!PERFIS.includes(perfil)) throw new UsuarioInvalidoError("Perfil inválido");
  if (banco.prepare("SELECT 1 FROM usuarios WHERE email = ?").get(email.trim())) {
    throw new UsuarioInvalidoError("E-mail já cadastrado");
  }

  banco
    .prepare("INSERT INTO usuarios (email, senha_hash, perfil, pessoa_id) VALUES (?, ?, ?, ?)")
    .run(email.trim(), gerarHash(senha), perfil, pessoaId);
}

export function listarUsuarios(banco) {
  return banco
    .prepare("SELECT id, email, perfil FROM usuarios ORDER BY email")
    .all()
    .map((usuario) => ({ ...usuario }));
}

export function alterarSenha(banco, id, { atual, nova }) {
  const usuario = banco.prepare("SELECT senha_hash FROM usuarios WHERE id = ?").get(id);
  if (!usuario || !conferirSenha(atual ?? "", usuario.senha_hash)) {
    throw new UsuarioInvalidoError("Senha atual incorreta");
  }
  validarSenha(nova);
  banco.prepare("UPDATE usuarios SET senha_hash = ? WHERE id = ?").run(gerarHash(nova), id);
}

export function autenticar(banco, email, senha) {
  const usuario = banco.prepare("SELECT * FROM usuarios WHERE email = ?").get(email?.trim() ?? "");
  const senhaConfere = conferirSenha(senha ?? "", usuario?.senha_hash ?? HASH_FICTICIO);
  if (!usuario || !senhaConfere) return null;
  return { id: usuario.id, email: usuario.email, perfil: usuario.perfil };
}

export function buscarUsuario(banco, id) {
  const usuario = banco.prepare("SELECT id, email, perfil FROM usuarios WHERE id = ?").get(id);
  return usuario ? { ...usuario } : null;
}
