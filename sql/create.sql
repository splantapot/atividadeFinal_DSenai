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

CREATE TABLE IF NOT EXISTS portfolios (
    portfolio_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    data_criacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    acesso_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
    FOREIGN KEY (acesso_id) REFERENCES acessos(acesso_id)
);

CREATE TABLE IF NOT EXISTS acessos (
    acesso_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comentarios (
    comentario_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    autor TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    data TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id)
);

CREATE TABLE IF NOT EXISTS temas (
    tema_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    codigo TEXT NOT NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id)
);

CREATE TABLE IF NOT EXISTS informacoes (
    informacao_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    formacao TEXT,
    experiencia TEXT,
    habilidades TEXT,
    especialidade TEXT,
    interesse TEXT,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id)
);

CREATE TABLE IF NOT EXISTS projetos (
    projeto_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_capa BLOB,
    descricao_tecnologias TEXT,
    data TEXT,
    link TEXT,
    demo INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id)
);

CREATE TABLE IF NOT EXISTS imagens(
    imagem_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    projeto_id INTEGER NOT NULL,
    imagem_titulo TEXT NOT NULL,
    imagem_dados BLOB NOT NULL
);