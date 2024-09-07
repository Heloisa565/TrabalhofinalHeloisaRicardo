const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Rota para exibir o formulário de cadastro de veterinários
router.get('/cadastrar', (req, res) => {
    res.render('cadastro-veterinarios');
});

// Rota para cadastrar um novo veterinário
router.post('/cadastrar', (req, res) => {
    const { nome, crmv } = req.body;
    const query = `INSERT INTO veterinarios (nome, crmv) VALUES (?, ?)`;

    db.run(query, [nome, crmv], function(err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar o veterinário');
        }
        res.redirect('/veterinarios/listar');
    });
});

// Rota para listar todos os veterinários
router.get('/listar', (req, res) => {
    const query = `SELECT * FROM veterinarios`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao listar os veterinários');
        }
        res.render('listagem-veterinarios', { veterinarios: rows });
    });
});

// Rota para exibir o formulário de edição de um veterinário
router.get('/editar/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM veterinarios WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o veterinário');
        }
        res.render('editar-veterinario', { veterinario: row });
    });
});

// Rota para editar um veterinário
router.post('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nome, crmv } = req.body;
    const query = `UPDATE veterinarios SET nome = ?, crmv = ? WHERE id = ?`;

    db.run(query, [nome, crmv, id], function(err) {
        if (err) {
            return res.status(500).send('Erro ao editar o veterinário');
        }
        res.redirect('/veterinarios/listar');
    });
});

// Rota para excluir um veterinário
router.post('/excluir/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM veterinarios WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).send('Erro ao excluir o veterinário');
        }
        res.redirect('/veterinarios/listar');
    });
});

module.exports = router;
