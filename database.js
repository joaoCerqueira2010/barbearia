const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'navalhas.db'));
db.pragma('journal_mode = WAL');

// Cria as tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS barbeiros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    ativo INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    servico TEXT NOT NULL,
    barbeiro_id INTEGER,
    data TEXT NOT NULL,
    hora TEXT NOT NULL,
    status TEXT DEFAULT 'confirmado',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_agenda_unica
    ON agendamentos(data, hora, barbeiro_id)
    WHERE status = 'confirmado';
`);

// Insere barbeiros padrão se estiver vazio
const total = db.prepare('SELECT COUNT(*) AS n FROM barbeiros').get().n;
if (total === 0) {
  const insert = db.prepare('INSERT INTO barbeiros (nome) VALUES (?)');
  ['Rafael', 'Diego', 'Bruno'].forEach(n => insert.run(n));
}

module.exports = db;