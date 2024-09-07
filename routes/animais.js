const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Rota para exibir o formulário de cadastro de animais
router.get('/cadastrar', (req, res) => {
    res.render('cadastro-animais'); 
});

// Rota para cadastrar um novo animal
router.post('/cadastrar', (req, res) => {
    const { nome, raca, idade } = req.body; 
    console.log('Dados recebidos:', { nome, raca, idade }); 

    const query = `INSERT INTO animais (nome, raca, idade) VALUES (?, ?, ?)`;
    
    db.run(query, [nome, raca, idade], function(err) {
        if (err) {
            console.error('Erro ao cadastrar o animal:', err.message);
            return res.status(500).send('Erro ao cadastrar o animal');
        }
        console.log('Animal cadastrado com ID:', this.lastID); // Verifica o ID do último inserido
        res.redirect('/animais/listar'); // Redireciona para a rota de listagem após o cadastro
    });
});

// Rota para listar todos os animais
router.get('/listar', (req, res) => {
    const query = `SELECT * FROM animais`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erro ao listar os animais:', err.message);
            return res.status(500).send('Erro ao listar os animais');
        }
        // Renderiza a página 'listagem-animais.hbs' passando os animais para exibição
        res.render('listagem-animais', { animais: rows });
    });
});

// Rota para exibir o formulário de edição de um animal
router.get('/editar/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM animais WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Erro ao buscar o animal:', err.message);
            return res.status(500).send('Erro ao buscar o animal');
        }
        res.render('editar-animal', { animal: row });
    });
});

// Rota para editar um animal
router.post('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nome, raca, idade } = req.body;
    const query = `UPDATE animais SET nome = ?, raca = ?, idade = ? WHERE id = ?`;

    db.run(query, [nome, raca, idade, id], function(err) {
        if (err) {
            console.error('Erro ao editar o animal:', err.message);
            return res.status(500).send('Erro ao editar o animal');
        }
        res.redirect('/animais/listar');
    });
});

// Rota para excluir um animal
router.post('/excluir/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM animais WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            console.error('Erro ao excluir o animal:', err.message);
            return res.status(500).send('Erro ao excluir o animal');
        }
        res.redirect('/animais/listar');
    });
});

module.exports = router;
