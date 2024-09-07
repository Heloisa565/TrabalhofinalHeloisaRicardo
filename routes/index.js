const express = require('express');
const path = require('path');
const router = express.Router();

// Rota para a página inicial
router.get('/', (req, res) => {
    res.render('index');
});

// Rota para a página "Sobre"
router.get('/about', (req, res) => {
    res.render('sobre');
});

// Rota para processar o formulário de contato
router.post('/contato', (req, res) => {
    const { name, email, phone } = req.body;
    // Aqui você pode adicionar lógica para salvar as informações ou enviar um e-mail
    console.log('Contato recebido:', { name, email, phone });
    res.redirect('/'); // Redireciona de volta para a página inicial
});

// Rota para processar o formulário de solicitação de serviço
router.post('/solicitar-servico', (req, res) => {
    const { service, details } = req.body;
    // Aqui você pode adicionar lógica para salvar a solicitação ou processar o pedido
    console.log('Serviço solicitado:', { service, details });
    res.redirect('/'); // Redireciona de volta para a página inicial
});

module.exports = router;
