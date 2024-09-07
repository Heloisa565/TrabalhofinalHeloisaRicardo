const express = require('express');
const router = express.Router();

// Renderiza o formulário de login
router.get('/', (req, res) => {
    res.render('login');
});

// Processa o login para a área administrativa
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Verifique as credenciais (usuário e senha) 
    if (username === 'colegas' && password === '123') { 
        req.session.authenticated = true;
        res.redirect('/animais'); // Redireciona para a área administrativa
    } else {
        res.status(401).send('Credenciais inválidas');
    }
});

module.exports = router;
