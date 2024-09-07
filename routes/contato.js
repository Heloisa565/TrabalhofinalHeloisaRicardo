const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

// Rota para exibir a página de contato e serviços
router.get('/', (req, res) => {
    const queryContatos = `SELECT * FROM contatos`;
    const queryServicos = `SELECT * FROM servicos`;

    db.all(queryContatos, [], (err, contatos) => {
        if (err) {
            return res.status(500).send('Erro ao carregar contatos');
        }

        db.all(queryServicos, [], (err, servicos) => {
            if (err) {
                return res.status(500).send('Erro ao carregar serviços');
            }

            res.render('contato-servico', { contatos, servicos });
        });
    });
});

module.exports = router;
