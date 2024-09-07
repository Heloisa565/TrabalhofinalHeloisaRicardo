const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados
const dbPath = path.resolve(__dirname, 'meupet.db'); 

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Ativar suporte a chaves estrangeiras
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('Erro ao ativar chaves estrangeiras:', err.message);
            }
        });
    }
});

// Criando tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS animais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            raca TEXT NOT NULL,
            idade INTEGER NOT NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela animais:', err.message);
        else console.log('Tabela animais criada com sucesso.');
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS veterinarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            crmv TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela veterinarios:', err.message);
        else console.log('Tabela veterinarios criada com sucesso.');
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS contatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            telefone TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela contatos:', err.message);
        else console.log('Tabela contatos criada com sucesso.');
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela servicos:', err.message);
        else console.log('Tabela servicos criada com sucesso.');
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS solicitacoes_servico (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            animal_id INTEGER,
            servico_id INTEGER,
            data_solicitacao TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (animal_id) REFERENCES animais(id),
            FOREIGN KEY (servico_id) REFERENCES servicos(id)
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela solicitacoes_servico:', err.message);
        else console.log('Tabela solicitacoes_servico criada com sucesso.');
    });
});

module.exports = db;
