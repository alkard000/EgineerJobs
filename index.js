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

app.listen(process.env.PUERTO, () => {
    console.log('App listening on port 3000!');
});