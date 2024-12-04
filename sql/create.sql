CREATE TABLE IF NOT EXISTS formacoes (
    formacao_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    hash_senha TEXT NOT NULL,
    descricao_perfil TEXT,
    imagem_perfil BLOB
);

CREATE TABLE IF NOT EXISTS redes_sociais (
    rede_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    rede_nome TEXT NOT NULL,
    perfil TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
);

CREATE TABLE IF NOT EXISTS experiencias (
    experiencia_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL
);