const mongoose = require('mongoose');
require('./config/db');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//Hace un require a ENV con DOTENV
require('dotenv').config({
    path : 'varianles.env'
})

const app = express();

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
app.use('/', router());

app.listen(process.env.PUERTO, () => {
    console.log('App listening on port 3000!');
});