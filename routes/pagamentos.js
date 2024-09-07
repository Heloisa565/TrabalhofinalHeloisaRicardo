const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Rota para exibir o formulário de registro de pagamentos
router.get('/registrar', async (req, res) => {
    try {
        // Buscar todos os animais e serviços para preencher os selects
        const animaisQuery = 'SELECT id, nome FROM animais';
        const servicosQuery = 'SELECT id, nome FROM servicos';

        const [animais, servicos] = await Promise.all([
            db.all(animaisQuery),
            db.all(servicosQuery)
        ]);

        res.render('registro-pagamentos', { animais, servicos });
    } catch (err) {
        res.status(500).send('Erro ao carregar os dados');
    }
});

// Rota para registrar um novo pagamento
router.post('/registrar', (req, res) => {
    const { valor, data, animal_id, servico_id } = req.body;
    const query = `INSERT INTO pagamentos (valor, data, animal_id, servico_id) VALUES (?, ?, ?, ?)`;

    db.run(query, [valor, data, animal_id, servico_id], function(err) {
        if (err) {
            return res.status(500).send('Erro ao registrar o pagamento');
        }
        res.redirect('/pagamentos/listar');
    });
});

// Rota para listar todos os pagamentos
router.get('/listar', (req, res) => {
    // Obter o parâmetro de ordenação da consulta, com 'id' como padrão
    const sort = req.query.sort || 'id';
    
    // Evitar injeção SQL, permitindo apenas colunas específicas
    const validSortColumns = ['id', 'valor', 'data'];
    if (!validSortColumns.includes(sort)) {
        return res.status(400).send('Parâmetro de ordenação inválido');
    }

    const query = `SELECT * FROM pagamentos ORDER BY ${sort}`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao listar os pagamentos');
        }
        res.render('listagem-pagamentos', { pagamentos: rows });
    });
});

// Rota para exibir o formulário de edição de um pagamento
router.get('/editar/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM pagamentos WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o pagamento');
        }
        res.render('editar-pagamento', { pagamento: row });
    });
});

// Rota para editar um pagamento
router.post('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { valor, data } = req.body;
    const query = `UPDATE pagamentos SET valor = ?, data = ? WHERE id = ?`;

    db.run(query, [valor, data, id], function(err) {
        if (err) {
            return res.status(500).send('Erro ao editar o pagamento');
        }
        res.redirect('/pagamentos/listar');
    });
});

// Rota para excluir um pagamento
router.post('/excluir/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM pagamentos WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).send('Erro ao excluir o pagamento');
        }
        res.redirect('/pagamentos/listar');
    });
});

module.exports = router;
