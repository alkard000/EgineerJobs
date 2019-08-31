//---------DEPENDENCIAS------------//
const mongoose = require('mongoose');
require('./config/db');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const createError = require('http-errors');
const passport = require('./config/passport');

//Hace un require a ENV con DOTENV
require('dotenv').config({
    path : 'variables.env'
})

const app = express();

//Habilitar BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

//Validaciones
app.use(expressValidator());

//Habilitar Handlebars ----------->> TEMPLATE ENGINE
app.engine('handlebars',  
    exphbs({
        defaultLayout : 'layout',
        helpers : require('./helpers/handlebars')
    })
);
app.set('view engine', 'handlebars');
//----------------------------------------//
//Archivos Estaticos -------------->> PUBLIC, CSS, IMGS
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
//Session con MONGOOSE ----------------------
app.use(session({
    secret : process.env.SECRETO,
    key : process.env.KEY,
    resave : false,
    saveUninitialized : false,
    store : new MongoStore({mongooseConnection : mongoose.connection})
}))
//---------------------------------------//
//INICIAR PASSPORT-----------------------//
app.use(passport.initialize());
app.use(passport.session());
//---------------------------------------//
//Alertas
app.use(flash());
//crar middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', router());

//404 - Page not found
app.use((req, res, next) => {
    next(createError(404, 'No encontrado'))
});
//ADMINISTRACION de errores
app.use((error, req, res) => {
    res.locals.mensaje = error.mensaje;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error', {

    })
})

app.listen(process.env.PUERTO, () => {
    console.log('App listening on port 3000!');
});