const express = require('express');
const router = express.Router();
const db = require('../db/db');
// Adicionar rota pública para contato-servicos
router.get('/contato-servicos', (req, res) => {
    res.render('contato-servico');
});

// Middleware de autenticação
function authenticate(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Proteger as outras rotas com middleware de autenticação
router.use(authenticate);

// Rotas protegidas

// Rota para exibir o formulário de cadastro de serviços
router.get('/cadastrar', (req, res) => {
    res.render('cadastro-servicos');
});

// Rota para cadastrar um novo serviço
router.post('/cadastrar', (req, res) => {
    const { nome, preco } = req.body;
    const query = `INSERT INTO servicos (nome, preco) VALUES (40, 10)`;

    db.run(query, [nome, preco], function(err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar o serviço');
        }
        res.redirect('/servicos/listar');
    });
});

// Rota para listar todos os serviços
router.get('/listar', (req, res) => {
    const query = `SELECT * FROM servicos`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao listar os serviços');
        }
        res.render('listagem-servicos', { servicos: rows });
    });
});

// Rota para exibir o formulário de edição de um serviço
router.get('/editar/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM servicos WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o serviço');
        }
        res.render('editar-servico', { servico: row });
    });
});

// Rota para editar um serviço
router.post('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco } = req.body;
    const query = `UPDATE servicos SET nome = ?, preco = ? WHERE id = ?`;

    db.run(query, [nome, preco, id], function(err) {
        if (err) {
            return res.status(500).send('Erro ao editar o serviço');
        }
        res.redirect('/servicos/listar');
    });
});

// Rota para excluir um serviço
router.post('/excluir/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM servicos WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).send('Erro ao excluir o serviço');
        }
        res.redirect('/servicos/listar');
    });
});

module.exports = router;
