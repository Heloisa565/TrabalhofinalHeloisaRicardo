const express = require('express');
const session = require('express-session');
const app = express();

const indexRouter = require('./routes/index');
const animaisRouter = require('./routes/animais');
const veterinariosRouter = require('./routes/veterinarios');
const servicosRouter = require('./routes/servicos');
const pagamentosRouter = require('./routes/pagamentos');
const loginRouter = require('./routes/login');
const contatoRouter = require('./routes/contato'); // Importar o router de contato

// Rota pública de contato e serviços
app.use('/contato-servicos', contatoRouter);

// Middleware de sessão
app.use(session({
    secret: 'ÁREA RESTRITA', 
    resave: false,
    saveUninitialized: true
}));
// Middleware de autenticação
function authenticate(req, res, next) {
    if (req.session.authenticated) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Configurações e middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar o diretório de views e o template engine
app.set('view engine', 'hbs');
app.set('views', './views');

// Servir arquivos estáticos
app.use(express.static('public'));

// Usar as rotas com autenticação
app.use('/animais', authenticate, animaisRouter);
app.use('/veterinarios', authenticate, veterinariosRouter);
app.use('/pagamentos', authenticate, pagamentosRouter);
app.use('/servicos', authenticate, servicosRouter);

// Rota de login
app.use('/login', loginRouter); // Usar o router de login

// Usar o router de index
app.use('/', indexRouter);

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

